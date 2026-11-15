// Opengrep has no TSRX parser, so it never sees .tsrx files on its own. This scans them through the
// TSX the Octane compiler emits (`compileToVolarMappings`, the same output tsrs type-checks) and maps
// every finding back to its line in the .tsrx source:
//   node tools/opengrep-tsrx.ts <rules dir> <src dir...>
// Virtual files keep their repo path plus `.tsx` (frontend/src/app/App.tsrx.tsx), so the rules'
// `paths` filters apply to them as they do to the real files.
import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, relative, resolve } from "node:path";
import { compileToVolarMappings } from "octane/compiler";

/** The parts of a Volar mapping this tool reads: parallel arrays of offset segments. */
export interface OffsetMapping {
  sourceOffsets: number[];
  generatedOffsets: number[];
  lengths: number[];
  generatedLengths?: number[];
}

/** One finding, located in the .tsrx source. */
export interface TsrxFinding {
  path: string;
  line: number;
  column: number;
  ruleId: string;
  message: string;
}

interface OpengrepResult {
  check_id: string;
  path: string;
  start: { offset: number };
  extra: { message: string };
}

interface OpengrepOutput {
  results: OpengrepResult[];
  errors: { message?: string; path?: string }[];
}

const REPO_ROOT = resolve(import.meta.dirname, "../..");
const VIRTUAL_SUFFIX = ".tsx";

/**
 * The source offset a generated offset came from. Inside a mapped segment it is exact; between
 * segments (code the compiler added) it falls back to the nearest segment before it.
 */
export function toSourceOffset(mappings: readonly OffsetMapping[], generated: number): number {
  let inside: { source: number; length: number } | undefined;
  let before: { generated: number; source: number } | undefined;
  for (const mapping of mappings) {
    mapping.generatedOffsets.forEach((start, i) => {
      const source = mapping.sourceOffsets[i] ?? 0;
      const length = mapping.generatedLengths?.[i] ?? mapping.lengths[i] ?? 0;
      if (generated >= start && generated < start + length) {
        if (inside === undefined || length < inside.length) {
          const sourceLength = mapping.lengths[i] ?? 0;
          inside = { source: source + Math.min(generated - start, sourceLength), length };
        }
      } else if (start <= generated && (before === undefined || start > before.generated)) {
        before = { generated: start, source };
      }
    });
  }
  return inside?.source ?? before?.source ?? 0;
}

/** 1-based line and column of an offset in a text. */
export function lineAndColumn(text: string, offset: number): { line: number; column: number } {
  const lines = text.slice(0, offset).split("\n");
  return { line: lines.length, column: (lines.at(-1)?.length ?? 0) + 1 };
}

function tsrxFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : tsrxFiles(path);
    return entry.name.endsWith(".tsrx") ? [path] : [];
  });
}

/** Scans every .tsrx file under `dirs` with the rules in `rulesDir`. Throws when a step fails. */
export function scanTsrx(rulesDir: string, dirs: readonly string[]): TsrxFinding[] {
  const workDir = mkdtempSync(join(tmpdir(), "opengrep-tsrx-"));
  try {
    const sources = new Map<string, { text: string; mappings: OffsetMapping[] }>();
    for (const file of dirs.flatMap((dir) => tsrxFiles(resolve(dir)))) {
      const path = relative(REPO_ROOT, file);
      const text = readFileSync(file, "utf8");
      const compiled = compileToVolarMappings(text, file);
      const fatal = compiled.errors.filter((error) => error.type === "fatal");
      if (fatal.length > 0) throw new Error(`${path}: cannot compile: ${fatal[0]?.message}`);
      const virtual = join(workDir, path + VIRTUAL_SUFFIX);
      mkdirSync(dirname(virtual), { recursive: true });
      writeFileSync(virtual, compiled.code);
      sources.set(path, { text, mappings: compiled.mappings });
    }
    if (sources.size === 0) return [];

    const run = spawnSync(
      "opengrep",
      ["scan", "--config", resolve(rulesDir), "--json", "--quiet", "--no-git-ignore", "."],
      { cwd: workDir, encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
    );
    if (run.error) throw new Error(`opengrep did not run: ${run.error.message}`);
    const output = JSON.parse(run.stdout) as OpengrepOutput;
    if (output.errors.length > 0) {
      const first = output.errors[0];
      throw new Error(`opengrep reported errors: ${first?.path ?? ""} ${first?.message ?? ""}`);
    }

    return output.results.map((result) => {
      const path = result.path.slice(0, -VIRTUAL_SUFFIX.length);
      const source = sources.get(path);
      if (source === undefined) throw new Error(`finding in an unknown file: ${result.path}`);
      const offset = toSourceOffset(source.mappings, result.start.offset);
      const { line, column } = lineAndColumn(source.text, offset);
      // check_id carries the rules folder as a dotted prefix; the rule's own id is the last part.
      const ruleId = result.check_id.split(".").at(-1) ?? result.check_id;
      return { path, line, column, ruleId, message: result.extra.message };
    });
  } finally {
    rmSync(workDir, { recursive: true, force: true });
  }
}

if (import.meta.main) {
  const [rulesDir, ...dirs] = process.argv.slice(2);
  if (rulesDir === undefined || dirs.length === 0) {
    console.error("usage: node tools/opengrep-tsrx.ts <rules dir> <src dir...>");
    process.exit(2);
  }
  try {
    const findings = scanTsrx(rulesDir, dirs);
    for (const f of findings) {
      console.error(`${f.path}:${f.line}:${f.column}  ${f.ruleId}\n    ${f.message}`);
    }
    if (findings.length > 0) process.exit(1);
    console.log("opengrep tsrx: no findings");
  } catch (error) {
    console.error(`opengrep tsrx: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

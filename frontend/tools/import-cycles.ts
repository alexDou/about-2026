// Finds import cycles across .ts and .tsrx modules, type-only imports included.
// oxlint's import/no-cycle cannot see through .tsrx files, so the gate runs this instead:
//   node tools/import-cycles.ts src e2e tools
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";

const SOURCE_EXTENSIONS = [".ts", ".tsrx", ".tsx", ".mts", ".js", ".mjs"];

/** The relative specifiers of every import, re-export and dynamic import, comments ignored. */
function relativeSpecifiers(source: string): string[] {
  const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  const patterns = [
    /\bfrom\s*["']([^"']+)["']/g,
    /\bimport\s*["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  return patterns
    .flatMap((pattern) => [...code.matchAll(pattern)].map((match) => match[1] ?? ""))
    .filter((specifier) => specifier.startsWith("./") || specifier.startsWith("../"));
}

function isFile(path: string): boolean {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
}

/** The source file a relative specifier names: as written, with an extension, or a folder's index. */
function resolveSpecifier(fromFile: string, specifier: string): string | undefined {
  const base = resolve(dirname(fromFile), specifier);
  const candidates = [
    base,
    ...SOURCE_EXTENSIONS.map((ext) => base + ext),
    ...SOURCE_EXTENSIONS.map((ext) => join(base, `index${ext}`)),
  ];
  return candidates.find((path) => isFile(path) && isSource(path));
}

function isSource(path: string): boolean {
  return SOURCE_EXTENSIONS.some((ext) => path.endsWith(ext));
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "node_modules" ? [] : sourceFiles(path);
    return isSource(path) ? [path] : [];
  });
}

/** Strongly connected components of the import graph (Tarjan), each of more than one module. */
function stronglyConnected(graph: Map<string, string[]>): string[][] {
  const index = new Map<string, number>();
  const low = new Map<string, number>();
  const stack: string[] = [];
  const onStack = new Set<string>();
  const components: string[][] = [];

  const visit = (node: string) => {
    index.set(node, index.size);
    low.set(node, index.get(node) ?? 0);
    stack.push(node);
    onStack.add(node);
    for (const next of graph.get(node) ?? []) {
      if (!index.has(next)) {
        visit(next);
        low.set(node, Math.min(low.get(node) ?? 0, low.get(next) ?? 0));
      } else if (onStack.has(next)) {
        low.set(node, Math.min(low.get(node) ?? 0, index.get(next) ?? 0));
      }
    }
    if (low.get(node) !== index.get(node)) return;
    const component: string[] = [];
    let member: string | undefined;
    do {
      member = stack.pop();
      if (member === undefined) break;
      onStack.delete(member);
      component.push(member);
    } while (member !== node);
    const selfImport = graph.get(node)?.includes(node) ?? false;
    if (component.length > 1 || selfImport) components.push(component);
  };

  for (const node of graph.keys()) if (!index.has(node)) visit(node);
  return components;
}

/** Every import cycle among the source files under `dirs`, as sorted paths relative to `root`. */
export function findImportCycles(root: string, dirs: readonly string[]): string[][] {
  const files = dirs.flatMap((dir) => sourceFiles(resolve(root, dir)));
  const graph = new Map(
    files.map((file) => [
      file,
      relativeSpecifiers(readFileSync(file, "utf8"))
        .map((specifier) => resolveSpecifier(file, specifier))
        .filter((target): target is string => target !== undefined),
    ]),
  );
  return stronglyConnected(graph)
    .map((component) => component.map((file) => relative(root, file)).toSorted())
    .toSorted((a, b) => (a[0] ?? "").localeCompare(b[0] ?? ""));
}

if (import.meta.main) {
  const cycles = findImportCycles(process.cwd(), process.argv.slice(2));
  for (const cycle of cycles) console.error(`import cycle: ${cycle.join(" ↔ ")}`);
  if (cycles.length > 0) process.exit(1);
  console.log("import cycles: none");
}

// @vitest-environment node
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { findImportCycles } from "../import-cycles.ts";

let root = "";

/** Writes a throwaway source tree (path → content) and returns its root. */
function tree(files: Record<string, string>): string {
  root = mkdtempSync(join(tmpdir(), "import-cycles-"));
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), content);
  }
  return root;
}

afterEach(() => rmSync(root, { recursive: true, force: true }));

describe("findImportCycles", () => {
  it("finds none in an acyclic tree", () => {
    const dir = tree({
      "src/a.ts": 'import { b } from "./b";\nimport { x } from "some-package";\n',
      "src/b.ts": "export const b = 1;\n",
    });
    expect(findImportCycles(dir, ["src"])).toEqual([]);
  });

  it("finds a cycle that runs through a .tsrx component", () => {
    const dir = tree({
      "src/a.ts": 'import { Comp } from "./C.tsrx";\nexport const a = 1;\n',
      "src/C.tsrx": 'import { a } from "./a";\nexport function Comp() @{\n  <p>{a}</p>;\n}\n',
    });
    expect(findImportCycles(dir, ["src"])).toEqual([["src/C.tsrx", "src/a.ts"]]);
  });

  it("counts type-only imports and re-exports", () => {
    const dir = tree({
      "src/x.ts": 'import type { Y } from "./y";\nexport type X = { y?: Y };\n',
      "src/y.ts": 'export type { X } from "./x";\nexport type Y = number;\n',
    });
    expect(findImportCycles(dir, ["src"])).toEqual([["src/x.ts", "src/y.ts"]]);
  });

  it("follows extensionless specifiers to a folder's index.ts", () => {
    const dir = tree({
      "src/hooks/useX/index.ts": 'export { useX } from "./useX";\n',
      "src/hooks/useX/useX.ts": 'import { helper } from "../../utils";\nexport const useX = 1;\n',
      "src/utils/index.ts": 'import { useX } from "../hooks/useX";\nexport const helper = 1;\n',
    });
    expect(findImportCycles(dir, ["src"])).toEqual([
      ["src/hooks/useX/index.ts", "src/hooks/useX/useX.ts", "src/utils/index.ts"],
    ]);
  });

  it("ignores imports inside comments", () => {
    const dir = tree({
      "src/a.ts": '// import { b } from "./b";\n/* import "./b"; */\nexport const a = 1;\n',
      "src/b.ts": 'import { a } from "./a";\n',
    });
    expect(findImportCycles(dir, ["src"])).toEqual([]);
  });
});

// @vitest-environment node
import { compileToVolarMappings } from "octane/compiler";
import { describe, expect, it } from "vitest";
import { lineAndColumn, toSourceOffset } from "../opengrep-tsrx.ts";

describe("toSourceOffset", () => {
  const mappings = [
    { sourceOffsets: [0, 20], generatedOffsets: [100, 140], lengths: [10, 5] },
    { sourceOffsets: [22], generatedOffsets: [142], lengths: [1] },
  ];

  it("maps an offset inside a segment exactly", () => {
    expect(toSourceOffset(mappings, 104)).toBe(4);
  });

  it("prefers the narrowest segment that holds the offset", () => {
    expect(toSourceOffset(mappings, 142)).toBe(22);
  });

  it("falls back to the nearest segment before compiler-added code", () => {
    expect(toSourceOffset(mappings, 120)).toBe(0);
  });

  it("maps code before every segment to the file start", () => {
    expect(toSourceOffset(mappings, 3)).toBe(0);
  });
});

describe("lineAndColumn", () => {
  it("counts lines and columns from 1", () => {
    expect(lineAndColumn("ab\ncd\nef", 0)).toEqual({ line: 1, column: 1 });
    expect(lineAndColumn("ab\ncd\nef", 4)).toEqual({ line: 2, column: 2 });
  });
});

describe("compiled .tsrx", () => {
  it("maps a sink in the compiled TSX back to its .tsrx line", () => {
    const source = [
      "/** Probe. */",
      "export function Probe(props: { node: HTMLElement; html: string }) @{",
      "  props.node.innerHTML = props.html;",
      "  <p>{props.html}</p>;",
      "}",
      "",
    ].join("\n");
    const compiled = compileToVolarMappings(source, "Probe.tsrx");
    const generated = compiled.code.indexOf("props.node.innerHTML");

    expect(generated).toBeGreaterThan(-1);
    const { line, column } = lineAndColumn(source, toSourceOffset(compiled.mappings, generated));
    expect({ line, column }).toEqual({ line: 3, column: 3 });
  });
});

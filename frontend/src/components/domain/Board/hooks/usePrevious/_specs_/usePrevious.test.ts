import { renderHook } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { usePrevious } from "..";

describe("usePrevious", () => {
  it("is undefined until the value changes", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "a" },
    });
    expect(result.current).toBeUndefined();
    rerender({ value: "a" });
    expect(result.current).toBeUndefined();
  });

  it("is the value before the latest change, and stays so through renders that change nothing", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: "a" },
    });
    rerender({ value: "b" });
    expect(result.current).toBe("a");
    rerender({ value: "b" });
    expect(result.current).toBe("a");
    rerender({ value: "c" });
    expect(result.current).toBe("b");
  });

  it("tells null from never changed", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: null as string | null },
    });
    rerender({ value: "a" });
    expect(result.current).toBeNull();
  });
});

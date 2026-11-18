import { act, renderHook } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useClipboard } from "..";

const writeText = vi.fn<(text: string) => Promise<void>>();

beforeEach(() => {
  vi.useFakeTimers();
  writeText.mockReset();
  writeText.mockResolvedValue(undefined);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
});

afterEach(() => {
  vi.useRealTimers();
});

describe("useClipboard", () => {
  it("has not copied anything at first", () => {
    const { result } = renderHook(() => useClipboard(1500));
    expect(result.current.copied).toBe(false);
    expect(writeText).not.toHaveBeenCalled();
  });

  it("writes the text to the clipboard and reports it copied", async () => {
    const { result } = renderHook(() => useClipboard(1500));
    await act(async () => {
      await result.current.copy("some text");
    });
    expect(writeText).toHaveBeenCalledWith("some text");
    expect(result.current.copied).toBe(true);
  });

  it("goes back to not copied after the time it is given", async () => {
    const { result } = renderHook(() => useClipboard(1500));
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(1499);
    });
    expect(result.current.copied).toBe(true);
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.copied).toBe(false);
  });

  it("starts the time again when it copies again before it ran out", async () => {
    const { result } = renderHook(() => useClipboard(1500));
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    await act(async () => {
      await result.current.copy("x");
    });
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.copied).toBe(true);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current.copied).toBe(false);
  });

  it("does not report copied when the browser refuses the write", async () => {
    writeText.mockRejectedValue(new Error("denied"));
    const { result } = renderHook(() => useClipboard(1500));
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.copied).toBe(false);
  });

  it("does not report copied where there is no clipboard", async () => {
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
    const { result } = renderHook(() => useClipboard(1500));
    await act(async () => {
      await result.current.copy("x");
    });
    expect(result.current.copied).toBe(false);
  });

  it("stops the clock when it unmounts", async () => {
    const set = vi.spyOn(globalThis, "setTimeout");
    const clear = vi.spyOn(globalThis, "clearTimeout");
    const { result, unmount } = renderHook(() => useClipboard(1500));
    await act(async () => {
      await result.current.copy("x");
    });
    const index = set.mock.calls.findIndex(([, ms]) => ms === 1500);
    const timer = set.mock.results[index]?.value;
    expect(timer).toBeDefined();
    unmount();
    expect(clear).toHaveBeenCalledWith(timer);
    set.mockRestore();
    clear.mockRestore();
  });
});

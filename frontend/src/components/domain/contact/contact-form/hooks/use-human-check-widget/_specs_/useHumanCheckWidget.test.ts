import { act, renderHook } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WIDGET_LOAD } from "../../../config";
import { useHumanCheckWidget } from "..";
import { loadHumanCheckWidget } from "../load";

vi.mock("../load", () => ({ loadHumanCheckWidget: vi.fn<typeof loadHumanCheckWidget>() }));
const loadMock = vi.mocked(loadHumanCheckWidget);

afterEach(() => {
  vi.clearAllMocks();
  vi.restoreAllMocks();
});

describe("useHumanCheckWidget", () => {
  it("asks for the widget when it mounts, and is loading until it has loaded", async () => {
    let loaded!: () => void;
    loadMock.mockReturnValue(new Promise((resolve) => (loaded = () => resolve())));
    const { result } = renderHook(() => useHumanCheckWidget());
    expect(loadMock).toHaveBeenCalledOnce();
    expect(result.current).toBe(WIDGET_LOAD.loading);
    await act(async () => loaded());
    expect(result.current).toBe(WIDGET_LOAD.ready);
  });

  it("is failed, and logs the error, when the widget cannot load", async () => {
    const error = new Error("chunk failed");
    const log = vi.spyOn(console, "error").mockImplementation(() => {});
    loadMock.mockRejectedValue(error);
    const { result } = renderHook(() => useHumanCheckWidget());
    await act(async () => {});
    expect(result.current).toBe(WIDGET_LOAD.failed);
    expect(log).toHaveBeenCalledWith(expect.any(String), error);
  });
});

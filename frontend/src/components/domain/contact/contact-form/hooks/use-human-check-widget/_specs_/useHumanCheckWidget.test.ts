import { act, renderHook } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useHumanCheckWidget } from "..";
import { loadHumanCheckWidget } from "../load";

vi.mock("../load", () => ({ loadHumanCheckWidget: vi.fn<typeof loadHumanCheckWidget>() }));
const loadMock = vi.mocked(loadHumanCheckWidget);

afterEach(() => vi.clearAllMocks());

describe("useHumanCheckWidget", () => {
  it("asks for the widget when it mounts, and is not ready until it has loaded", async () => {
    let loaded!: () => void;
    loadMock.mockReturnValue(new Promise((resolve) => (loaded = () => resolve())));
    const { result } = renderHook(() => useHumanCheckWidget());
    expect(loadMock).toHaveBeenCalledOnce();
    expect(result.current).toBe(false);
    await act(async () => loaded());
    expect(result.current).toBe(true);
  });

  it("stays not ready when the widget cannot load", async () => {
    loadMock.mockRejectedValue(new Error("chunk failed"));
    const { result } = renderHook(() => useHumanCheckWidget());
    await act(async () => {});
    expect(result.current).toBe(false);
  });
});

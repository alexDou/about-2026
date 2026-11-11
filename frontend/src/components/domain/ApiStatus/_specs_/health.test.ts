import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fetchHealth } from "../../../../services/api";
import { API_HEALTH, HEALTH_TIMEOUT_MS } from "../config";
import { checkHealth, checkHealthOnce, health$, resetHealth } from "../health";

vi.mock("../../../../services/api", () => ({ fetchHealth: vi.fn<typeof fetchHealth>() }));
const fetchHealthMock = vi.mocked(fetchHealth);

/** A health request that the test answers by hand. */
function pendingRequest() {
  let answer!: { ok: () => void; fail: () => void };
  const promise = new Promise<{ status: "ok" }>((resolve, reject) => {
    answer = { ok: () => resolve({ status: "ok" }), fail: () => reject(new TypeError("network")) };
  });
  return { promise, ...answer };
}

const settled = () => new Promise((resolve) => setTimeout(resolve, 0));

beforeEach(() => {
  fetchHealthMock.mockReset();
});
afterEach(resetHealth);

describe("the shared health check", () => {
  it("starts as checking, with no request yet", () => {
    expect(health$.get()).toBe(API_HEALTH.checking);
    expect(fetchHealthMock).not.toHaveBeenCalled();
  });

  it("becomes ok when the backend answers", async () => {
    fetchHealthMock.mockResolvedValue({ status: "ok" });
    checkHealth();
    await settled();
    expect(health$.get()).toBe(API_HEALTH.ok);
  });

  it("becomes down when the request fails", async () => {
    fetchHealthMock.mockRejectedValue(new TypeError("network"));
    checkHealth();
    await settled();
    expect(health$.get()).toBe(API_HEALTH.down);
  });

  it("makes one request however often the first check is asked for", async () => {
    fetchHealthMock.mockResolvedValue({ status: "ok" });
    checkHealthOnce();
    checkHealthOnce();
    await settled();
    checkHealthOnce();
    expect(fetchHealthMock).toHaveBeenCalledTimes(1);
  });

  it("asks again whenever a check is asked for", async () => {
    fetchHealthMock.mockResolvedValue({ status: "ok" });
    checkHealthOnce();
    await settled();
    checkHealth();
    expect(fetchHealthMock).toHaveBeenCalledTimes(2);
  });

  it("keeps what it knew while it asks again, and takes the new answer", async () => {
    fetchHealthMock.mockRejectedValueOnce(new TypeError("network"));
    checkHealth();
    await settled();
    expect(health$.get()).toBe(API_HEALTH.down);

    const recovered = pendingRequest();
    fetchHealthMock.mockReturnValueOnce(recovered.promise);
    checkHealth();
    expect(health$.get()).toBe(API_HEALTH.down);
    recovered.ok();
    await settled();
    expect(health$.get()).toBe(API_HEALTH.ok);
  });

  it("drops the answer of a request that a newer one replaced", async () => {
    const first = pendingRequest();
    const second = pendingRequest();
    fetchHealthMock.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    checkHealth();
    checkHealth();
    expect(fetchHealthMock.mock.calls[0]?.[0]?.aborted).toBe(true);

    second.ok();
    await settled();
    first.fail();
    await settled();
    expect(health$.get()).toBe(API_HEALTH.ok);
  });

  it("gives up after the timeout and counts a request that never answers as down", async () => {
    const timeout = new AbortController();
    const timeoutSpy = vi.spyOn(AbortSignal, "timeout").mockReturnValue(timeout.signal);
    fetchHealthMock.mockImplementation(
      (signal) =>
        new Promise((_resolve, reject) => {
          signal?.addEventListener("abort", () => reject(signal.reason));
        }),
    );
    checkHealth();
    expect(timeoutSpy).toHaveBeenCalledWith(HEALTH_TIMEOUT_MS);
    expect(health$.get()).toBe(API_HEALTH.checking);

    timeout.abort(new DOMException("timed out", "TimeoutError"));
    await settled();
    expect(health$.get()).toBe(API_HEALTH.down);
    timeoutSpy.mockRestore();
  });

  it("waits 6 seconds before it gives up", () => {
    expect(HEALTH_TIMEOUT_MS).toBe(6000);
  });

  it("starts over after a reset", async () => {
    fetchHealthMock.mockRejectedValue(new TypeError("network"));
    checkHealthOnce();
    await settled();
    resetHealth();
    expect(health$.get()).toBe(API_HEALTH.checking);
    checkHealthOnce();
    expect(fetchHealthMock).toHaveBeenCalledTimes(2);
  });
});

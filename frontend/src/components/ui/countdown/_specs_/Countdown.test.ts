import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, render } from "@octanejs/testing-library";
import { Countdown } from "../Countdown.tsrx";

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

/** Lets seconds pass one at a time: each tick is scheduled after the render of the one before. */
const pass = async (seconds: number) => {
  for (let second = 0; second < seconds; second += 1) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
  }
};

const format = (seconds: number) => `${seconds} s left`;

describe("Countdown", () => {
  it("shows the seconds it starts from", () => {
    const { container } = render(Countdown, {
      props: { from: 10, format, onDone: vi.fn<() => void>() },
    });
    expect(container.textContent).toBe("10 s left");
  });

  it("counts down one second at a time", async () => {
    const { container } = render(Countdown, {
      props: { from: 10, format, onDone: vi.fn<() => void>() },
    });
    await pass(3);
    expect(container.textContent).toBe("7 s left");
  });

  it("calls onDone once, at 0, and stops", async () => {
    const onDone = vi.fn<() => void>();
    const { container } = render(Countdown, { props: { from: 3, format, onDone } });
    await pass(2);
    expect(onDone).not.toHaveBeenCalled();
    await pass(10);
    expect(onDone).toHaveBeenCalledTimes(1);
    expect(container.textContent).toBe("0 s left");
  });

  it("stops counting when it is removed", async () => {
    const onDone = vi.fn<() => void>();
    const { unmount } = render(Countdown, { props: { from: 3, format, onDone } });
    unmount();
    await pass(10);
    expect(onDone).not.toHaveBeenCalled();
  });
});

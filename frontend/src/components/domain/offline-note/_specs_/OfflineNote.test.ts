import { render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetHealth } from "../../api-status";
import { intlWrapper } from "../../../../i18n";
import { fetchHealth } from "../../../../services/api";
import { OfflineNote } from "../OfflineNote.tsrx";

vi.mock("../../../../services/api", () => ({ fetchHealth: vi.fn<typeof fetchHealth>() }));
const fetchHealthMock = vi.mocked(fetchHealth);

const NOTE = /backend is not reachable/i;

beforeEach(() => {
  fetchHealthMock.mockReset();
});
afterEach(resetHealth);

describe("OfflineNote", () => {
  it("shows nothing while the check runs", () => {
    fetchHealthMock.mockReturnValue(new Promise(() => {}));
    render(OfflineNote, { props: {}, wrapper: intlWrapper() });
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });

  it("shows nothing while the backend is up", async () => {
    fetchHealthMock.mockResolvedValue({ status: "ok" });
    render(OfflineNote, { props: {}, wrapper: intlWrapper() });
    await vi.waitFor(() => expect(fetchHealthMock).toHaveBeenCalledTimes(1));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.queryByText(NOTE)).not.toBeInTheDocument();
  });

  it("shows the note while the backend is down", async () => {
    fetchHealthMock.mockRejectedValue(new TypeError("network"));
    render(OfflineNote, { props: {}, wrapper: intlWrapper() });
    expect(await screen.findByRole("status")).toHaveTextContent(NOTE);
  });

  it("takes its text from the messages", async () => {
    fetchHealthMock.mockRejectedValue(new TypeError("network"));
    render(OfflineNote, {
      props: {},
      wrapper: intlWrapper({ "offline.note": "Server weg" }),
    });
    expect(await screen.findByText("Server weg")).toBeInTheDocument();
  });

  it("checks the backend every time it appears, and a recovered backend clears the note", async () => {
    fetchHealthMock.mockRejectedValueOnce(new TypeError("network"));
    const first = render(OfflineNote, { props: {}, wrapper: intlWrapper() });
    expect(await screen.findByText(NOTE)).toBeInTheDocument();
    first.unmount();

    fetchHealthMock.mockResolvedValueOnce({ status: "ok" });
    render(OfflineNote, { props: {}, wrapper: intlWrapper() });
    expect(fetchHealthMock).toHaveBeenCalledTimes(2);
    await vi.waitFor(() => expect(screen.queryByText(NOTE)).not.toBeInTheDocument());
  });
});

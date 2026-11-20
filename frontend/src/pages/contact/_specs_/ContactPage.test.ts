import { render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetHealth } from "../../../components/domain/api-status";
import { intlWrapper } from "../../../i18n";
import { fetchHealth } from "../../../services/api";
import { ContactPage } from "../ContactPage.tsrx";

vi.mock("../../../services/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../services/api")>()),
  fetchHealth: vi.fn<typeof fetchHealth>(),
}));
const fetchHealthMock = vi.mocked(fetchHealth);

const NOTE = /backend is not reachable/i;

beforeEach(() => {
  fetchHealthMock.mockReturnValue(new Promise(() => {}));
});
afterEach(resetHealth);

describe("ContactPage", () => {
  it("opens with its heading, titled by the Panel's message", () => {
    render(ContactPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
  });

  it("says the Owner works remotely, worldwide, under the heading", () => {
    render(ContactPage, { props: {}, wrapper: intlWrapper() });
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.compareDocumentPosition(screen.getByText("Remote, worldwide"))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("links LinkedIn and Xing in that order", () => {
    render(ContactPage, { props: {}, wrapper: intlWrapper() });
    const links = screen.getAllByRole("link");
    expect(
      links.map((link) => [link.getAttribute("aria-label"), link.getAttribute("href")]),
    ).toEqual([
      ["LinkedIn", "https://www.linkedin.com/in/a-doo/"],
      ["Xing", "https://www.xing.com/profile/Alexander_Doo"],
    ]);
  });

  it("shows the Contact notice", () => {
    render(ContactPage, { props: {}, wrapper: intlWrapper() });
    expect(
      screen.getByText(
        "I use these details only to reply to your request. They reach me by email and are not stored on this site or passed on to anyone.",
      ),
    ).toBeInTheDocument();
  });

  it("takes the heading from the messages", () => {
    render(ContactPage, {
      props: {},
      wrapper: intlWrapper({ "explore.panel.contact.title": "Titel" }),
    });
    expect(screen.getByRole("heading", { name: "Titel" })).toBeInTheDocument();
  });

  it("shows the offline note while the backend is down, below the heading", async () => {
    fetchHealthMock.mockRejectedValue(new TypeError("network"));
    render(ContactPage, { props: {}, wrapper: intlWrapper() });
    const note = await screen.findByRole("status");
    expect(note).toHaveTextContent(NOTE);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.compareDocumentPosition(note)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });
});

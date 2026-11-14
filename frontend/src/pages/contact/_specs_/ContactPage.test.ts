import { render, screen } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetHealth } from "../../../components/domain/api-status";
import { intlWrapper } from "../../../i18n";
import { fetchHealth } from "../../../services/api";
import { ContactPage } from "../ContactPage.tsrx";

vi.mock("../../../services/api", () => ({ fetchHealth: vi.fn<typeof fetchHealth>() }));
const fetchHealthMock = vi.mocked(fetchHealth);

const NOTE = /backend is not reachable/i;

beforeEach(() => {
  fetchHealthMock.mockReturnValue(new Promise(() => {}));
});
afterEach(resetHealth);

describe("ContactPage", () => {
  it("shows only its heading, titled by the Panel's message", () => {
    const { container } = render(ContactPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "Contact" })).toBeInTheDocument();
    expect(container).toHaveTextContent(/^Contact$/);
  });

  it("takes the heading from the messages", () => {
    render(ContactPage, {
      props: {},
      wrapper: intlWrapper({ "board.panel.contact.title": "Titel" }),
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

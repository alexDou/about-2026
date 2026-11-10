import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { ContactPage } from ".././ContactPage.tsrx";

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
});

import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { ChatWithMePage } from ".././ChatWithMePage.tsrx";

describe("ChatWithMePage", () => {
  it("shows only its heading, titled by the Panel's message", () => {
    const { container } = render(ChatWithMePage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "Chat with me" })).toBeInTheDocument();
    expect(container).toHaveTextContent(/^Chat with me$/);
  });

  it("takes the heading from the messages", () => {
    render(ChatWithMePage, {
      props: {},
      wrapper: intlWrapper({ "board.panel.chatWithMe.title": "Titel" }),
    });
    expect(screen.getByRole("heading", { name: "Titel" })).toBeInTheDocument();
  });
});

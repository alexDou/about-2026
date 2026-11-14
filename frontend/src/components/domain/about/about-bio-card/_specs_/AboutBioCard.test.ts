import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { AboutBioCard } from "../AboutBioCard.tsrx";
import type { AboutBioCardProps } from "../types";

const props: AboutBioCardProps = {
  heading: "about.heading.bio",
  bio: { professional: "about.bio.professional", personal: "about.bio.personal" },
};

const MESSAGES = {
  "about.heading.bio": "About me",
  "about.bio.professional": "Builds things.",
  "about.bio.personal": "Lives somewhere.",
};

const renderCard = () => render(AboutBioCard, { props, wrapper: intlWrapper(MESSAGES) });

describe("AboutBioCard", () => {
  it("has its heading from the messages", () => {
    renderCard();
    expect(screen.getByRole("heading", { level: 2, name: "About me" })).toBeInTheDocument();
  });

  it("shows the professional paragraph, then the personal one", () => {
    renderCard();
    const professional = screen.getByText("Builds things.");
    const personal = screen.getByText("Lives somewhere.");
    expect(professional.tagName).toBe("P");
    expect(personal.tagName).toBe("P");
    expect(
      professional.compareDocumentPosition(personal) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

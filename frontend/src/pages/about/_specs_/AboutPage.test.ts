import { render, screen, within } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../i18n";
import { AboutPage } from "../AboutPage.tsrx";

describe("AboutPage", () => {
  it("shows its heading, titled by the Panel's message", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1, name: "About" })).toBeInTheDocument();
  });

  it("hides the heading visually: the badges and the card open the page, as in the reference", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getByRole("heading", { level: 1 })).toHaveClass("heading--visually-hidden");
  });

  it("shows the six availability badges", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    expect(within(screen.getAllByRole("list")[0]!).getAllByRole("img")).toHaveLength(6);
  });

  it("shows the top card under the badge row, greeting with the Owner's name", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    const badges = screen.getAllByRole("list")[0]!;
    const greeting = screen.getByText("Hello, I'm Alexander Durnev.");
    expect(
      badges.compareDocumentPosition(greeting) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(screen.getByRole("img", { name: "Alexander Durnev" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "LinkedIn" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "GitHub" })).toBeInTheDocument();
  });

  it("shows the lower cards under the top card: Bio, Experience, Education, Languages and Hobbies", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    const headings = screen.getAllByRole("heading", { level: 2 }).map((h) => h.textContent);
    expect(headings).toEqual(["Bio", "Experience", "Education", "Languages", "Hobbies"]);
    const greeting = screen.getByText("Hello, I'm Alexander Durnev.");
    const bio = screen.getByRole("heading", { name: "Bio" });
    expect(greeting.compareDocumentPosition(bio) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("shows the five Roles, then the degree, and the Hobbies", () => {
    render(AboutPage, { props: {}, wrapper: intlWrapper() });
    expect(screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent)).toEqual([
      "Senior Frontend Developer · Technical Lead",
      "Senior Frontend Developer",
      "Senior Web Developer",
      "Full-Stack Developer",
      "Full-Stack Web Developer",
      "Marketing Management and Financial Analysis",
      "Technologies",
      "Science",
      "History and travel",
      "Sport",
      "Art",
    ]);
  });

  it("takes the heading from the messages", () => {
    render(AboutPage, {
      props: {},
      wrapper: intlWrapper({ "explore.panel.about.title": "Titel" }),
    });
    expect(screen.getByRole("heading", { name: "Titel" })).toBeInTheDocument();
  });
});

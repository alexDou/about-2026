import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { AboutEducationCard } from "../AboutEducationCard.tsrx";
import type { AboutEducationCardProps } from "../types";

const props: AboutEducationCardProps = {
  heading: "about.heading.education",
  education: {
    degree: "about.education.degree",
    school: "about.education.school",
    place: "about.education.place",
    year: "about.education.year",
    business: "about.education.business",
    line: "about.education.line",
  },
};

const MESSAGES = {
  "about.heading.education": "Learning",
  "about.education.degree": "Analytics",
  "about.education.school": "State University",
  "about.education.place": "Moscow",
  "about.education.year": "2002",
  "about.education.business": "It taught me business.",
  "about.education.line": "{school} | {place} | {year}",
};

const renderCard = () => render(AboutEducationCard, { props, wrapper: intlWrapper(MESSAGES) });

describe("AboutEducationCard", () => {
  it("has its heading from the messages", () => {
    renderCard();
    expect(screen.getByRole("heading", { level: 2, name: "Learning" })).toBeInTheDocument();
  });

  it("names the degree, then the school, the place and the year", () => {
    renderCard();
    expect(screen.getByRole("heading", { level: 3, name: "Analytics" })).toBeInTheDocument();
    expect(screen.getByText("State University | Moscow | 2002")).toBeInTheDocument();
  });

  it("ends with the business sentence", () => {
    renderCard();
    expect(screen.getByText("It taught me business.").tagName).toBe("P");
  });
});

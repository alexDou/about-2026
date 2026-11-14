import { render, screen, within } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { AboutLanguagesHobbiesCard } from "../AboutLanguagesHobbiesCard.tsrx";
import type { AboutLanguagesHobbiesCardProps } from "../types";

const props: AboutLanguagesHobbiesCardProps = {
  headings: { languages: "about.heading.languages", hobbies: "about.heading.hobbies" },
  languageLines: { plain: "about.language.line", withCefr: "about.language.lineCefr" },
  languages: [
    { name: "about.language.russian.name", level: "about.language.russian.level" },
    {
      name: "about.language.english.name",
      level: "about.language.english.level",
      cefr: "about.language.english.cefr",
    },
  ],
  hobbies: [
    { name: "about.hobby.1.name", text: "about.hobby.1.text" },
    { name: "about.hobby.2.name", text: "about.hobby.2.text" },
  ],
};

const MESSAGES = {
  "about.language.russian.name": "Russian",
  "about.language.russian.level": "native",
  "about.language.english.name": "English",
  "about.language.english.level": "fluent",
  "about.language.english.cefr": "C1",
  "about.hobby.1.name": "Chess",
  "about.hobby.1.text": "Slow games.",
  "about.hobby.2.name": "Trail running",
  "about.hobby.2.text": "Fast ones.",
};

const renderCard = () =>
  render(AboutLanguagesHobbiesCard, { props, wrapper: intlWrapper(MESSAGES) });

describe("AboutLanguagesHobbiesCard", () => {
  it("has a heading for each column", () => {
    renderCard();
    expect(screen.getByRole("heading", { level: 2, name: "Languages" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Hobbies" })).toBeInTheDocument();
  });

  it("lists the languages as name, level and CEFR level; a native one has no CEFR level", () => {
    renderCard();
    const [languages] = screen.getAllByRole("list");
    expect(
      within(languages!)
        .getAllByRole("listitem")
        .map((item) => item.textContent),
    ).toEqual(["Russian: native", "English: fluent (C1)"]);
  });

  it("lists each Hobby with its few words", () => {
    renderCard();
    const hobbies = screen.getAllByRole("list")[1]!;
    const items = within(hobbies).getAllByRole("listitem");
    expect(items.map((item) => item.textContent)).toEqual([
      "ChessSlow games.",
      "Trail runningFast ones.",
    ]);
  });

  it("puts the Languages column before the Hobbies column", () => {
    renderCard();
    const languages = screen.getByRole("heading", { name: "Languages" });
    const hobbies = screen.getByRole("heading", { name: "Hobbies" });
    expect(
      languages.compareDocumentPosition(hobbies) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});

import { render, screen, within } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { AboutTopCard } from "../AboutTopCard.tsrx";
import type { AboutTopCardProps } from "../types";

const props: AboutTopCardProps = {
  content: {
    name: "about.name",
    headline: "about.headline",
    greeting: "about.greeting.hello",
    credo: "about.credo",
    profiles: [
      { kind: "linkedin", label: "about.profile.linkedin.label", url: "https://linkedin.test/me" },
      { kind: "github", label: "about.profile.github.label", url: "https://github.test/me" },
    ],
    cv: { label: "about.cv.label", url: "/cv/ada-cv.pdf" },
  },
  media: {
    photo: {
      avif: [
        { url: "me-400.avif", width: 400 },
        { url: "me-800.avif", width: 800 },
      ],
      webp: [
        { url: "me-400.webp", width: 400 },
        { url: "me-800.webp", width: 800 },
      ],
      width: 400,
      height: 540,
    },
    brush: "brush.svg",
  },
};

const MESSAGES = {
  "about.name": "Ada Lovelace",
  "about.headline": "Analyst",
  "about.credo": "Notes first.",
  "about.cv.label": "Get my CV",
  "about.profile.linkedin.label": "LinkedIn",
  "about.profile.github.label": "GitHub",
};

const renderCard = (messages: Record<string, string> = MESSAGES) =>
  render(AboutTopCard, { props, wrapper: intlWrapper(messages) });

describe("AboutTopCard", () => {
  it("greets with the name and the Headline from the messages", () => {
    renderCard();
    expect(screen.getByText("Hello, I'm Ada Lovelace.")).toBeInTheDocument();
    expect(screen.getByText("Analyst")).toBeInTheDocument();
  });

  it("shows the credo under the greeting", () => {
    renderCard();
    const greeting = screen.getByText("Hello, I'm Ada Lovelace.");
    const credo = screen.getByText("Notes first.");
    expect(greeting.compareDocumentPosition(credo) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("links each profile, named by its label, in order", () => {
    renderCard();
    const links = within(screen.getByRole("list")).getAllByRole("link");
    expect(
      links.map((link) => [link.getAttribute("aria-label"), link.getAttribute("href")]),
    ).toEqual([
      ["LinkedIn", "https://linkedin.test/me"],
      ["GitHub", "https://github.test/me"],
    ]);
  });

  it("draws an icon for each profile, hidden from assistive technology", () => {
    renderCard();
    for (const link of within(screen.getByRole("list")).getAllByRole("link")) {
      expect(link.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
    }
  });

  it("offers the CV as a download link, named by its label", () => {
    renderCard();
    const cv = screen.getByRole("link", { name: "Get my CV" });
    expect(cv.getAttribute("href")).toBe("/cv/ada-cv.pdf");
    expect(cv.hasAttribute("download")).toBe(true);
  });

  it("shows the photo, named after the Owner, in AVIF with a WebP fallback at both widths", () => {
    renderCard();
    const photo = screen.getByRole("img", { name: "Ada Lovelace" });
    expect(photo.getAttribute("srcset")).toBe("me-400.webp 400w, me-800.webp 800w");
    expect(photo.getAttribute("src")).toBe("me-400.webp");
    expect(photo.getAttribute("width")).toBe("400");
    expect(photo.getAttribute("height")).toBe("540");
    const avif = photo.parentElement?.querySelector('source[type="image/avif"]');
    expect(avif?.getAttribute("srcset")).toBe("me-400.avif 400w, me-800.avif 800w");
  });

  it("draws the brush stroke from its file, so CSS can colour it", () => {
    renderCard();
    const use = document.querySelector("use");
    expect(use?.getAttribute("href")).toBe("brush.svg#brush");
    expect(use?.closest("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("has the photo as its only named image", () => {
    renderCard();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});

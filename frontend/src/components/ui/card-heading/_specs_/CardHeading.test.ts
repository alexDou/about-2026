import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { CardHeading } from "../CardHeading.tsrx";

describe("CardHeading", () => {
  it("is a second-level heading with its text", () => {
    render(CardHeading, { props: { text: "Bio" } });
    expect(screen.getByRole("heading", { level: 2, name: "Bio" })).toBeInTheDocument();
  });
});

import { render, screen } from "@octanejs/testing-library";
import { describe, expect, it } from "vitest";
import { Card } from "../Card.tsrx";

describe("Card", () => {
  it("is an article holding what it is given", () => {
    render(Card, { props: { children: "Inside" } });
    expect(screen.getByText("Inside").closest("article")).toHaveClass("card");
  });
});

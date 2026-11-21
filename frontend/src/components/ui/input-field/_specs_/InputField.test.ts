import { fireEvent, render, screen } from "@octanejs/testing-library";
import { describe, expect, it, vi } from "vitest";
import { InputField } from "../InputField.tsrx";
import { INPUT_FIELD_LAYOUTS, INPUT_FIELD_TONES } from "../config";
import type { InputFieldProps } from "../types";

const renderField = (props: Partial<InputFieldProps> = {}) =>
  render(InputField, {
    props: {
      name: "company",
      label: "Company",
      required: false,
      autoComplete: "organization",
      value: "",
      onValueInput: () => {},
      onLeave: () => {},
      inputRef: () => {},
      ...props,
    },
  });

const block = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe("InputField", () => {
  it("labels its input by the label", () => {
    renderField();
    expect(screen.getByLabelText("Company")).toHaveAttribute("name", "company");
  });

  it("marks a required field with an asterisk the label shows and a screen reader skips", () => {
    renderField({ required: true });
    const input = screen.getByLabelText("Company *");
    expect(input).toBeRequired();
    expect(screen.getByText("*")).toHaveAttribute("aria-hidden", "true");
  });

  it("reads the hint and the error with the field, and flags it invalid on an error", () => {
    renderField({ hint: "email, phone", error: "Please enter it." });
    const input = screen.getByLabelText("Company");
    expect(input).toHaveAttribute("aria-invalid", "true");
    const described = (input.getAttribute("aria-describedby") ?? "").split(" ");
    expect(described).toContain(screen.getByText("email, phone").id);
    expect(described).toContain(screen.getByText("Please enter it.").id);
  });

  it("shows the counter", () => {
    renderField({ counter: "87 / 100" });
    expect(screen.getByText("87 / 100")).toBeInTheDocument();
  });

  it("reports what is typed, and when the field is left", () => {
    const onValueInput = vi.fn<InputFieldProps["onValueInput"]>();
    const onLeave = vi.fn<InputFieldProps["onLeave"]>();
    renderField({ onValueInput, onLeave });
    const input = screen.getByLabelText("Company");
    fireEvent.input(input, { target: { value: "Acme" } });
    fireEvent.blur(input);
    expect(onValueInput).toHaveBeenCalledWith("Acme");
    expect(onLeave).toHaveBeenCalledOnce();
  });

  it("puts the label above the input and wears the light fill unless told otherwise", () => {
    const { container } = renderField();
    expect(block(container).className).toContain(`input-field--${INPUT_FIELD_LAYOUTS.stacked}`);
    expect(block(container).className).toContain(`input-field--${INPUT_FIELD_TONES.light}`);
  });

  it.each(Object.values(INPUT_FIELD_LAYOUTS))("wears the %s layout when asked", (layout) => {
    const { container } = renderField({ layout });
    expect(block(container).className).toContain(`input-field--${layout}`);
  });

  it.each(Object.values(INPUT_FIELD_TONES))("wears the %s tone when asked", (tone) => {
    const { container } = renderField({ tone });
    expect(block(container).className).toContain(`input-field--${tone}`);
  });
});

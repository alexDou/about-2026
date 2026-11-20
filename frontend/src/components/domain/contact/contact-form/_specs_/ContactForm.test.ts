import { act, fireEvent, render, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { CONTACT_OUTCOME, submitContact } from "../../../../../services/api";
import { ContactForm } from "../ContactForm.tsrx";
import type { ContactFormProps } from "../types";

vi.mock("../../../../../services/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../../../services/api")>()),
  submitContact: vi.fn<typeof submitContact>(),
}));
const submitContactMock = vi.mocked(submitContact);

const content: ContactFormProps["content"] = {
  fields: {
    name: { label: "contact.form.name.label" },
    company: { label: "contact.form.company.label" },
    position: { label: "contact.form.position.label" },
    contact: { label: "contact.form.contact.label", hint: "contact.form.contact.hint" },
  },
  required: "contact.form.required",
  send: "contact.form.send",
  sending: "contact.form.sending",
  thanks: "contact.form.thanks",
};

const renderForm = () => render(ContactForm, { props: { content }, wrapper: intlWrapper() });

const type = (label: string | RegExp, value: string) =>
  fireEvent.input(screen.getByLabelText(label), { target: { value } });

const fillRequired = () => {
  type(/^Name/, "  Ada Lovelace ");
  type(/^Company/, "Analytical Engines");
};

const send = () => fireEvent.click(screen.getByRole("button", { name: "Send" }));

beforeEach(() => {
  submitContactMock.mockResolvedValue(CONTACT_OUTCOME.sent);
});
afterEach(() => vi.clearAllMocks());

describe("ContactForm", () => {
  it("labels every field and marks the required ones with an asterisk", () => {
    renderForm();
    expect(screen.getByLabelText("Name *")).toBeRequired();
    expect(screen.getByLabelText("Company *")).toBeRequired();
    expect(screen.getByLabelText("Position")).not.toBeRequired();
    expect(screen.getByLabelText(/^How to reach you/)).not.toBeRequired();
  });

  it("says what the asterisk means and hints at the ways to reach the Visitor", () => {
    renderForm();
    expect(screen.getByText("* required")).toBeInTheDocument();
    expect(screen.getByLabelText(/^How to reach you/)).toHaveAccessibleDescription(
      "email, phone, LinkedIn, …",
    );
  });

  it("lists the fields in order and ends with the Send button", () => {
    renderForm();
    const inputs = screen.getAllByRole("textbox").map((input) => input.getAttribute("name"));
    expect(inputs).toEqual(["name", "company", "position", "contact"]);
    const last = screen.getAllByRole("textbox").at(-1) as HTMLElement;
    const button = screen.getByRole("button", { name: "Send" });
    expect(last.compareDocumentPosition(button)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("sends the cleaned fields once, leaving out what was not given", async () => {
    renderForm();
    fillRequired();
    type("Position", "   ");
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalledTimes(1));
    expect(submitContactMock).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      company: "Analytical Engines",
      altcha: expect.any(String),
    });
  });

  it("sends the optional fields when they are given", async () => {
    renderForm();
    fillRequired();
    type("Position", "Staff engineer");
    type(/^How to reach you/, "ada@example.com");
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalled());
    expect(submitContactMock).toHaveBeenCalledWith(
      expect.objectContaining({ position: "Staff engineer", contact: "ada@example.com" }),
    );
  });

  it("does not send while a required field is empty", async () => {
    renderForm();
    type(/^Company/, "Analytical Engines");
    send();
    await act(async () => {});
    expect(submitContactMock).not.toHaveBeenCalled();
  });

  it("is disabled and says 'Sending…' while the request is on its way", async () => {
    submitContactMock.mockReturnValue(new Promise(() => {}));
    renderForm();
    fillRequired();
    send();
    const button = await screen.findByRole("button", { name: "Sending…" });
    expect(button).toBeDisabled();
    for (const input of screen.getAllByRole("textbox")) expect(input).toBeDisabled();
  });

  it("replaces the form with a thank-you note naming the Visitor once it is sent", async () => {
    renderForm();
    fillRequired();
    send();
    expect(
      await screen.findByText("Thank you, Ada Lovelace. I'll get back to you soon."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it.each([CONTACT_OUTCOME.failed, CONTACT_OUTCOME.invalidFields])(
    "brings the form back with the typed values when the outcome is %s",
    async (outcome) => {
      submitContactMock.mockResolvedValue(outcome);
      renderForm();
      fillRequired();
      type(/^How to reach you/, "ada@example.com");
      send();
      const button = await screen.findByRole("button", { name: "Send" });
      expect(button).toBeEnabled();
      expect(screen.getByLabelText("Name *")).toHaveValue("  Ada Lovelace ");
      expect(screen.getByLabelText(/^How to reach you/)).toHaveValue("ada@example.com");
    },
  );
});

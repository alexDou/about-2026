import { act, fireEvent, render, screen, waitFor } from "@octanejs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../../../i18n";
import { CONTACT_OUTCOME, fetchHealth, submitContact } from "../../../../../services/api";
import type { ContactFieldError, ContactOutcome } from "../../../../../services/api";
import { resetHealth } from "../../../api-status";
import { ContactForm } from "../ContactForm.tsrx";
import { loadHumanCheckWidget } from "../hooks/use-human-check-widget/load";
import type { ContactFormProps } from "../types";
import { resetFakeAltchaWidget, SOLVED_PAYLOAD, solving } from "./fake-altcha-widget";

vi.mock("../../../../../services/api", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../../../../../services/api")>()),
  submitContact: vi.fn<typeof submitContact>(),
  fetchHealth: vi.fn<typeof fetchHealth>(),
}));
vi.mock("../hooks/use-human-check-widget/load", () => ({
  loadHumanCheckWidget: vi.fn<typeof loadHumanCheckWidget>(),
}));
const loadWidgetMock = vi.mocked(loadHumanCheckWidget);
const submitContactMock = vi.mocked(submitContact);
const fetchHealthMock = vi.mocked(fetchHealth);

const content: ContactFormProps["content"] = {
  fields: {
    name: { label: "contact.form.name.label", requiredError: "contact.form.name.error" },
    company: { label: "contact.form.company.label", requiredError: "contact.form.company.error" },
    position: { label: "contact.form.position.label" },
    contact: { label: "contact.form.contact.label", hint: "contact.form.contact.hint" },
  },
  tooLong: "contact.form.tooLong",
  counter: "contact.form.counter",
  invalid: "contact.form.invalid",
  failed: "contact.form.failed",
  retryIn: "contact.form.retryIn",
  retryNow: "contact.form.retryNow",
  send: "contact.form.send",
  sending: "contact.form.sending",
  thanks: "contact.form.thanks",
};

const SENT: ContactOutcome = { kind: CONTACT_OUTCOME.sent };
const FAILED: ContactOutcome = { kind: CONTACT_OUTCOME.failed };
const refused = (...fields: ContactFieldError[]): ContactOutcome => ({
  kind: CONTACT_OUTCOME.invalidFields,
  fields,
});

// The widget loads in its own chunk: the form is rendered once it has, as a Visitor meets it.
const renderForm = async () => {
  const rendered = render(ContactForm, { props: { content }, wrapper: intlWrapper() });
  await act(async () => {});
  return rendered;
};

const type = (label: string | RegExp, value: string) =>
  fireEvent.input(screen.getByLabelText(label), { target: { value } });

const fillRequired = () => {
  type(/^Your name/, "  Ada Lovelace ");
  type(/^Company/, "Analytical Engines");
};

const send = () => fireEvent.click(screen.getByRole("button", { name: "Send" }));

beforeEach(() => {
  resetFakeAltchaWidget();
  loadWidgetMock.mockResolvedValue();
  submitContactMock.mockResolvedValue(SENT);
  fetchHealthMock.mockResolvedValue({ status: "ok" });
});
afterEach(() => {
  vi.clearAllMocks();
  vi.useRealTimers();
  resetHealth();
});

describe("ContactForm", () => {
  it("labels every field and marks the required ones with an asterisk", async () => {
    await renderForm();
    expect(screen.getByLabelText("Your name *")).toBeRequired();
    expect(screen.getByLabelText("Company *")).toBeRequired();
    expect(screen.getByLabelText("You're hiring for")).not.toBeRequired();
    expect(screen.getByLabelText(/^How to reach you/)).not.toBeRequired();
  });

  it("hints at the ways to reach the Visitor", async () => {
    await renderForm();
    expect(screen.getByLabelText(/^How to reach you/)).toHaveAccessibleDescription(
      "email, phone, LinkedIn, …",
    );
  });

  it("holds only its text in the Send button", async () => {
    await renderForm();
    const button = screen.getByRole("button", { name: "Send" });
    expect(button.querySelector("svg")).toBeNull();
    expect(button).toHaveTextContent("Send");
  });

  it("puts every label beside its input, in the dark look of the Panel", async () => {
    await renderForm();
    for (const input of screen.getAllByRole("textbox")) {
      expect(input.parentElement?.className).toContain("input-field--inline");
      expect(input.parentElement?.className).toContain("input-field--dark");
    }
  });

  it("lists the fields in order and ends with the Send button", async () => {
    await renderForm();
    const inputs = screen.getAllByRole("textbox").map((input) => input.getAttribute("name"));
    expect(inputs).toEqual(["name", "company", "position", "contact"]);
    const last = screen.getAllByRole("textbox").at(-1) as HTMLElement;
    const button = screen.getByRole("button", { name: "Send" });
    expect(last.compareDocumentPosition(button)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it("sends the cleaned fields once, leaving out what was not given", async () => {
    await renderForm();
    fillRequired();
    type("You're hiring for", "   ");
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalledTimes(1));
    expect(submitContactMock).toHaveBeenCalledWith({
      name: "Ada Lovelace",
      company: "Analytical Engines",
      altcha: `${SOLVED_PAYLOAD}-1`,
    });
  });

  it("sends the optional fields when they are given", async () => {
    await renderForm();
    fillRequired();
    type("You're hiring for", "Staff engineer");
    type(/^How to reach you/, "ada@example.com");
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalled());
    expect(submitContactMock).toHaveBeenCalledWith(
      expect.objectContaining({ position: "Staff engineer", contact: "ada@example.com" }),
    );
  });

  it("keeps Send disabled until both required fields hold something", async () => {
    await renderForm();
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    type(/^Company/, "Analytical Engines");
    expect(button).toBeDisabled();
    type(/^Your name/, "   ");
    expect(button).toBeDisabled();
    type(/^Your name/, "Ada");
    expect(button).toBeEnabled();
  });

  it("keeps Send disabled and sends nothing until the ALTCHA widget has loaded", async () => {
    let loaded!: () => void;
    loadWidgetMock.mockReturnValue(new Promise((resolve) => (loaded = () => resolve())));
    render(ContactForm, { props: { content }, wrapper: intlWrapper() });
    fillRequired();
    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toBeDisabled();
    // Enter in a field submits the form without the button.
    fireEvent.submit(button.closest("form") as HTMLElement);
    expect(submitContactMock).not.toHaveBeenCalled();
    await act(async () => loaded());
    expect(button).toBeEnabled();
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalledOnce());
  });

  it("disables Send while a field is over its limit, and frees it when the field fits", async () => {
    await renderForm();
    fillRequired();
    type("You're hiring for", "x".repeat(121));
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    type("You're hiring for", "x".repeat(120));
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });

  it("does not send a form that is submitted while it is invalid", async () => {
    await renderForm();
    type(/^Company/, "Analytical Engines");
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form") as HTMLElement);
    await act(async () => {});
    expect(submitContactMock).not.toHaveBeenCalled();
  });
  it("is disabled and says 'Sending…' while the request is on its way", async () => {
    submitContactMock.mockReturnValue(new Promise(() => {}));
    await renderForm();
    fillRequired();
    send();
    const button = await screen.findByRole("button", { name: "Sending…" });
    expect(button).toBeDisabled();
    for (const input of screen.getAllByRole("textbox")) expect(input).toBeDisabled();
  });

  it("replaces the form with a thank-you note naming the Visitor once it is sent", async () => {
    await renderForm();
    fillRequired();
    send();
    expect(
      await screen.findByText("Thank you, Ada Lovelace. I'll get back to you soon."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("moves the focus to the thank-you note, so that it is read out", async () => {
    await renderForm();
    fillRequired();
    send();
    expect(await screen.findByText(/^Thank you, Ada Lovelace/)).toHaveFocus();
  });
});

const widget = (container: HTMLElement) => container.querySelector("altcha-widget");

describe("ContactForm human check", () => {
  it("holds an invisible ALTCHA widget that solves on submit, fetching its challenge from the API", async () => {
    const { container } = await renderForm();
    const element = widget(container);
    expect(element).toBeInTheDocument();
    expect(element?.closest("form")).toBe(
      screen.getByRole("button", { name: "Send" }).closest("form"),
    );
    expect(element).toHaveAttribute("challenge", "/api/contact/challenge");
    expect(element).toHaveAttribute("auto", "onsubmit");
    expect(element).toHaveAttribute("display", "invisible");
  });

  it("sends the payload the widget solved", async () => {
    await renderForm();
    fillRequired();
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalledTimes(1));
    expect(submitContactMock.mock.calls[0]?.[0].altcha).toBe(`${SOLVED_PAYLOAD}-1`);
  });

  it("sends nothing while the widget is still solving", async () => {
    solving.next = "never-ends";
    await renderForm();
    fillRequired();
    send();
    await act(async () => {});
    expect(submitContactMock).not.toHaveBeenCalled();
  });

  it("does not let a second press of Send through while the widget is solving", async () => {
    solving.next = "never-ends";
    await renderForm();
    fillRequired();
    send();
    const form = screen.getByRole("button", { name: "Send" }).closest("form") as HTMLElement;
    fireEvent.submit(form);
    await act(async () => {});
    expect(submitContactMock).not.toHaveBeenCalled();
  });

  it("solves again for every attempt: a payload is used once", async () => {
    submitContactMock.mockResolvedValueOnce(refused({ field: "name", error: "required" }));
    await renderForm();
    fillRequired();
    send();
    await screen.findByText("Please enter your name.");
    type(/^Your name/, "Ada Lovelace");
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalledTimes(2));
    expect(submitContactMock.mock.calls.map(([request]) => request.altcha)).toEqual([
      `${SOLVED_PAYLOAD}-1`,
      `${SOLVED_PAYLOAD}-2`,
    ]);
  });
  it("shows the generic failure with the countdown when the widget cannot solve, sending nothing", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    solving.next = "fails";
    await renderForm();
    fillRequired();
    send();
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Your request wasn't sent.");
    expect(screen.getByText("Please try again in 10 s.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(submitContactMock).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Your name *")).toHaveValue("  Ada Lovelace ");
  });

  it("solves afresh when the Visitor tries again after a failed solve", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    solving.next = "fails";
    await renderForm();
    fillRequired();
    send();
    await screen.findByRole("alert");
    for (let second = 0; second < 10; second += 1) {
      await act(async () => {
        await vi.advanceTimersByTimeAsync(1000);
      });
    }
    expect(screen.getByText("Please try again.")).toBeInTheDocument();
    solving.next = "solves";
    send();
    expect(await screen.findByText(/^Thank you, Ada Lovelace/)).toBeInTheDocument();
  });
});

const trap = (container: HTMLElement) =>
  container.querySelector<HTMLInputElement>('input[name="website"]');

describe("ContactForm honeypot", () => {
  it("holds a field named website that no Visitor and no assistive technology reaches", async () => {
    const { container } = await renderForm();
    const field = trap(container);
    expect(field).toBeInTheDocument();
    expect(field).not.toBeVisible();
    expect(field?.closest("[aria-hidden='true']")).not.toBeNull();
    expect(field).toHaveAttribute("tabindex", "-1");
    expect(field).toHaveAttribute("autocomplete", "off");
    expect(screen.queryByRole("textbox", { name: /website/i })).not.toBeInTheDocument();
  });

  it("sends nothing in it from a Visitor", async () => {
    await renderForm();
    fillRequired();
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalled());
    expect(submitContactMock.mock.calls[0]?.[0].website).toBeUndefined();
  });

  it("sends what a bot put in it", async () => {
    const { container } = await renderForm();
    fillRequired();
    fireEvent.input(trap(container) as HTMLElement, { target: { value: "https://spam.example" } });
    send();
    await waitFor(() => expect(submitContactMock).toHaveBeenCalled());
    expect(submitContactMock.mock.calls[0]?.[0].website).toBe("https://spam.example");
  });
});

const blur = (label: string | RegExp) => fireEvent.blur(screen.getByLabelText(label));

describe("ContactForm field feedback", () => {
  it("says nothing about a field the Visitor has not touched", async () => {
    await renderForm();
    expect(screen.queryByText("Please enter your name.")).not.toBeInTheDocument();
    expect(screen.queryByText("Please enter your company.")).not.toBeInTheDocument();
    expect(screen.getByLabelText("Your name *")).not.toHaveAttribute("aria-invalid", "true");
  });

  it("names a required field the Visitor empties again, while typing", async () => {
    await renderForm();
    type(/^Your name/, "Ada");
    expect(screen.queryByText("Please enter your name.")).not.toBeInTheDocument();
    type(/^Your name/, "");
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
    type(/^Your name/, "Ada");
    expect(screen.queryByText("Please enter your name.")).not.toBeInTheDocument();
  });
  it("names the missing field under it when it loses focus empty, and links the two", async () => {
    await renderForm();
    blur(/^Your name/);
    const input = screen.getByLabelText("Your name *");
    expect(input).toBeInvalid();
    expect(input).toHaveAccessibleDescription("Please enter your name.");
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
  });

  it("asks for the company in its own words", async () => {
    await renderForm();
    blur(/^Company/);
    expect(screen.getByText("Please enter your company.")).toBeInTheDocument();
  });

  it("counts whitespace only as empty", async () => {
    await renderForm();
    type(/^Your name/, "   \t ");
    blur(/^Your name/);
    expect(screen.getByText("Please enter your name.")).toBeInTheDocument();
  });

  it("accepts a field with spaces around the value", async () => {
    await renderForm();
    type(/^Your name/, "  Ada ");
    blur(/^Your name/);
    expect(screen.getByLabelText("Your name *")).not.toBeInvalid();
  });

  it("leaves an optional field empty without a word", async () => {
    await renderForm();
    blur("You're hiring for");
    expect(screen.getByLabelText("You're hiring for")).not.toBeInvalid();
  });

  it("names the limit of a field as soon as it is too long", async () => {
    await renderForm();
    type("You're hiring for", "x".repeat(121));
    expect(screen.getByText("At most 120 characters.")).toBeInTheDocument();
    expect(screen.getByLabelText("You're hiring for")).toBeInvalid();
  });
  it("shows a counter once a field is past 80% of its limit", async () => {
    await renderForm();
    type(/^Your name/, "x".repeat(64));
    expect(screen.queryByText(/ \/ 80$/)).not.toBeInTheDocument();
    type(/^Your name/, "x".repeat(65));
    expect(screen.getByText("65 / 80")).toBeInTheDocument();
  });

  it("counts characters as people see them, in code points", async () => {
    await renderForm();
    type(/^Your name/, "😀".repeat(70));
    expect(screen.getByText("70 / 80")).toBeInTheDocument();
  });

  it("shows what the backend refused under each field, keeps the values and focuses the first", async () => {
    submitContactMock.mockResolvedValue(
      refused({ field: "company", error: "tooLong" }, { field: "name", error: "required" }),
    );
    await renderForm();
    fillRequired();
    send();
    expect(await screen.findByText("Please enter your name.")).toBeInTheDocument();
    expect(screen.getByText("At most 100 characters.")).toBeInTheDocument();
    expect(screen.getByLabelText("Your name *")).toBeInvalid();
    expect(screen.getByLabelText("Your name *")).toHaveValue("  Ada Lovelace ");
    expect(screen.getByLabelText("Company *")).toHaveValue("Analytical Engines");
    await waitFor(() => expect(screen.getByLabelText("Your name *")).toHaveFocus());
  });

  it("locks Send after a 422 until a field is changed, with no countdown and no notice", async () => {
    submitContactMock.mockResolvedValue(refused({ field: "name", error: "required" }));
    await renderForm();
    fillRequired();
    send();
    await screen.findByText("Please enter your name.");
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.queryByText(/Please try again/)).not.toBeInTheDocument();
    type(/^Your name/, "Ada");
    expect(screen.queryByText("Please enter your name.")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });

  it("tells the Visitor of a refusal that names no field of the form, and keeps what was typed", async () => {
    submitContactMock.mockResolvedValue(refused({ field: "website", error: "tooLong" }));
    await renderForm();
    fillRequired();
    send();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Some details were not accepted. Please check the form and try again.",
    );
    expect(screen.getByLabelText("Company *")).toHaveValue("Analytical Engines");
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });
  it("takes the notice away when the Visitor changes a field", async () => {
    submitContactMock.mockResolvedValueOnce(refused());
    await renderForm();
    fillRequired();
    send();
    await screen.findByRole("alert");
    type(/^Company/, "Analytical Engines Ltd");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

/** Lets seconds pass one at a time: each tick is scheduled after the render of the one before. */
const passSeconds = async (seconds: number) => {
  for (let second = 0; second < seconds; second += 1) {
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });
  }
};

describe("ContactForm when sending fails", () => {
  const fail = async () => {
    submitContactMock.mockResolvedValueOnce(FAILED);
    fillRequired();
    type("You're hiring for", "Staff engineer");
    send();
    return screen.findByRole("alert");
  };

  it("brings the form back with everything typed, a generic reason and a 10 s countdown", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderForm();
    const alert = await fail();
    expect(alert).toHaveTextContent("Your request wasn't sent.");
    expect(screen.getByText("Please try again in 10 s.")).toBeInTheDocument();
    expect(screen.getByLabelText("Your name *")).toHaveValue("  Ada Lovelace ");
    expect(screen.getByLabelText("You're hiring for")).toHaveValue("Staff engineer");
  });

  it("locks Send while the countdown runs, counting down each second", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderForm();
    const alert = await fail();
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
    await passSeconds(3);
    expect(screen.getByText("Please try again in 7 s.")).toBeInTheDocument();
    expect(alert).not.toHaveTextContent(/\d+ s\./);
    expect(screen.getByRole("button", { name: "Send" })).toBeDisabled();
  });

  it("lets the Visitor try again once the countdown is over, with the fields still theirs", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderForm();
    await fail();
    await passSeconds(10);
    expect(screen.getByText("Please try again.")).toBeInTheDocument();
    expect(screen.queryByText(/ s\.$/)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
    send();
    expect(await screen.findByText(/^Thank you, Ada Lovelace/)).toBeInTheDocument();
  });

  it("keeps the fields editable during the countdown", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderForm();
    await fail();
    expect(screen.getByLabelText("Your name *")).toBeEnabled();
  });

  it("does not send during the countdown, even when the form is submitted", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await renderForm();
    await fail();
    fireEvent.submit(screen.getByRole("button", { name: "Send" }).closest("form") as HTMLElement);
    await act(async () => {});
    expect(submitContactMock).toHaveBeenCalledTimes(1);
  });
});

describe("ContactForm while the backend is down", () => {
  it("disables the fields and Send, keeping what is typed", async () => {
    fetchHealthMock.mockRejectedValue(new TypeError("network"));
    await renderForm();
    await waitFor(() => expect(screen.getByRole("button", { name: "Send" })).toBeDisabled());
    for (const input of screen.getAllByRole("textbox")) expect(input).toBeDisabled();
  });

  it("is usable again once the backend answers", async () => {
    fetchHealthMock.mockResolvedValue({ status: "ok" });
    await renderForm();
    fillRequired();
    await act(async () => {});
    expect(screen.getByRole("button", { name: "Send" })).toBeEnabled();
  });
});

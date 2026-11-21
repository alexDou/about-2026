/**
 * A stand-in for `<altcha-widget auto="onsubmit">`, along the contract the real one keeps:
 * - while it is unverified it takes the form's first submit (capture phase), stops it, solves,
 *   then submits the form again with the payload;
 * - every change of its state is a `statechange` event whose detail is `{ state, payload }`;
 * - once verified it lets submits through.
 * The tests choose how the next solving goes with `solving`.
 */
export const SOLVED_PAYLOAD = "solved-payload";

type Solving = "solves" | "fails" | "never-ends";

export const solving: { next: Solving; payloads: string[] } = { next: "solves", payloads: [] };

class FakeAltchaWidget extends HTMLElement {
  state = "unverified";
  payload: string | null = null;
  #form: HTMLFormElement | null = null;

  connectedCallback() {
    this.#form = this.closest("form");
    this.#form?.addEventListener("submit", this.#onSubmit, { capture: true });
  }

  disconnectedCallback() {
    this.#form?.removeEventListener("submit", this.#onSubmit, { capture: true });
  }

  #change(state: string, payload: string | null = null) {
    this.state = state;
    this.payload = payload;
    this.dispatchEvent(new CustomEvent("statechange", { detail: { state, payload } }));
  }

  #onSubmit = (event: SubmitEvent) => {
    if (this.state !== "unverified") return;
    event.preventDefault();
    event.stopPropagation();
    this.#change("verifying");
    const outcome = solving.next;
    if (outcome === "never-ends") return;
    queueMicrotask(() => {
      if (outcome === "fails") {
        this.#change("error");
        return;
      }
      const payload = `${SOLVED_PAYLOAD}-${solving.payloads.length + 1}`;
      solving.payloads.push(payload);
      this.#change("verified", payload);
      this.#form?.requestSubmit(event.submitter);
    });
  };
}

if (!customElements.get("altcha-widget")) customElements.define("altcha-widget", FakeAltchaWidget);

/** Back to a widget that solves, with no payload handed out yet. */
export function resetFakeAltchaWidget() {
  solving.next = "solves";
  solving.payloads = [];
}

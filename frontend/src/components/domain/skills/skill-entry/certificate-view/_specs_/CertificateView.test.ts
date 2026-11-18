import { fireEvent, render, screen, within } from "@octanejs/testing-library";
import { afterEach, describe, expect, it, vi } from "vitest";
import { intlWrapper } from "../../../../../../i18n";
import { CertificateView } from "../CertificateView.tsrx";
import type { CertificateViewCertificate } from "../types";

const TESTDOME: CertificateViewCertificate = {
  id: "testdomePython",
  title: "skills.certificate.testdomePython.title",
  issuer: "skills.issuer.testdome",
  date: { year: 2022, month: 3 },
  ranking: "skills.certificate.testdomePython.ranking",
  image: {
    avif: "/certificates/testdomePython.avif",
    webp: "/certificates/testdomePython.webp",
  },
};

const EDUCATIVE: CertificateViewCertificate = {
  id: "educativeKotlin",
  title: "skills.certificate.educativeKotlin.title",
  issuer: "skills.issuer.educative",
  date: { year: 2025, month: 6 },
  verifyUrl: "https://issuer.test/verify/kotlin",
  image: {
    avif: "/certificates/educativeKotlin.avif",
    webp: "/certificates/educativeKotlin.webp",
  },
};

const setup = (certificate: CertificateViewCertificate, label = "Certificate") =>
  render(CertificateView, { props: { certificate, label }, wrapper: intlWrapper() });

/** The dialog is closed in the tests (no browser to open it), so it is out of the accessibility tree. */
const dialogOf = (container: HTMLElement) => container.querySelector("dialog")!;

afterEach(() => {
  document.body.innerHTML = "";
});

describe("CertificateView", () => {
  it("is a button named by its label, opening its dialog by Invoker Commands", () => {
    const { container } = setup(TESTDOME, "TestDome");
    const trigger = screen.getByRole("button", { name: "TestDome" });
    const dialog = dialogOf(container);
    expect(trigger).toHaveAttribute("type", "button");
    expect(trigger).toHaveAttribute("commandfor", dialog.id);
    expect(trigger).toHaveAttribute("command", "show-modal");
  });

  it("has a dialog named by the certificate's title", () => {
    const { container } = setup(TESTDOME);
    const dialog = dialogOf(container);
    const heading = within(dialog).getByRole("heading", { hidden: true, name: "Python" });
    expect(dialog).toHaveAttribute("aria-labelledby", heading.id);
  });

  it("shows the title, the issuer and the month and year", () => {
    const { container } = setup(TESTDOME);
    const dialog = within(dialogOf(container));
    expect(dialog.getByText("Python")).toBeInTheDocument();
    expect(dialog.getByText("TestDome")).toBeInTheDocument();
    expect(dialog.getByText("Mar 2022")).toBeInTheDocument();
  });

  it("shows the year alone where the certificate gives no month", () => {
    const { container } = setup({ ...TESTDOME, date: { year: 2026 } });
    expect(within(dialogOf(container)).getByText("2026")).toBeInTheDocument();
  });

  it("shows the ranking where there is one, and none otherwise", () => {
    const { container } = setup(TESTDOME);
    expect(within(dialogOf(container)).getByText("Top 10%")).toBeInTheDocument();
    document.body.innerHTML = "";
    const other = setup(EDUCATIVE);
    expect(within(dialogOf(other.container)).queryByText("Top 10%")).not.toBeInTheDocument();
  });

  it("links to the issuer's verification page, in a new tab, where there is one", () => {
    const { container } = setup(EDUCATIVE);
    const link = within(dialogOf(container)).getByRole("link", {
      hidden: true,
      name: "Verify at the issuer",
    });
    expect(link).toHaveAttribute("href", "https://issuer.test/verify/kotlin");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toMatch(/noopener/);
  });

  it("has no verification link where the issuer gives none", () => {
    const { container } = setup(TESTDOME);
    expect(within(dialogOf(container)).queryByText("Verify at the issuer")).not.toBeInTheDocument();
  });

  it("loads the image as AVIF, with the WebP as the fallback, and describes it", () => {
    const { container } = setup(TESTDOME);
    const picture = dialogOf(container).querySelector("picture")!;
    const source = picture.querySelector("source")!;
    expect(source).toHaveAttribute("type", "image/avif");
    expect(source).toHaveAttribute("srcset", TESTDOME.image.avif);
    const img = picture.querySelector("img")!;
    expect(img).toHaveAttribute("src", TESTDOME.image.webp);
    expect(img.getAttribute("alt")).toMatch(/Python/);
    expect(img.getAttribute("alt")).toMatch(/TestDome/);
  });

  it("loads the image lazily, so a closed dialog costs nothing on page load", () => {
    const { container } = setup(TESTDOME);
    const img = dialogOf(container).querySelector("img")!;
    expect(img).toHaveAttribute("loading", "lazy");
    expect(img).toHaveAttribute("decoding", "async");
  });

  it("has a close button that closes the dialog by Invoker Commands", () => {
    const { container } = setup(TESTDOME);
    const dialog = dialogOf(container);
    const close = within(dialog).getByRole("button", { hidden: true, name: "Close" });
    expect(close).toHaveAttribute("type", "button");
    expect(close).toHaveAttribute("commandfor", dialog.id);
    expect(close).toHaveAttribute("command", "close");
  });

  it("keeps Escape to itself: the key never reaches the document, where the Expanded panel listens", () => {
    const { container } = setup(TESTDOME);
    const onDocument = vi.fn<(event: KeyboardEvent) => void>();
    document.addEventListener("keydown", onDocument);
    fireEvent.keyDown(within(dialogOf(container)).getByRole("button", { hidden: true }), {
      key: "Escape",
    });
    document.removeEventListener("keydown", onDocument);
    expect(onDocument).not.toHaveBeenCalled();
  });

  it("lets other keys through", () => {
    const { container } = setup(TESTDOME);
    const onDocument = vi.fn<(event: KeyboardEvent) => void>();
    document.addEventListener("keydown", onDocument);
    fireEvent.keyDown(within(dialogOf(container)).getByRole("button", { hidden: true }), {
      key: "Tab",
    });
    document.removeEventListener("keydown", onDocument);
    expect(onDocument).toHaveBeenCalledOnce();
  });
});

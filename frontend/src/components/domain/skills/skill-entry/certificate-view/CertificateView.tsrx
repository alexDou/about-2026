import { useIntl } from "../../../../../hooks/use-intl";
import { formatCertificateDate } from "../../format-certificate-date";
import styles from "./styles.module.css";
import type { CertificateViewProps } from "./types";

/**
 * A Certificate's link and the dialog it opens: the image, title, issuer, month and year, the
 * ranking and the issuer's verification link. The link and the close button open and close the
 * dialog by Invoker Commands (`commandfor` + `command`), so no script and no ref are involved.
 * Escape closes the dialog, and the key stops here: the Expanded panel behind it never hears it.
 */
export function CertificateView({ certificate, label }: CertificateViewProps) @{
  const intl = useIntl();
  const dialogId = `certificate-${certificate.id}`;
  const titleId = `${dialogId}-title`;
  const title = intl.formatMessage({ id: certificate.title });
  const issuer = intl.formatMessage({ id: certificate.issuer });
  const date = formatCertificateDate(intl, certificate.date);

  <>
    <button
      type="button"
      class={styles["certificate-view__link"]}
      commandfor={dialogId}
      command="show-modal"
    >
      {label}
    </button>
    <dialog
      id={dialogId}
      class={styles["certificate-view__dialog"]}
      aria-labelledby={titleId}
      onKeyDown={(event: KeyboardEvent) => {
        if (event.key === "Escape") event.stopPropagation();
      }}
    >
      <button
        type="button"
        class={styles["certificate-view__close"]}
        commandfor={dialogId}
        command="close"
        aria-label={intl.formatMessage({ id: "skills.certificateClose" })}
      />
      <picture>
        <source type="image/avif" srcSet={certificate.image.avif} />
        <img
          class={styles["certificate-view__image"]}
          src={certificate.image.webp}
          loading="lazy"
          decoding="async"
          alt={intl.formatMessage({ id: "skills.certificateImageAlt" }, { title, issuer })}
        />
      </picture>
      <h3 id={titleId} class={styles["certificate-view__title"]}>
        {title}
      </h3>
      <p class={styles["certificate-view__issuer"]}>{issuer}</p>
      <p class={styles["certificate-view__date"]}>{date}</p>
      @if (certificate.ranking !== undefined) {
        <p class={styles["certificate-view__ranking"]}>
          {intl.formatMessage({ id: certificate.ranking })}
        </p>;
      }
      @if (certificate.verifyUrl !== undefined) {
        <a
          class={styles["certificate-view__verify"]}
          href={certificate.verifyUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          {intl.formatMessage({ id: "skills.certificateVerify" })}
        </a>;
      }
    </dialog>
  </>;
}

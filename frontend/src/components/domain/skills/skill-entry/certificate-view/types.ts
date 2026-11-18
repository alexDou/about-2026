import type { MessageId } from "../../../../../i18n";

/** What the Certificate view shows of a Certificate. */
export type CertificateViewCertificate = {
  id: string;
  title: MessageId;
  issuer: MessageId;
  /** `month` is 1 to 12; some Certificates give a year only. */
  date: { year: number; month?: number };
  /** Where the Owner placed, such as "Top 10%". */
  ranking?: MessageId;
  /** The issuer's own page that verifies the Certificate. */
  verifyUrl?: string;
  /** Paths from the site root; the WebP is the fallback for browsers without AVIF. */
  image: { avif: string; webp: string };
};

export type CertificateViewProps = {
  certificate: CertificateViewCertificate;
  /** The text of the link that opens the view. */
  label: string;
};

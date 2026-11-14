import type { MessageId } from "../../../../i18n";

export type AboutEducationCardProps = {
  heading: MessageId;
  education: {
    degree: MessageId;
    school: MessageId;
    place: MessageId;
    year: MessageId;
    /** One sentence on the product and business thinking the degree built. */
    business: MessageId;
    /** "{school} · {place} · {year}". */
    line: MessageId;
  };
};

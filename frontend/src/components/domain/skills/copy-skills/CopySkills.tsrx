import { useClipboard } from "../../../../hooks/use-clipboard";
import { useIntl } from "../../../../hooks/use-intl";
import { formatCertificateDate } from "../format-certificate-date";
import { COPIED_MS } from "./config";
import styles from "./styles.module.css";
import type { CopySkillsProps } from "./types";
import { buildSkillsText } from "./utils";

/**
 * Copy skills: a button that puts all the Skills on the clipboard as plain, structured text,
 * whatever is open on screen. "Copied" shows to its left for a moment, in a status region that
 * is always in the page, so screen readers announce it when its text appears.
 */
export function CopySkills({ groups }: CopySkillsProps) @{
  const intl = useIntl();
  const { copied, copy } = useClipboard(COPIED_MS);

  const copyAll = () =>
    copy(
      buildSkillsText(groups, {
        message: (id) => intl.formatMessage({ id }),
        date: (date) => formatCertificateDate(intl, date),
        certified: intl.formatMessage({ id: "skills.copyCertified" }),
      }),
    );

  <div class={styles["copy-skills"]}>
    <output class={styles["copy-skills__status"]}>
      {copied ? intl.formatMessage({ id: "skills.copied" }) : ""}
    </output>
    <button type="button" class={styles["copy-skills__button"]} onClick={copyAll}>
      {intl.formatMessage({ id: "skills.copySkills" })}
    </button>
  </div>;
}

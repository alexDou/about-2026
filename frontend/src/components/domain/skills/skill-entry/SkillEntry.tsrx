import "octane/signals";
import { useIntl } from "../../../../hooks/use-intl";
import { CertificateView } from "./certificate-view";
import { overviews$, skillOpen, toggleSkill } from "../overviews";
import styles from "./styles.module.css";
import type { SkillEntryProps } from "./types";

/**
 * One Skill: its filled arrow, its name and its overview. The arrow is the only toggle; the name
 * is plain, selectable text. A Certificate that backs the Skill is a link beneath the overview,
 * labelled by its issuer when the Skill has two. A closed overview stays in the page, out of sight
 * and out of reach (`inert`), so the open and close can be a CSS transition.
 */
export function SkillEntry({ skill, headings }: SkillEntryProps) @{
  const intl = useIntl();
  const open = skillOpen(overviews$.get(), skill.id);
  const name = intl.formatMessage({ id: skill.name });
  const overviewId = `skill-overview-${skill.id}`;

  <li class={styles["skill-entry"]}>
    <div class={styles["skill-entry__row"]}>
      <button
        type="button"
        class={[styles["skill-entry__arrow"], open && styles["skill-entry__arrow--open"]]}
        aria-expanded={open}
        aria-controls={overviewId}
        aria-label={intl.formatMessage({ id: "skills.overviewToggle" }, { name })}
        onClick={() => toggleSkill(headings, skill.id)}
      >
        <span class={styles["skill-entry__arrow-shape"]} />
      </button>
      <span class={styles["skill-entry__name"]}>{name}</span>
    </div>
    <div
      id={overviewId}
      class={[styles["skill-entry__overview"], open && styles["skill-entry__overview--open"]]}
      inert={!open}
    >
      <div class={styles["skill-entry__overview-body"]}>
        <p class={styles["skill-entry__overview-text"]}>
          {intl.formatMessage({ id: skill.overview })}
        </p>
        @if (skill.certificates.length > 0) {
          <ul class={styles["skill-entry__certificates"]}>
            @for (const certificate of skill.certificates; key certificate.id) {
              <li>
                <CertificateView
                  certificate={certificate}
                  label={
                    skill.certificates.length > 1
                      ? intl.formatMessage({ id: certificate.issuer })
                      : intl.formatMessage({ id: "skills.certificateLink" })
                  }
                />
              </li>;
            }
          </ul>;
        }
      </div>
    </div>
  </li>;
}

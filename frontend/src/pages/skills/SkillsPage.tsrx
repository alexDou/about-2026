import { useEffect } from "octane";
import { Heading } from "../../components/ui/heading";
import { reset } from "../../components/domain/skills/overviews";
import { SkillGroup } from "../../components/domain/skills/skill-group";
import { useIntl } from "../../hooks/use-intl";
import { SKILLS_CONTENT } from "./content";
import styles from "./styles.module.css";

/**
 * The Skills Panel's page: the heading, a row for the page's two controls (Expand all on the
 * left, Copy skills on the right), then a block per Skill group.
 */
export function SkillsPage() @{
  const intl = useIntl();
  // What is open belongs to this visit: the next one starts closed.
  useEffect(() => reset, []);

  <section class={styles["skills-page"]}>
    <Heading text={intl.formatMessage({ id: "explore.panel.skills.title" })} />
    <div class={styles["skills-page__header-row"]} />
    <div class={styles["skills-page__groups"]}>
      @for (const group of SKILLS_CONTENT.groups; key group.id) {
        <SkillGroup group={group} />;
      }
    </div>
  </section>;
}

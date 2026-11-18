import "octane/signals";
import { useEffect } from "octane";
import { Heading } from "../../components/ui/heading";
import { WalkingToggle } from "../../components/ui/walking-toggle";
import { expandedOf, overviews$, reset, setAll } from "../../components/domain/skills/overviews";
import { CopySkills } from "../../components/domain/skills/copy-skills";
import { SkillGroup } from "../../components/domain/skills/skill-group";
import { useIntl } from "../../hooks/use-intl";
import { SKILLS_CONTENT } from "./content";
import styles from "./styles.module.css";

/**
 * The Skills Panel's page: the heading, a row for the page's two controls (Expand all on the
 * left, Copy skills on the right), then the accordion: a band per Skill group, all closed.
 */
export function SkillsPage() @{
  const intl = useIntl();
  // What is open belongs to this visit: the next one starts closed.
  useEffect(() => reset, []);

  <section class={styles["skills-page"]}>
    <Heading text={intl.formatMessage({ id: "explore.panel.skills.title" })} />
    <div class={styles["skills-page__header-row"]}>
      <WalkingToggle
        position={expandedOf(overviews$.get(), SKILLS_CONTENT.groups)}
        labels={{
          off: intl.formatMessage({ id: "skills.expandAll" }),
          on: intl.formatMessage({ id: "skills.collapseAll" }),
        }}
        onChange={(open) => setAll(SKILLS_CONTENT.groups, open)}
      />
      <CopySkills groups={SKILLS_CONTENT.groups} />
    </div>
    <div class={styles["skills-page__accordion"]}>
      @for (const group of SKILLS_CONTENT.groups; key group.id) {
        <SkillGroup group={group} />;
      }
    </div>
  </section>;
}

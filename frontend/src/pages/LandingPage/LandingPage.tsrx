import { ApiStatus } from "../../components/domain/ApiStatus";
import { AnimatedLogo } from "../../components/ui/AnimatedLogo";
import { useIntl } from "../../hooks/useIntl";
import styles from "./styles.module.css";

function handleLogoClick() {
  // Placeholder until the logo gets a real action.
  console.log("logo clicked");
}

export function LandingPage() @{
  const intl = useIntl();
  <main class={styles["page"]}>
    // Octane hoists the title into <head>.
    <title>{intl.formatMessage({ id: "site.title" })}</title>
    <AnimatedLogo
      label={intl.formatMessage({ id: "landing.logo.label" })}
      onClick={handleLogoClick}
    />
    <ApiStatus />
  </main>;
}

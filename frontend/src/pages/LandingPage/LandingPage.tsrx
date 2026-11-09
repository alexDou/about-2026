import { useEffect } from "octane";
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
  const title = intl.formatMessage({ id: "site.title" });

  // index.html's static <title> stays first in <head>, so a rendered <title> would never show.
  // Set the document title instead, and give the static one back on leaving.
  useEffect(() => {
    const staticTitle = document.title;
    document.title = title;
    return () => {
      document.title = staticTitle;
    };
  });

  <main class={styles["page"]}>
    <AnimatedLogo
      label={intl.formatMessage({ id: "landing.logo.label" })}
      onClick={handleLogoClick}
    />
    <ApiStatus />
  </main>;
}

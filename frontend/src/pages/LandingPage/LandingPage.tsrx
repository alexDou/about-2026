import { useEffect } from "octane";
import { ApiStatus } from "../../components/domain/ApiStatus";
import { AnimatedLogo } from "../../components/ui/AnimatedLogo";
import { useIntl } from "../../hooks/useIntl";
import { BOARD_ROUTE, useRoute } from "../../hooks/useRoute";
import styles from "./styles.module.css";

export function LandingPage() @{
  const intl = useIntl();
  const { navigate } = useRoute();
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
      onClick={() => navigate(BOARD_ROUTE)}
    />
    <ApiStatus />
  </main>;
}

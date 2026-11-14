import { ApiStatus } from "../../components/domain/api-status";
import { AnimatedLogo } from "../../components/ui/animated-logo";
import { useDocumentTitle } from "../../hooks/use-document-title";
import { useIntl } from "../../hooks/use-intl";
import { DEFAULT_BOARD, useRoute } from "../../hooks/use-route";
import styles from "./styles.module.css";

export function LandingPage() @{
  const intl = useIntl();
  const { navigate } = useRoute();

  useDocumentTitle(intl.formatMessage({ id: "site.title" }));

  <main class={styles["landing-page"]}>
    <AnimatedLogo
      label={intl.formatMessage({ id: "landing.logo.label" })}
      onClick={() => navigate(DEFAULT_BOARD)}
    />
    <ApiStatus />
  </main>;
}

import { ApiStatus } from "../../components/domain/ApiStatus";
import { AnimatedLogo } from "../../components/ui/AnimatedLogo";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";
import { useIntl } from "../../hooks/useIntl";
import { BOARD_ROUTE, useRoute } from "../../hooks/useRoute";
import styles from "./styles.module.css";

export function LandingPage() @{
  const intl = useIntl();
  const { navigate } = useRoute();

  useDocumentTitle(intl.formatMessage({ id: "site.title" }));

  <main class={styles["page"]}>
    <AnimatedLogo
      label={intl.formatMessage({ id: "landing.logo.label" })}
      onClick={() => navigate(BOARD_ROUTE)}
    />
    <ApiStatus />
  </main>;
}

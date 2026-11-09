import { IntlProvider } from "../i18n";
import { LandingPage } from "../pages/LandingPage";
import styles from "./styles.module.css";

export function App() @{
  <IntlProvider>
    <div class={styles["app"]}>
      <LandingPage />
    </div>
  </IntlProvider>;
}

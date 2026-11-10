import { Board } from "../components/domain/Board";
import { useRoute } from "../hooks/useRoute";
import { IntlProvider } from "../i18n";
import { LandingPage } from "../pages/LandingPage";
import styles from "./styles.module.css";

export function App() @{
  const { route } = useRoute();

  <IntlProvider>
    <div class={styles["app"]}>
      @if (route.screen === "landing") {
        <LandingPage />;
      } @else {
        <Board />;
      }
    </div>
  </IntlProvider>;
}

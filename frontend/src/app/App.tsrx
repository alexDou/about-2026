import { Outlet } from "../hooks/useRoute";
import { IntlProvider } from "../i18n";
import styles from "./styles.module.css";

/** The site: the messages, and the screen the route shows. */
export function App() @{
  <IntlProvider>
    <div class={styles["app"]}>
      <Outlet />
    </div>
  </IntlProvider>;
}

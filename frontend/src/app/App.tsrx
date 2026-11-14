import { Outlet } from "../hooks/use-route";
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

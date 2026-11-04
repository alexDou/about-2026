import { LandingPage } from "../pages/LandingPage";
import styles from "./styles.module.css";

export function App() {
  return (
    <div class={styles["app"]}>
      <LandingPage />
    </div>
  );
}

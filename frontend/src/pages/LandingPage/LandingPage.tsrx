import { ApiStatus } from "../../components/domain/ApiStatus";
import { AnimatedLogo } from "../../components/ui/AnimatedLogo";
import styles from "./styles.module.css";

function handleLogoClick() {
  // Placeholder until the logo gets a real action.
  console.log("logo clicked");
}

export function LandingPage() @{
  <main class={styles["page"]}>
    <AnimatedLogo label="Portfolio home" onClick={handleLogoClick} />
    <ApiStatus />
  </main>;
}

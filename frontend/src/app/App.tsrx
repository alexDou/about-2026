import { Board } from "../components/domain/Board";
import { useRoute } from "../hooks/useRoute";
import { IntlProvider } from "../i18n";
import { AboutPage } from "../pages/AboutPage";
import { ChatWithMePage } from "../pages/ChatWithMePage";
import { ContactPage } from "../pages/ContactPage";
import { LandingPage } from "../pages/LandingPage";
import { SkillsPage } from "../pages/SkillsPage";
import { WhatIDoPage } from "../pages/WhatIDoPage";
import styles from "./styles.module.css";

export function App() @{
  const { route } = useRoute();

  <IntlProvider>
    <div class={styles["app"]}>
      @if (route.screen === "landing") {
        <LandingPage />;
      } @else {
        // The Expanded panel's page goes into the Board; the default Board has none.
        <Board board={route.board}>
          @if (route.board.kind === "expanded") {
            @switch (route.board.panel) {
              @case "about": {
                <AboutPage />;
              }
              @case "whatIDo": {
                <WhatIDoPage />;
              }
              @case "skills": {
                <SkillsPage />;
              }
              @case "chatWithMe": {
                <ChatWithMePage />;
              }
              @case "contact": {
                <ContactPage />;
              }
            }
          }
        </Board>;
      }
    </div>
  </IntlProvider>;
}

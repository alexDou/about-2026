import { Board, boardViewTransition } from "../components/domain/Board";
import { createAppRouter } from "../hooks/useRoute";
import type { AppRouter } from "../hooks/useRoute";
import { AboutPage } from "../pages/AboutPage";
import { ChatWithMePage } from "../pages/ChatWithMePage";
import { ContactPage } from "../pages/ContactPage";
import { LandingPage } from "../pages/LandingPage";
import { SkillsPage } from "../pages/SkillsPage";
import { WhatIDoPage } from "../pages/WhatIDoPage";
import { App } from "./App.tsrx";

/** The site's router: the `App` around the Landing, and the Board around each Panel's page. */
export function createSiteRouter(): AppRouter {
  return createAppRouter({
    shell: App,
    landing: LandingPage,
    board: Board,
    pages: {
      about: AboutPage,
      whatIDo: WhatIDoPage,
      skills: SkillsPage,
      chatWithMe: ChatWithMePage,
      contact: ContactPage,
    },
    viewTransition: boardViewTransition,
  });
}

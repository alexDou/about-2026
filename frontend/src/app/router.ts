import { Board, boardViewTransition } from "../components/domain/board";
import { createAppRouter } from "../hooks/use-route";
import type { AppRouter } from "../hooks/use-route";
import { AboutPage } from "../pages/about";
import { ChatWithMePage } from "../pages/chat-with-me";
import { ContactPage } from "../pages/contact";
import { LandingPage } from "../pages/landing";
import { SkillsPage } from "../pages/skills";
import { WhatIDoPage } from "../pages/what-i-do";
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

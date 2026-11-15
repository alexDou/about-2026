import { exploreViewTransition } from "../components/domain/explore";
import { createAppRouter } from "../hooks/use-route";
import type { AppRouter } from "../hooks/use-route";
import { AboutPage } from "../pages/about";
import { ChatWithMePage } from "../pages/chat-with-me";
import { ContactPage } from "../pages/contact";
import { ExplorePage } from "../pages/explore";
import { LandingPage } from "../pages/landing";
import { SkillsPage } from "../pages/skills";
import { WhatIDoPage } from "../pages/what-i-do";
import { App } from "./App.tsrx";

/** The site's router: the `App` around the Landing, and Explore around each Panel's page. */
export function createSiteRouter(): AppRouter {
  return createAppRouter({
    shell: App,
    landing: LandingPage,
    explore: ExplorePage,
    pages: {
      about: AboutPage,
      whatIDo: WhatIDoPage,
      skills: SkillsPage,
      chatWithMe: ChatWithMePage,
      contact: ContactPage,
    },
    viewTransition: exploreViewTransition,
  });
}

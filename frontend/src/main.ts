import { createRoot } from "octane";
import { createSiteRouter } from "./app";
import { RouterProvider } from "./hooks/useRoute";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) throw new Error("#root element missing");

createRoot(container).render(RouterProvider, { router: createSiteRouter() });

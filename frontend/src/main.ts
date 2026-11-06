import { createRoot } from "octane";
import { App } from "./app";
import "./styles/global.css";

const container = document.getElementById("root");
if (!container) throw new Error("#root element missing");

createRoot(container).render(App, {});

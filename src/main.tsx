import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

// Hide pre-rendered SEO content once React loads
const prerenderContent = document.getElementById("prerender-content");
if (prerenderContent) {
  prerenderContent.style.display = "none";
}

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);
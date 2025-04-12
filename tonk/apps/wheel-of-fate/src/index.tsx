// index.tsx
import React from "react";
import "./index.css";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { configureSyncEngine, setDocIdPrefix, mapDocId } from "@tonk/keepsync";
import {
  registerServiceWorker,
  unregisterServiceWorker,
} from "./serviceWorkerRegistration";

// Service worker logic based on environment
if (process.env.NODE_ENV === "production") {
  registerServiceWorker();
} else {
  unregisterServiceWorker();
}

const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
const wsUrl = `${wsProtocol}//${window.location.host}/sync`;

configureSyncEngine({
  url: wsUrl,
  onSync: (docId) => console.log(`Document ${docId} synced`),
  onError: (error) => console.error("Sync error:", error),
});

const container = document.getElementById("root");
if (!container) throw new Error("Failed to find the root element");
const root = createRoot(container);

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// Rendu de l'application
root.render(app);

// Ajout du nettoyage lors d'un hot reload pour éviter les erreurs de removeChild
if (module.hot) {
  module.hot.dispose(() => {
    root.unmount();
  });
}

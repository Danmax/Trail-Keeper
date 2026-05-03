import React from "react";
import { createRoot } from "react-dom/client";
import TrailKeeper from "../trailkeeper.tsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TrailKeeper />
  </React.StrictMode>
);

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

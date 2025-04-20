import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "jotai";
import { store } from "./store.js";

import ReactUI from "./ReactUI.jsx";
import initGame from "./initGame.js";

import "./index.css";

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const ui = document.getElementById("ui");
  const game = document.getElementById("game");

  if (!ui || !game) {
    console.error("Required DOM elements not found");
    return;
  }

  // Set up UI scaling
  new ResizeObserver(() => {
    document.documentElement.style.setProperty(
      "--scale",
      Math.min(
        ui.parentElement.offsetWidth / ui.offsetWidth,
        ui.parentElement.offsetHeight / ui.offsetHeight
      )
    );
  }).observe(ui.parentElement);

  // Render React UI
  createRoot(ui).render(
    <StrictMode>
      <Provider store={store}>
        <ReactUI />
      </Provider>
    </StrictMode>
  );

  // Initialize game after UI is rendered
  requestAnimationFrame(() => {
    initGame();
  });
});

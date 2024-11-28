import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { LoginProvider } from "./pages/Login";
import { GameProvider } from "./pages/PopGame";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GameProvider>
    <LoginProvider>
      <App />
    </LoginProvider>
  </GameProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

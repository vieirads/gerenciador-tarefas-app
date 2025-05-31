import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Importa o CSS global, incluindo Tailwind
import App from "./App"; // Importa o componente principal App

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

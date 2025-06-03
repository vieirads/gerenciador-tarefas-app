import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Certifique-se de que este arquivo CSS existe ou remova esta linha se não for usar
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"; // Adicione esta linha

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// Para ativar o registro do service worker, mude register() para unregister() abaixo.
// Note que isso vem com algumas armadilhas.
// Saiba mais sobre service workers: https://cra.link/PWA
serviceWorkerRegistration.register(); // Certifique-se que é 'register()' e não 'unregister()'

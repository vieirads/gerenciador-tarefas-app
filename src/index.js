import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Certifique-se de que este arquivo CSS existe e está correto
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration"; // Adicione esta linha

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Se você quiser começar a medir o desempenho em seu aplicativo, passe uma função
// para registrar os resultados (por exemplo: reportWebVitals(console.log))
// ou envie para um endpoint de análise. Saiba mais: https://bit.ly/CRA-vitals
reportWebVitals();

// Para ativar o registro do service worker, mude register() para unregister() abaixo.
// Note que isso vem com algumas armadilhas.
// Saiba mais sobre service workers: https://cra.link/PWA
serviceWorkerRegistration.register(); // Certifique-se que é 'register()' e não 'unregister()'

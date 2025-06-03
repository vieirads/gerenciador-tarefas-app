// src/timerWorker.js
let timerInterval;

// O Web Worker recebe mensagens do thread principal
self.onmessage = function (e) {
  const { command, delay } = e.data; // 'command' pode ser 'start' ou 'stop'

  if (command === "start") {
    // Se já houver um intervalo, limpa-o para evitar múltiplos timers
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    // Inicia um novo intervalo que envia uma mensagem 'tick' a cada 'delay' ms
    timerInterval = setInterval(() => {
      self.postMessage("tick"); // Envia uma mensagem de volta ao thread principal
    }, delay);
  } else if (command === "stop") {
    // Limpa o intervalo quando o comando é 'stop'
    clearInterval(timerInterval);
    timerInterval = null;
  }
};

// public/timerWorker.js
let timerInterval;
let currentRemainingTime = 0;
let currentTimerType = "idle"; // 'task', 'interval'

// O worker escuta mensagens do thread principal
self.onmessage = function (e) {
  const { type, timeLeft, isInterval } = e.data;

  if (type === "start") {
    // Limpa qualquer intervalo existente para evitar duplicação
    clearInterval(timerInterval);
    currentRemainingTime = timeLeft;
    currentTimerType = isInterval ? "interval" : "task";

    // Inicia o intervalo do timer
    timerInterval = setInterval(() => {
      currentRemainingTime--;
      if (currentRemainingTime <= 0) {
        // Se o tempo acabar, limpa o intervalo e notifica o thread principal
        clearInterval(timerInterval);
        self.postMessage({ type: "ended", timerType: currentTimerType });
      } else {
        // A cada segundo, notifica o thread principal com o tempo restante
        self.postMessage({
          type: "tick",
          remainingTime: currentRemainingTime,
          timerType: currentTimerType,
        });
      }
    }, 1000); // Atualiza a cada segundo
  } else if (type === "pause") {
    // Pausa o timer limpando o intervalo
    clearInterval(timerInterval);
  } else if (type === "reset") {
    // Reseta o timer limpando o intervalo e redefinindo as variáveis
    clearInterval(timerInterval);
    currentRemainingTime = 0;
    currentTimerType = "idle";
  } else if (type === "skip") {
    // Simula o fim do timer para a função de pular fase
    clearInterval(timerInterval);
    self.postMessage({ type: "ended", timerType: currentTimerType });
  }
};

// Lida com o encerramento do worker
self.onclose = function () {
  clearInterval(timerInterval);
};

// src/timerWorker.js
let timerInterval = null; // Referência para o setInterval dentro do worker
let currentTask = null;
let timeLeft = 0;
let pomodoroState = "idle"; // 'idle', 'focus', 'shortBreak', 'longBreak'
let pomodoroCount = 0;
let isIntervalRunning = false;
let intervalTimeLeft = 0;
let totalGlobalElapsedTime = 0;
let skippedTime = 0;
let interTaskIntervalDuration = 5 * 60; // Default em segundos (5 minutos)

// Constantes de duração do Pomodoro (em segundos)
const DEFAULT_POMODORO_FOCUS_DURATION = 25 * 60;
const DEFAULT_POMODORO_SHORT_BREAK_DURATION = 5 * 60;
const DEFAULT_POMODORO_LONG_BREAK_DURATION = 15 * 60;

// Função para iniciar ou retomar o timer
function startTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  timerInterval = setInterval(() => {
    let timeDecremented = false;

    if (isIntervalRunning) {
      if (intervalTimeLeft > 0) {
        intervalTimeLeft--;
        timeDecremented = true;
      } else {
        clearInterval(timerInterval);
        isIntervalRunning = false;
        postMessage({ type: "intervalEnd" }); // Notifica que o intervalo terminou
        // Lógica para iniciar a próxima tarefa será no App.js
      }
    } else if (currentTask) {
      if (timeLeft > 0) {
        timeLeft--;
        timeDecremented = true;
      } else {
        clearInterval(timerInterval);
        // Lógica de transição de fase Pomodoro ou conclusão de tarefa de tempo
        if (currentTask.mode === "time") {
          postMessage({ type: "taskCompleted", taskId: currentTask.id });
          // Lógica para iniciar o intervalo entre tarefas ou parar tudo
          // será tratada no App.js após 'taskCompleted'
        } else if (currentTask.mode === "pomodoro") {
          let nextPomodoroState;
          let nextTime;
          let newPomodoroCount = pomodoroCount;

          const focusDuration =
            currentTask.pomodoroFocusDuration ||
            DEFAULT_POMODORO_FOCUS_DURATION;
          const shortBreakDuration =
            currentTask.pomodoroShortBreakDuration ||
            DEFAULT_POMODORO_SHORT_BREAK_DURATION;
          const longBreakDuration =
            currentTask.pomodoroLongBreakDuration ||
            DEFAULT_POMODORO_LONG_BREAK_DURATION;

          if (pomodoroState === "focus") {
            newPomodoroCount++;
            postMessage({ type: "phaseEnd", phase: "focus-ended" });
            if (newPomodoroCount % currentTask.pomodoroFocusSessions === 0) {
              nextPomodoroState = "longBreak";
              nextTime = longBreakDuration;
            } else {
              nextPomodoroState = "shortBreak";
              nextTime = shortBreakDuration;
            }
          } else if (pomodoroState === "shortBreak") {
            postMessage({ type: "phaseEnd", phase: "short-break-ended" });
            nextPomodoroState = "focus";
            nextTime = focusDuration;
          } else if (pomodoroState === "longBreak") {
            postMessage({
              type: "taskCompleted",
              taskId: currentTask.id,
              phase: "long-break-ended",
            });
            nextPomodoroState = "idle";
            nextTime = 0;
            currentTask = null; // Tarefa Pomodoro concluída
          }

          pomodoroCount = newPomodoroCount;
          pomodoroState = nextPomodoroState;
          timeLeft = nextTime;

          if (pomodoroState !== "idle") {
            startTimer(); // Reinicia o timer para a próxima fase
          } else {
            postMessage({ type: "timerStopped" }); // Notifica que o timer parou
          }
        }
      }
    }

    if (timeDecremented || currentTask === null) {
      // Apenas atualiza se o tempo diminuiu ou se o timer está parado mas precisa de um tick final
      totalGlobalElapsedTime++;
      postMessage({
        type: "tick",
        timeLeft: timeLeft,
        pomodoroState: pomodoroState,
        pomodoroCount: pomodoroCount,
        isIntervalRunning: isIntervalRunning,
        intervalTimeLeft: intervalTimeLeft,
        totalGlobalElapsedTime: totalGlobalElapsedTime,
        skippedTime: skippedTime,
        currentTaskId: currentTask ? currentTask.id : null,
      });
    }
  }, 1000);
}

// Função para pausar o timer
function pauseTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  postMessage({ type: "timerPaused" });
}

// Função para reiniciar a tarefa atual
function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timeLeft = 0;
  pomodoroState = "idle";
  pomodoroCount = 0;
  isIntervalRunning = false;
  intervalTimeLeft = 0;
  currentTask = null; // Reseta a tarefa atual no worker
  postMessage({ type: "timerReset" });
}

// Função para pular a fase atual
function skipCurrentPhase() {
  let timeToSkip = 0;
  if (isIntervalRunning) {
    timeToSkip = intervalTimeLeft;
    intervalTimeLeft = 0;
    isIntervalRunning = false;
    postMessage({ type: "phaseSkipped", phase: "inter-task-break" });
  } else if (currentTask) {
    timeToSkip = timeLeft;
    timeLeft = 0; // Zera o tempo para forçar a transição imediata
    if (currentTask.mode === "time") {
      postMessage({ type: "phaseSkipped", phase: "task" });
      postMessage({ type: "taskCompleted", taskId: currentTask.id }); // Marca como concluída
    } else if (currentTask.mode === "pomodoro") {
      let phaseName = pomodoroState; // Será traduzido no App.js
      postMessage({ type: "phaseSkipped", phase: phaseName });

      const focusDuration =
        currentTask.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
      const shortBreakDuration =
        currentTask.pomodoroShortBreakDuration ||
        DEFAULT_POMODORO_SHORT_BREAK_DURATION;
      const longBreakDuration =
        currentTask.pomodoroLongBreakDuration ||
        DEFAULT_POMODORO_LONG_BREAK_DURATION;

      if (pomodoroState === "focus") {
        pomodoroCount++;
        if (pomodoroCount % currentTask.pomodoroFocusSessions === 0) {
          pomodoroState = "longBreak";
          timeLeft = longBreakDuration;
        } else {
          pomodoroState = "shortBreak";
          timeLeft = shortBreakDuration;
        }
      } else if (pomodoroState === "shortBreak") {
        pomodoroState = "focus";
        timeLeft = focusDuration;
      } else if (pomodoroState === "longBreak") {
        postMessage({
          type: "taskCompleted",
          taskId: currentTask.id,
          phase: "long-break-ended",
        });
        pomodoroState = "idle";
        timeLeft = 0;
        currentTask = null; // Tarefa Pomodoro concluída
      }
    }
  }
  skippedTime += timeToSkip;
  clearInterval(timerInterval); // Para o timer para que a próxima fase inicie imediatamente
  startTimer(); // Inicia o timer para a próxima fase/estado
}

// Listener para mensagens do thread principal (App.js)
self.onmessage = function (e) {
  const { type, payload } = e.data;

  switch (type) {
    case "start":
      currentTask = payload.task;
      timeLeft = payload.timeLeft;
      pomodoroState = payload.pomodoroState;
      pomodoroCount = payload.pomodoroCount;
      isIntervalRunning = payload.isIntervalRunning;
      intervalTimeLeft = payload.intervalTimeLeft;
      totalGlobalElapsedTime = payload.totalGlobalElapsedTime;
      skippedTime = payload.skippedTime;
      interTaskIntervalDuration = payload.interTaskIntervalDuration;
      startTimer();
      break;
    case "pause":
      pauseTimer();
      break;
    case "reset":
      resetTimer();
      break;
    case "skip":
      skipCurrentPhase();
      break;
    case "updateSettings":
      // Atualiza apenas as configurações que podem ser alteradas em tempo real
      interTaskIntervalDuration = payload.interTaskIntervalDuration;
      // Note: As durações de Pomodoro personalizadas são passadas com a tarefa,
      // então não precisam ser atualizadas aqui globalmente a menos que a lógica mude.
      break;
    case "updateTask": // Usado para atualizar a tarefa atual, por exemplo, após um drag-and-drop
      if (currentTask && payload.task && currentTask.id === payload.task.id) {
        currentTask = payload.task;
      }
      break;
    case "syncState":
      // Quando o app ganha foco, ele pode pedir para sincronizar o estado atual do worker
      postMessage({
        type: "sync",
        timeLeft: timeLeft,
        pomodoroState: pomodoroState,
        pomodoroCount: pomodoroCount,
        isIntervalRunning: isIntervalRunning,
        intervalTimeLeft: intervalTimeLeft,
        totalGlobalElapsedTime: totalGlobalElapsedTime,
        skippedTime: skippedTime,
        currentTaskId: currentTask ? currentTask.id : null,
      });
      break;
    default:
      console.warn("Tipo de mensagem desconhecido para o worker:", type);
  }
};

// Envia um tick inicial para sincronizar o estado quando o worker é iniciado
// (útil para quando o app carrega e o worker já está rodando)
postMessage({
  type: "tick",
  timeLeft: timeLeft,
  pomodoroState: pomodoroState,
  pomodoroCount: pomodoroCount,
  isIntervalRunning: isIntervalRunning,
  intervalTimeLeft: intervalTimeLeft,
  totalGlobalElapsedTime: totalGlobalElapsedTime,
  skippedTime: skippedTime,
  currentTaskId: currentTask ? currentTask.id : null,
});

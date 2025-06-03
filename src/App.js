import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone"; // Import Tone.js

// Conteúdo do timerWorker.js como uma string para criar uma URL Blob
const timerWorkerCode = `
  let timerInterval = null;
  let currentTask = null;
  let timeLeft = 0;
  let pomodoroState = 'idle';
  let pomodoroCount = 0;
  let isIntervalRunning = false;
  let intervalTimeLeft = 0;
  let totalGlobalElapsedTime = 0;
  let skippedTime = 0;
  let interTaskIntervalDuration = 5 * 60;
  let taskStartTime = null; // Novo: Hora de início da tarefa no worker

  const DEFAULT_POMODORO_FOCUS_DURATION = 25 * 60;
  const DEFAULT_POMODORO_SHORT_BREAK_DURATION = 5 * 60;
  const DEFAULT_POMODORO_LONG_BREAK_DURATION = 15 * 60;

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
          postMessage({ type: 'intervalEnd' });
        }
      } else if (currentTask) {
        if (timeLeft > 0) {
          timeLeft--;
          timeDecremented = true;
        } else {
          clearInterval(timerInterval);
          if (currentTask.mode === 'time') {
            postMessage({ type: 'taskCompleted', taskId: currentTask.id });
            taskStartTime = null; // Tarefa concluída, limpa a hora de início
          } else if (currentTask.mode === 'pomodoro') {
            let nextPomodoroState;
            let nextTime;
            let newPomodoroCount = pomodoroCount;

            const focusDuration = currentTask.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
            const shortBreakDuration = currentTask.pomodoroShortBreakDuration || DEFAULT_POMODORO_SHORT_BREAK_DURATION;
            const longBreakDuration = currentTask.pomodoroLongBreakDuration || DEFAULT_POMODORO_LONG_BREAK_DURATION;

            if (pomodoroState === 'focus') {
              newPomodoroCount++;
              postMessage({ type: 'phaseEnd', phase: 'focus-ended' });
              if (newPomodoroCount % currentTask.pomodoroFocusSessions === 0) {
                nextPomodoroState = 'longBreak';
                nextTime = longBreakDuration;
              } else {
                nextPomodoroState = 'shortBreak';
                nextTime = shortBreakDuration;
              }
            } else if (pomodoroState === 'shortBreak') {
              postMessage({ type: 'phaseEnd', phase: 'short-break-ended' });
              nextPomodoroState = 'focus';
              nextTime = focusDuration;
            } else if (pomodoroState === 'longBreak') {
              postMessage({ type: 'taskCompleted', taskId: currentTask.id, phase: 'long-break-ended' });
              nextPomodoroState = 'idle';
              nextTime = 0;
              currentTask = null;
              taskStartTime = null; // Tarefa concluída, limpa a hora de início
            }

            pomodoroCount = newPomodoroCount;
            pomodoroState = nextPomodoroState;
            timeLeft = nextTime;

            if (pomodoroState !== 'idle') {
              startTimer();
            } else {
              postMessage({ type: 'timerStopped' });
            }
          }
        }
      }

      if (timeDecremented || currentTask === null) {
        totalGlobalElapsedTime++;
        postMessage({
          type: 'tick',
          timeLeft: timeLeft,
          pomodoroState: pomodoroState,
          pomodoroCount: pomodoroCount,
          isIntervalRunning: isIntervalRunning,
          intervalTimeLeft: intervalTimeLeft,
          totalGlobalElapsedTime: totalGlobalElapsedTime,
          skippedTime: skippedTime,
          currentTaskId: currentTask ? currentTask.id : null,
          taskStartTime: taskStartTime, // Envia a hora de início
        });
      }
    }, 1000);
  }

  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    postMessage({ type: 'timerPaused' });
  }

  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    timeLeft = 0;
    pomodoroState = 'idle';
    pomodoroCount = 0;
    isIntervalRunning = false;
    intervalTimeLeft = 0;
    currentTask = null;
    taskStartTime = null; // Limpa a hora de início
    postMessage({ type: 'timerReset' });
  }

  function skipCurrentPhase() {
    let timeToSkip = 0;
    if (isIntervalRunning) {
      timeToSkip = intervalTimeLeft;
      intervalTimeLeft = 0;
      isIntervalRunning = false;
      postMessage({ type: 'phaseSkipped', phase: 'inter-task-break' });
      // Se pular o intervalo e não houver próxima tarefa, taskStartTime será nullizado pelo tick ou timerStopped
    } else if (currentTask) {
      timeToSkip = timeLeft;
      timeLeft = 0;
      if (currentTask.mode === 'time') {
        postMessage({ type: 'phaseSkipped', phase: 'task' });
        postMessage({ type: 'taskCompleted', taskId: currentTask.id });
        taskStartTime = null; // Tarefa concluída, limpa a hora de início
      } else if (currentTask.mode === 'pomodoro') {
        let phaseName = pomodoroState;
        postMessage({ type: 'phaseSkipped', phase: phaseName });

        const focusDuration = currentTask.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
        const shortBreakDuration = currentTask.pomodoroShortBreakDuration || DEFAULT_POMODORO_SHORT_BREAK_DURATION;
        const longBreakDuration = currentTask.pomodoroLongBreakDuration || DEFAULT_POMODORO_LONG_BREAK_DURATION;

        if (pomodoroState === 'focus') {
          pomodoroCount++;
          if (pomodoroCount % currentTask.pomodoroFocusSessions === 0) {
            pomodoroState = 'longBreak';
            timeLeft = longBreakDuration;
          } else {
            pomodoroState = 'shortBreak';
            timeLeft = shortBreakDuration;
          }
        } else if (pomodoroState === 'shortBreak') {
          pomodoroState = 'focus';
          timeLeft = focusDuration;
        } else if (pomodoroState === 'longBreak') {
          postMessage({ type: 'taskCompleted', taskId: currentTask.id, phase: 'long-break-ended' });
          pomodoroState = 'idle';
          timeLeft = 0;
          currentTask = null;
          taskStartTime = null; // Tarefa concluída, limpa a hora de início
        }
      }
    }
    skippedTime += timeToSkip;
    clearInterval(timerInterval);
    startTimer();
  }

  self.onmessage = function(e) {
    const { type, payload } = e.data;

    switch (type) {
      case 'start':
        currentTask = payload.task;
        timeLeft = payload.timeLeft;
        pomodoroState = payload.pomodoroState;
        pomodoroCount = payload.pomodoroCount;
        isIntervalRunning = payload.isIntervalRunning;
        intervalTimeLeft = payload.intervalTimeLeft;
        totalGlobalElapsedTime = payload.totalGlobalElapsedTime;
        skippedTime = payload.skippedTime;
        interTaskIntervalDuration = payload.interTaskIntervalDuration;
        taskStartTime = payload.taskStartTime; // Recebe a hora de início
        startTimer();
        break;
      case 'pause':
        pauseTimer();
        break;
      case 'reset':
        resetTimer();
        break;
      case 'skip':
        skipCurrentPhase();
        break;
      case 'updateSettings':
        interTaskIntervalDuration = payload.interTaskIntervalDuration;
        break;
      case 'updateTask':
        if (currentTask && payload.task && currentTask.id === payload.task.id) {
          currentTask = payload.task;
        }
        break;
      case 'syncState':
        postMessage({
          type: 'sync',
          timeLeft: timeLeft,
          pomodoroState: pomodoroState,
          pomodoroCount: pomodoroCount,
          isIntervalRunning: isIntervalRunning,
          intervalTimeLeft: intervalTimeLeft,
          totalGlobalElapsedTime: totalGlobalElapsedTime,
          skippedTime: skippedTime,
          currentTaskId: currentTask ? currentTask.id : null,
          taskStartTime: taskStartTime, // Envia a hora de início
        });
        break;
      default:
        console.warn('Tipo de mensagem desconhecido para o worker:', type);
    }
  };

  postMessage({
    type: 'tick',
    timeLeft: timeLeft,
    pomodoroState: pomodoroState,
    pomodoroCount: pomodoroCount,
    isIntervalRunning: isIntervalRunning,
    intervalTimeLeft: intervalTimeLeft,
    totalGlobalElapsedTime: totalGlobalElapsedTime,
    skippedTime: skippedTime,
    currentTaskId: currentTask ? currentTask.id : null,
    taskStartTime: taskStartTime, // Envia a hora de início
  });
`;

// Cria uma URL Blob a partir do código do worker
const timerWorkerBlob = new Blob([timerWorkerCode], {
  type: "application/javascript",
});
const timerWorker = new Worker(URL.createObjectURL(timerWorkerBlob));

// Translations object for i18n
const translations = {
  en: {
    taskManager: "Task Manager",
    switchLightMode: "Switch to Light Mode",
    switchDarkMode: "Switch to Dark Mode",
    taskName: "Task Name",
    timeMode: "Time Mode",
    freeTime: "Free Time",
    pomodoro: "Pomodoro",
    addTask: "Add new task",
    durationMinutes: "Duration (minutes)",
    pomodoroSettings: "Pomodoro Settings",
    focusSessions: "Focus Sessions",
    focusDurationMin: "Focus Duration (min)",
    shortBreakMin: "Short Break (min)",
    longBreakMin: "Long Break (min)",
    interTaskInterval: "Inter-Task Interval",
    noTaskSelected: "No Task Selected",
    elapsed: "Elapsed",
    remaining: "Remaining",
    estimated: "Estimated",
    skipped: "Skipped",
    pauseTimer: "Pause Timer",
    startTimer: "Start Timer",
    restartTask: "Restart Task",
    skipCurrentPhase: "Skip Current Phase",
    resetAll: "Reset All",
    tasks: "Tasks",
    noTasksAdded: "No tasks added yet.",
    taskCompleted: "Task completed!",
    focusSessionEnded: "Focus session ended!",
    shortBreakEnded: "Short break ended!",
    longBreakEnded: "Long break ended!",
    interTaskBreakEnded: "Inter-task break ended!",
    taskSkipped: "Task skipped!",
    interTaskBreakSkipped: "Inter-task break skipped!",
    pomodoroPhaseSkipped: "Pomodoro {phase} skipped!",
    taskReset: "Task reset!",
    allTasksReset: "All tasks reset!",
    timerResumed: "Timer resumed!",
    timerStarted: "Timer started!",
    timerPaused: "Timer paused!",
    taskAdded: "Task added!",
    options: "Options",
    language: "Language",
    interTaskIntervalSetting: "Inter-Task Interval (minutes)",
    saveSettings: "Save Settings",
    readyToStart: "Ready to start",
    estimatedCompletionTime: "Estimated completion: {time}",
    focus: "focus", // Added for translation in skip message
    shortBreak: "short break", // Added for translation in skip message
    longBreak: "long break", // Added for translation in skip message
    allTasksCompletedNotification: "All tasks completed! Great job!", // New notification message
    enableSoundNotifications: "Enable Sound Notifications", // New translation
    taskStartTime: "Start Time", // New translation
  },
  "pt-BR": {
    taskManager: "Gerenciador de Tarefas",
    switchLightMode: "Mudar para Modo Claro",
    switchDarkMode: "Mudar para Modo Escuro",
    taskName: "Nome da Tarefa",
    timeMode: "Modo de Tempo",
    freeTime: "Tempo Livre",
    pomodoro: "Pomodoro",
    addTask: "Adicionar nova tarefa",
    durationMinutes: "Duração (minutos)",
    pomodoroSettings: "Configurações do Pomodoro",
    focusSessions: "Sessões de Foco",
    focusDurationMin: "Duração do Foco (min)",
    shortBreakMin: "Pausa Curta (min)",
    longBreakMin: "Pausa Longa (min)",
    interTaskInterval: "Intervalo Entre Tarefas",
    noTaskSelected: "Nenhuma Tarefa Selecionada",
    elapsed: "Decorridos",
    remaining: "Restantes",
    estimated: "Estimado",
    skipped: "Pulado",
    pauseTimer: "Pausar Cronômetro",
    startTimer: "Iniciar Cronômetro",
    restartTask: "Reiniciar Tarefa",
    skipCurrentPhase: "Pular Fase Atual",
    resetAll: "Redefinir Tudo",
    tasks: "Tarefas",
    noTasksAdded: "Nenhuma tarefa adicionada ainda.",
    taskCompleted: "Tarefa concluída!",
    focusSessionEnded: "Sessão de foco encerrada!",
    shortBreakEnded: "Pausa curta encerrada!",
    longBreakEnded: "Pausa longa encerrada!",
    interTaskBreakEnded: "Intervalo entre tarefas encerrado!",
    taskSkipped: "Tarefa pulada!",
    interTaskBreakSkipped: "Intervalo entre tarefas pulado!",
    pomodoroPhaseSkipped: "Fase de Pomodoro {phase} pulada!",
    taskReset: "Tarefa redefinida!",
    allTasksReset: "Todas as tarefas redefinidas!",
    timerResumed: "Cronômetro retomado!",
    timerStarted: "Cronômetro iniciado!",
    timerPaused: "Cronômetro pausado!",
    taskAdded: "Tarefa adicionada!",
    options: "Opções",
    language: "Idioma",
    interTaskIntervalSetting: "Intervalo Entre Tarefas (minutos)",
    saveSettings: "Salvar Configurações",
    readyToStart: "Pronto para iniciar",
    estimatedCompletionTime: "Conclusão estimada: {time}",
    focus: "foco", // Added for translation in skip message
    shortBreak: "pausa curta", // Added for translation in skip message
    longBreak: "pausa longa", // Added for translation in skip message
    allTasksCompletedNotification:
      "Todas as tarefas foram concluídas! Ótimo trabalho!", // New notification message
    enableSoundNotifications: "Habilitar Sons de Notificação", // New translation
    taskStartTime: "Hora de Início", // New translation
  },
  fr: {
    taskManager: "Gestionnaire de Tâches",
    switchLightMode: "Passer en mode clair",
    switchDarkMode: "Passer en mode sombre",
    taskName: "Nom de la tâche",
    timeMode: "Mode Temps",
    freeTime: "Temps Libre",
    pomodoro: "Pomodoro",
    addTask: "Ajouter une nouvelle tâche",
    durationMinutes: "Durée (minutes)",
    pomodoroSettings: "Paramètres Pomodoro",
    focusSessions: "Sessions de Focus",
    focusDurationMin: "Durée du Focus (min)",
    shortBreakMin: "Courte Pause (min)",
    longBreakMin: "Longue Pause (min)",
    interTaskInterval: "Intervalle entre les tâches",
    noTaskSelected: "Aucune tâche sélectionnée",
    elapsed: "Écoulé",
    remaining: "Restant",
    estimated: "Estimé",
    skipped: "Sauté",
    pauseTimer: "Mettre en pause le minuteur",
    startTimer: "Démarrer le minuteur",
    restartTask: "Redémarrer la tâche",
    skipCurrentPhase: "Sauter la phase actuelle",
    resetAll: "Tout réinitialiser",
    tasks: "Tâches",
    noTasksAdded: "Aucune tâche ajoutée pour le moment.",
    taskCompleted: "Tâche terminée !",
    focusSessionEnded: "Session de focus terminée !",
    shortBreakEnded: "Courte pause terminée !",
    longBreakEnded: "Longue pause terminée !",
    interTaskBreakEnded: "Intervalle entre les tâches terminé !",
    taskSkipped: "Tâche sautée !",
    interTaskBreakSkipped: "Intervalle entre les tâches sauté !",
    pomodoroPhaseSkipped: "Fase Pomodoro {phase} sautée !",
    taskReset: "Tâche réinitialisée !",
    allTasksReset: "Toutes les tâches réinitialisées !",
    timerResumed: "Minuteur repris !",
    timerStarted: "Minuteur démarré !",
    timerPaused: "Minuteur en pause !",
    taskAdded: "Tâche ajoutée !",
    options: "Options",
    language: "Langue",
    interTaskIntervalSetting: "Intervalle entre les tâches (minutes)",
    saveSettings: "Enregistrer les paramètres",
    readyToStart: "Prêt à commencer",
    estimatedCompletionTime: "Achèvement estimé : {time}",
    focus: "focus", // Added for translation in skip message
    shortBreak: "courte pause", // Added for translation in skip message
    longBreak: "longue pause", // Added for translation in skip message
    allTasksCompletedNotification:
      "Toutes les tâches sont terminées ! Bon trabalho !", // New notification message
    enableSoundNotifications: "Activer les sons de notification", // New translation
    taskStartTime: "Heure de début", // New translation
  },
};

// Notification Component
const Notification = ({ message, type, onClose, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    let slideOutTimer;
    let closeTimer;

    if (message) {
      setIsVisible(true);
      setAnimationClass("animate-slide-in");

      slideOutTimer = setTimeout(() => {
        setAnimationClass("animate-slide-out");
        closeTimer = setTimeout(() => onClose(), 500);
      }, 3000);
    }

    // Cleanup function for the useEffect
    return () => {
      clearTimeout(slideOutTimer);
      clearTimeout(closeTimer);
    };
  }, [message, onClose]);

  if (!isVisible || !message) return null;

  let borderColor = "";
  let textColor = "text-white"; // Always white text
  let bgColor = "";

  // Determine colors based on type
  switch (type) {
    case "skipped":
      borderColor = "border-yellow-500";
      bgColor = "bg-yellow-500";
      break;
    case "started":
      borderColor = "border-green-500";
      bgColor = "bg-green-500";
      break;
    case "reset":
      borderColor = "border-gray-500"; // Using a middle gray for consistency
      bgColor = "bg-gray-500";
      break;
    case "completed":
      borderColor = "border-green-600";
      bgColor = "bg-green-600";
      break;
    case "focus-ended":
      borderColor = "border-red-500";
      bgColor = "bg-red-500";
      break;
    case "short-break-ended":
      borderColor = "border-green-500"; // Similar to started/completed
      bgColor = "bg-green-500";
      break;
    case "long-break-ended":
      borderColor = "border-blue-500";
      bgColor = "bg-blue-500";
      break;
    case "paused":
      borderColor = "border-red-500";
      bgColor = "bg-red-500";
      break;
    case "added":
      borderColor = "border-indigo-600";
      bgColor = "bg-indigo-600";
      break;
    case "all-tasks-completed": // New type for all tasks completed
      borderColor = "border-purple-500";
      bgColor = "bg-purple-500";
      break;
    default:
      borderColor = "border-blue-500";
      bgColor = "bg-blue-500";
  }

  return (
    <>
      <style>
        {`
        @keyframes slideIn {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes slideOut {
          from {
            transform: translateY(0);
            opacity: 1;
          }
          to {
            transform: translateY(-100%);
            opacity: 0;
          }
        }

        .animate-slide-in {
          animation: slideIn 0.5s ease-out forwards;
        }

        .animate-slide-out {
          animation: slideOut 0.5s ease-in forwards;
        }
        `}
      </style>
      <div
        className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg z-50 border-2 ${borderColor} ${bgColor} ${textColor} ${animationClass}`}
      >
        {message}
      </div>
    </>
  );
};

// Main application component
function App() {
  // States to manage tasks, timer, and Pomodoro mode
  const [tasks, setTasks] = useState([]); // List of tasks
  const [currentTaskId, setCurrentTaskId] = useState(null); // ID of the current running task
  const [timerRunning, setTimerRunning] = useState(false); // Indicates if the timer is active
  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
  const [pomodoroState, setPomodoroState] = useState("idle"); // 'idle', 'focus', 'shortBreak', 'longBreak'
  const [pomodoroCount, setPomodoroCount] = useState(0); // Counter for completed Pomodoro cycles (completed focus sessions)
  const [isIntervalRunning, setIsIntervalRunning] = useState(false); // Indicates if the 5-minute interval is active (changed to boolean)
  const [intervalTimeLeft, setIntervalTimeLeft] = useState(0); // Time left for the 5-minute interval
  const [taskName, setTaskName] = useState(""); // Name of the new task
  const [taskMode, setTaskMode] = useState("time"); // Mode of the new task: 'time' or 'pomodoro'
  const [taskDuration, setTaskDuration] = useState(30); // Duration of the new task (for 'time' mode), default 30 minutes
  const [pomodoroCustomFocusSessions, setPomodoroCustomFocusSessions] =
    useState(4); // Customizable number of focus sessions for Pomodoro

  // New states for customizable Pomodoro times
  const [customFocusDurationInput, setCustomFocusDurationInput] = useState(25); // Focus duration in minutes (for input)
  const [customShortBreakDurationInput, setCustomShortBreakDurationInput] =
    useState(5); // Short break duration in minutes (for input)
  const [customLongBreakDurationInput, setCustomLongBreakDurationInput] =
    useState(15); // Long break duration in minutes (for input)

  const progressCircleRef = useRef(null); // Reference for the SVG progress circle

  // New state for total global elapsed time
  const [totalGlobalElapsedTime, setTotalGlobalElapsedTime] = useState(0);
  // New state for total skipped time
  const [skippedTime, setSkippedTime] = useState(0);
  // Novo estado para a hora de início da tarefa
  const [taskStartTime, setTaskStartTime] = useState(null);

  // Dark mode state
  const [darkMode, setDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or default to false
    const savedMode = localStorage.getItem("darkMode");
    return savedMode === "true" ? true : false;
  });

  // Notification state
  const [notification, setNotification] = useState({ message: "", type: "" });

  // Options modal state
  const [showOptions, setShowOptions] = useState(false);

  // Language state, initialized from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    const savedLang = localStorage.getItem("language");
    return savedLang || "en";
  });

  // Inter-task interval state, initialized from localStorage or default
  const [interTaskIntervalDuration, setInterTaskIntervalDuration] = useState(
    () => {
      const savedInterval = localStorage.getItem("interTaskInterval");
      return savedInterval ? parseInt(savedInterval, 10) : 5; // Default 5 minutes
    }
  );

  // Sound enabled state, initialized from localStorage or default to false
  const [soundEnabled, setSoundEnabled] = useState(() => {
    const savedSound = localStorage.getItem("soundEnabled");
    return savedSound === "true" ? true : false;
  });

  // Refs for Tone.js synths
  const focusSynthRef = useRef(null);
  const breakSynthRef = useRef(null);
  const longBreakSynthRef = useRef(null);
  const completeSynthRef = useRef(null);
  const skippedSynthRef = useRef(null);
  const pausedSynthRef = useRef(null);
  const startedSynthRef = useRef(null);
  const addedSynthRef = useRef(null);
  const resetSynthRef = useRef(null);

  // Initialize Tone.js synths on component mount
  useEffect(() => {
    Tone.start(); // Start Tone.js audio context

    focusSynthRef.current = new Tone.Synth().toDestination();
    breakSynthRef.current = new Tone.Synth().toDestination();
    longBreakSynthRef.current = new Tone.Synth().toDestination();
    completeSynthRef.current = new Tone.PolySynth(Tone.Synth).toDestination(); // PolySynth for chords
    skippedSynthRef.current = new Tone.Synth().toDestination();
    pausedSynthRef.current = new Tone.Synth().toDestination();
    startedSynthRef.current = new Tone.Synth().toDestination();
    addedSynthRef.current = new Tone.Synth().toDestination();
    resetSynthRef.current = new Tone.Synth().toDestination();

    return () => {
      // Dispose synths on component unmount
      focusSynthRef.current?.dispose();
      breakSynthRef.current?.dispose();
      longBreakSynthRef.current?.dispose();
      completeSynthRef.current?.dispose();
      skippedSynthRef.current?.dispose();
      pausedSynthRef.current?.dispose();
      startedSynthRef.current?.dispose();
      addedSynthRef.current?.dispose();
      resetSynthRef.current?.dispose();
    };
  }, []);

  // Function to play sounds based on notification type
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled) return;

      switch (type) {
        case "focus-ended":
          focusSynthRef.current.triggerAttackRelease("C4", "8n"); // Middle C, eighth note
          break;
        case "short-break-ended":
          breakSynthRef.current.triggerAttackRelease("E4", "8n"); // E above middle C
          break;
        case "long-break-ended":
          longBreakSynthRef.current.triggerAttackRelease("G4", "4n"); // G above middle C, quarter note
          break;
        case "completed":
        case "all-tasks-completed":
          completeSynthRef.current.triggerAttackRelease(
            ["C5", "E5", "G5"],
            "4n"
          ); // C major chord
          break;
        case "skipped":
          skippedSynthRef.current.triggerAttackRelease("C3", "16n"); // Low C, sixteenth note
          break;
        case "paused":
          pausedSynthRef.current.triggerAttackRelease("A3", "8n"); // A below middle C
          break;
        case "started":
        case "resumed":
          startedSynthRef.current.triggerAttackRelease("C4", "16n"); // Middle C, sixteenth note
          break;
        case "added":
          addedSynthRef.current.triggerAttackRelease("D4", "16n"); // D above middle C
          break;
        case "reset":
          resetSynthRef.current.triggerAttackRelease("C2", "8n"); // Very low C
          break;
        default:
          // No sound for other types
          break;
      }
    },
    [soundEnabled]
  );

  // Function to show notifications
  const showNotification = useCallback(
    (message, type) => {
      setNotification({ message, type });
      playSound(type); // Play sound when notification is shown
    },
    [playSound]
  );

  // Function to clear notification
  const clearNotification = useCallback(() => {
    setNotification({ message: "", type: "" });
  }, []);

  // Effect to save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Effect to save language preference to localStorage
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Effect to save inter-task interval preference to localStorage
  useEffect(() => {
    localStorage.setItem(
      "interTaskInterval",
      interTaskIntervalDuration.toString()
    );
    // Envia a nova duração do intervalo para o worker
    timerWorker.postMessage({
      type: "updateSettings",
      payload: { interTaskIntervalDuration: interTaskIntervalDuration * 60 }, // Converter para segundos
    });
  }, [interTaskIntervalDuration]);

  // Effect to save sound enabled preference to localStorage
  useEffect(() => {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  }, [soundEnabled]);

  // Durations for Pomodoro cycles in seconds (default values)
  const DEFAULT_POMODORO_FOCUS_DURATION = 25 * 60; // 25 minutes focus
  const DEFAULT_POMODORO_SHORT_BREAK_DURATION = 5 * 60; // 5 minutes short break
  const DEFAULT_POMODORO_LONG_BREAK_DURATION = 15 * 60; // 15 minutes long break
  // INTER_TASK_INTERVAL_DURATION is now a state: interTaskIntervalDuration * 60

  // Função para formatar total time em HH:MM
  const formatTotalTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
    }
    return `${minutes}min`;
  };

  // Função para adicionar uma nova tarefa
  const addTask = (e) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    const newTask = {
      id: Date.now(),
      name: taskName,
      mode: taskMode,
      duration: taskMode === "time" ? parseInt(taskDuration, 10) * 60 : 0, // Convert minutes to seconds
      pomodoroFocusSessions:
        taskMode === "pomodoro" ? parseInt(pomodoroCustomFocusSessions, 10) : 0, // Save customizable number of focus sessions
      // Save customizable Pomodoro durations in seconds
      pomodoroFocusDuration:
        taskMode === "pomodoro"
          ? parseInt(customFocusDurationInput, 10) * 60
          : 0,
      pomodoroShortBreakDuration:
        taskMode === "pomodoro"
          ? parseInt(customShortBreakDurationInput, 10) * 60
          : 0,
      pomodoroLongBreakDuration:
        taskMode === "pomodoro"
          ? parseInt(customLongBreakDurationInput, 10) * 60
          : 0,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskDuration(30); // Reset to default 30 minutes after adding
    showNotification(translations[language].taskAdded, "added");
  };

  // Função para deletar uma tarefa
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (currentTaskId === id) {
      resetTimer();
      setCurrentTaskId(null);
    }
  };

  // Função para marcar uma tarefa como completa
  const markTaskComplete = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  }, []);

  // Função para pausar o timer
  const pauseTimer = useCallback(() => {
    timerWorker.postMessage({ type: "pause" });
    setTimerRunning(false);
    showNotification(translations[language].timerPaused, "paused");
    setTaskStartTime(null); // Limpa a hora de início ao pausar
  }, [showNotification, language]);

  // Função para resetar o timer da tarefa atual (não reseta tempos globais)
  const resetTimer = useCallback(() => {
    timerWorker.postMessage({ type: "reset" });
    setTimerRunning(false);
    setTimeLeft(0);
    setPomodoroState("idle");
    setPomodoroCount(0);
    setIsIntervalRunning(false);
    setIntervalTimeLeft(0);
    setCurrentTaskId(null); // Garante que nenhuma tarefa esteja selecionada
    setTaskStartTime(null); // Limpa a hora de início ao resetar
    showNotification(translations[language].taskReset, "reset");
  }, [showNotification, language]);

  // Função para resetar todos os tempos (globais e da tarefa atual)
  const resetAll = useCallback(() => {
    timerWorker.postMessage({ type: "reset" }); // Reseta o worker
    setTimerRunning(false);
    setTimeLeft(0);
    setPomodoroState("idle");
    setPomodoroCount(0);
    setIsIntervalRunning(false);
    setIntervalTimeLeft(0);
    setCurrentTaskId(null);
    setTotalGlobalElapsedTime(0); // Reseta tempo global decorrido
    setSkippedTime(0); // Reseta tempo pulado
    setTaskStartTime(null); // Limpa a hora de início ao resetar tudo
    // Reseta status de conclusão de todas as tarefas
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: false }))
    );
    showNotification(translations[language].allTasksReset, "reset");
  }, [showNotification, language]);

  // Função para iniciar uma tarefa específica
  const startTask = useCallback(
    (task) => {
      // Reseta o estado local do App.js antes de iniciar uma nova tarefa
      setTimerRunning(false);
      setIsIntervalRunning(false);
      setTimeLeft(0);
      setPomodoroState("idle");
      setPomodoroCount(0);

      const now = Date.now(); // Captura a hora de início
      setTaskStartTime(now); // Define a hora de início no App.js

      setCurrentTaskId(task.id);
      let initialTime;
      let initialPomodoroState = "idle";

      if (task.mode === "time") {
        initialTime = task.duration;
      } else if (task.mode === "pomodoro") {
        initialTime =
          task.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
        initialPomodoroState = "focus";
      }

      setTimerRunning(true);
      setTimeLeft(initialTime);
      setPomodoroState(initialPomodoroState);
      setPomodoroCount(0);

      // Envia a mensagem para o worker iniciar
      timerWorker.postMessage({
        type: "start",
        payload: {
          task: task,
          timeLeft: initialTime,
          pomodoroState: initialPomodoroState,
          pomodoroCount: 0,
          isIntervalRunning: false,
          intervalTimeLeft: 0,
          totalGlobalElapsedTime: totalGlobalElapsedTime, // Passa o estado atual para o worker
          skippedTime: skippedTime, // Passa o estado atual para o worker
          interTaskIntervalDuration: interTaskIntervalDuration * 60, // Passa a duração do intervalo em segundos
          taskStartTime: now, // Passa a hora de início para o worker
        },
      });
      showNotification(translations[language].timerStarted, "started");
    },
    [
      showNotification,
      language,
      totalGlobalElapsedTime,
      skippedTime,
      interTaskIntervalDuration,
      DEFAULT_POMODORO_FOCUS_DURATION,
    ]
  );

  // Função para pular a fase atual
  const skipCurrentPhase = useCallback(() => {
    timerWorker.postMessage({ type: "skip" });
    setTimerRunning(false); // Assume que a fase será pulada e o timer pode estar parado momentaneamente
    showNotification(
      translations[language].pomodoroPhaseSkipped.replace(
        "{phase}",
        "current phase"
      ),
      "skipped"
    ); // Mensagem genérica, será atualizada pelo worker
  }, [showNotification, language]);

  // Efeito para lidar com mensagens do Web Worker
  useEffect(() => {
    const handleWorkerMessage = (e) => {
      const {
        type,
        timeLeft: workerTimeLeft,
        pomodoroState: workerPomodoroState,
        pomodoroCount: workerPomodoroCount,
        isIntervalRunning: workerIsIntervalRunning,
        intervalTimeLeft: workerIntervalTimeLeft,
        totalGlobalElapsedTime: workerTotalGlobalElapsedTime,
        skippedTime: workerSkippedTime,
        taskId: workerTaskId,
        phase: workerPhase,
        taskStartTime: workerTaskStartTime,
      } = e.data; // Recebe a hora de início do worker

      switch (type) {
        case "tick":
          setTimeLeft(workerTimeLeft);
          setPomodoroState(workerPomodoroState);
          setPomodoroCount(workerPomodoroCount);
          setIsIntervalRunning(workerIsIntervalRunning);
          setIntervalTimeLeft(workerIntervalTimeLeft);
          setTotalGlobalElapsedTime(workerTotalGlobalElapsedTime);
          setSkippedTime(workerSkippedTime);
          setTaskStartTime(workerTaskStartTime); // Atualiza a hora de início
          setTimerRunning(true); // O worker está enviando ticks, então o timer está rodando
          // Se o workerTaskId for nulo, significa que não há tarefa ativa no worker
          if (workerTaskId === null && currentTaskId !== null) {
            setCurrentTaskId(null); // Sincroniza o estado local
            setTimerRunning(false);
            setTaskStartTime(null); // Limpa a hora de início se a tarefa for nula
          } else if (workerTaskId !== null && currentTaskId === null) {
            // Se o worker tem uma tarefa mas o App.js não, encontre-a e defina
            const taskFromWorker = tasks.find((t) => t.id === workerTaskId);
            if (taskFromWorker) {
              setCurrentTaskId(taskFromWorker.id);
            }
          }
          break;
        case "phaseEnd":
          // O worker indica que uma fase Pomodoro terminou
          if (workerPhase === "focus-ended") {
            showNotification(
              translations[language].focusSessionEnded,
              "focus-ended"
            );
          } else if (workerPhase === "short-break-ended") {
            showNotification(
              translations[language].shortBreakEnded,
              "short-break-ended"
            );
          }
          // O worker já iniciou a próxima fase, então o 'tick' subsequente atualizará o estado
          break;
        case "intervalEnd":
          showNotification(
            translations[language].interTaskBreakEnded,
            "completed"
          );
          // Após o intervalo, o worker vai tentar iniciar a próxima tarefa ou parar
          // O 'tick' subsequente ou 'timerStopped' vai sincronizar o estado
          break;
        case "taskCompleted":
          markTaskComplete(workerTaskId);
          if (workerPhase === "long-break-ended") {
            showNotification(
              translations[language].longBreakEnded,
              "long-break-ended"
            );
          } else {
            showNotification(translations[language].taskCompleted, "completed");
          }
          setTaskStartTime(null); // Limpa a hora de início quando a tarefa é concluída
          // O worker já lidou com a transição para o próximo intervalo/tarefa ou parada
          // O 'tick' subsequente ou 'timerStopped' vai sincronizar o estado
          break;
        case "phaseSkipped":
          let phaseName = "";
          switch (workerPhase) {
            case "inter-task-break":
              phaseName = translations[language].interTaskBreakSkipped;
              break;
            case "task":
              phaseName = translations[language].taskSkipped;
              setTaskStartTime(null); // Limpa a hora de início se a tarefa for pulada
              break;
            case "focus":
              phaseName = translations[language].pomodoroPhaseSkipped.replace(
                "{phase}",
                translations[language].focus
              );
              break;
            case "shortBreak":
              phaseName = translations[language].pomodoroPhaseSkipped.replace(
                "{phase}",
                translations[language].shortBreak
              );
              break;
            case "longBreak":
              phaseName = translations[language].pomodoroPhaseSkipped.replace(
                "{phase}",
                translations[language].longBreak
              );
              setTaskStartTime(null); // Limpa a hora de início se a pausa longa for pulada
              break;
            default:
              phaseName = translations[language].pomodoroPhaseSkipped.replace(
                "{phase}",
                "unknown phase"
              );
              break;
          }
          showNotification(phaseName, "skipped");
          setTimerRunning(true); // O worker já iniciou a próxima fase, então o timer está rodando
          break;
        case "timerPaused":
          setTimerRunning(false);
          showNotification(translations[language].timerPaused, "paused");
          setTaskStartTime(null); // Limpa a hora de início ao pausar
          break;
        case "timerReset":
          setTimerRunning(false);
          setTimeLeft(0);
          setPomodoroState("idle");
          setPomodoroCount(0);
          setIsIntervalRunning(false);
          setIntervalTimeLeft(0);
          setCurrentTaskId(null);
          setTaskStartTime(null); // Limpa a hora de início ao resetar
          showNotification(translations[language].taskReset, "reset");
          break;
        case "timerStopped":
          setTimerRunning(false);
          // O worker parou completamente, então o App.js deve refletir isso
          setCurrentTaskId(null);
          setTimeLeft(0);
          setPomodoroState("idle");
          setPomodoroCount(0);
          setIsIntervalRunning(false);
          setIntervalTimeLeft(0);
          setTaskStartTime(null); // Limpa a hora de início ao parar
          break;
        case "sync":
          // Sincroniza o estado do App.js com o worker quando o worker é iniciado ou o app ganha foco
          setTimeLeft(workerTimeLeft);
          setPomodoroState(workerPomodoroState);
          setPomodoroCount(workerPomodoroCount);
          setIsIntervalRunning(workerIsIntervalRunning);
          setIntervalTimeLeft(workerIntervalTimeLeft);
          setTotalGlobalElapsedTime(workerTotalGlobalElapsedTime);
          setSkippedTime(workerSkippedTime);
          setTaskStartTime(workerTaskStartTime); // Sincroniza a hora de início
          if (workerTaskId !== null) {
            setCurrentTaskId(workerTaskId);
            setTimerRunning(true);
          } else {
            setCurrentTaskId(null);
            setTimerRunning(false);
            setTaskStartTime(null); // Limpa a hora de início se não houver tarefa ativa
          }
          break;
        default:
          console.warn("Mensagem desconhecida do worker:", type);
      }
    };

    timerWorker.onmessage = handleWorkerMessage;

    // Quando o componente monta, pede para o worker sincronizar o estado
    timerWorker.postMessage({ type: "syncState" });

    return () => {
      // Limpeza: remove o listener de mensagens quando o componente desmonta
      timerWorker.onmessage = null;
    };
  }, [markTaskComplete, showNotification, language, tasks, currentTaskId]); // Adicionado tasks e currentTaskId para o useEffect

  // Efeito para garantir que currentTaskId é nulo se todas as tarefas estão completas
  useEffect(() => {
    const allTasksCompleted = tasks.every((task) => task.completed);
    if (allTasksCompleted && tasks.length > 0 && currentTaskId !== null) {
      // Garante que há tarefas antes de declarar todas completas
      setCurrentTaskId(null);
      setTimerRunning(false); // Também para o timer se ele estiver rodando
      setTimeLeft(0);
      setPomodoroState("idle");
      setPomodoroCount(0);
      setIsIntervalRunning(false);
      setTaskStartTime(null); // Limpa a hora de início quando todas as tarefas são concluídas
      // Não envia 'reset' para o worker aqui para evitar loop, o worker já deve estar parado ou em 'idle'
      showNotification(
        translations[language].allTasksCompletedNotification,
        "all-tasks-completed"
      ); // Mostra nova notificação
    }
  }, [tasks, currentTaskId, showNotification, language]); // Depende de tasks e currentTaskId

  // Obtém a tarefa atual para exibição
  const currentTask = tasks.find((task) => task.id === currentTaskId);
  const displayTime = isIntervalRunning ? intervalTimeLeft : timeLeft;

  // Calcula a duração total do ciclo atual para a animação do círculo
  const totalDuration = isIntervalRunning
    ? interTaskIntervalDuration * 60 // Usa intervalo dinâmico
    : currentTask
    ? currentTask.mode === "time"
      ? currentTask.duration
      : pomodoroState === "focus"
      ? currentTask.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION
      : pomodoroState === "shortBreak"
      ? currentTask.pomodoroShortBreakDuration ||
        DEFAULT_POMODORO_SHORT_BREAK_DURATION
      : pomodoroState === "longBreak"
      ? currentTask.pomodoroLongBreakDuration ||
        DEFAULT_POMODORO_LONG_BREAK_DURATION
      : 0
    : 0;

  // Função para determinar as cores do timer com base no estado Pomodoro e modo escuro
  const getTimerColors = useCallback(() => {
    let strokeColor = "";
    let textColor = "";

    if (isIntervalRunning) {
      strokeColor = darkMode ? "#a78bfa" : "#8b5cf6"; // purple-400 / purple-500
      textColor = darkMode ? "#d8b4fe" : "#6b21a8"; // purple-300 / purple-800
    } else {
      switch (pomodoroState) {
        case "focus":
          strokeColor = darkMode ? "#f87171" : "#ef4444"; // red-400 / red-500
          textColor = darkMode ? "#fca5a5" : "#b91c1c"; // red-300 / red-800
          break;
        case "shortBreak":
          strokeColor = darkMode ? "#4ade80" : "#22c55e"; // green-400 / green-500
          textColor = darkMode ? "#86efac" : "#166534"; // green-300 / green-800
          break;
        case "longBreak":
          strokeColor = darkMode ? "#60a5fa" : "#3b82f6"; // blue-400 / blue-500
          textColor = darkMode ? "#93c5fd" : "#1e40af"; // blue-300 / blue-800
          break;
        default: // idle or time mode
          strokeColor = darkMode ? "#818cf8" : "#4f46e5"; // indigo-400 / indigo-600
          textColor = darkMode ? "#c7d2fe" : "#3730a3"; // indigo-300 / indigo-800
          break;
      }
    }
    return { strokeColor, textColor };
  }, [pomodoroState, isIntervalRunning, darkMode]);

  const { strokeColor, textColor } = getTimerColors();

  // Efeito para atualizar a animação do círculo de progresso
  useEffect(() => {
    if (progressCircleRef.current) {
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const totalDurationForCalculation = totalDuration > 0 ? totalDuration : 1; // Evita divisão por zero

      // Calcula o offset para esvaziar no sentido horário
      const offset =
        circumference * (1 - displayTime / totalDurationForCalculation);
      progressCircleRef.current.style.strokeDasharray = circumference;
      progressCircleRef.current.style.strokeDashoffset = offset;
      progressCircleRef.current.style.stroke = strokeColor; // Aplica a cor da borda
    }
  }, [displayTime, totalDuration, strokeColor]); // Depende do tempo de exibição, duração total e strokeColor

  // Funções de arrastar e soltar
  const draggedItem = useRef(null); // Referência para o item sendo arrastado
  const dragOverItem = useRef(null); // Referência para o item sendo arrastado sobre

  const handleDragStart = (e, index) => {
    draggedItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    e.target.classList.add("bg-indigo-100"); // Adiciona feedback visual
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove("bg-indigo-100"); // Remove feedback visual
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("bg-indigo-100"); // Remove feedback visual
    draggedItem.current = null;
    dragOverItem.current = null;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedIndex = draggedItem.current;
    const droppedIndex = dragOverItem.current;

    if (
      draggedIndex === null ||
      droppedIndex === null ||
      draggedIndex === droppedIndex
    ) {
      return;
    }

    const newTasks = [...tasks];
    const [reorderedItem] = newTasks.splice(draggedIndex, 1);
    newTasks.splice(droppedIndex, 0, reorderedItem);

    setTasks(newTasks);

    // Se a tarefa atual foi movida, atualiza o worker com a nova ordem
    if (currentTaskId) {
      const updatedCurrentTask = newTasks.find(
        (task) => task.id === currentTaskId
      );
      if (updatedCurrentTask) {
        timerWorker.postMessage({
          type: "updateTask",
          payload: { task: updatedCurrentTask },
        });
      }
    }

    // Limpa as referências após a operação
    draggedItem.current = null;
    dragOverItem.current = null;
  };

  // Função para determinar o emoji da fase atual
  const getCurrentPhaseEmoji = () => {
    if (isIntervalRunning) {
      return "🚶"; // Andando para intervalo entre tarefas
    }
    switch (pomodoroState) {
      case "focus":
        return "🎯"; // Alvo para foco
      case "shortBreak":
        return "☕"; // Café para pausa curta
      case "longBreak":
        return "🛌"; // Cama para pausa longa
      default:
        return "⏳"; // Ampulheta para ocioso
    }
  };

  // Função para calcular o tempo total estimado de todas as tarefas
  const calculateTotalEstimatedTime = useCallback(() => {
    let totalSeconds = 0;
    tasks.forEach((task, index) => {
      if (task.mode === "time") {
        totalSeconds += task.duration;
      } else if (task.mode === "pomodoro") {
        const focusDur =
          task.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
        const shortBreakDur =
          task.pomodoroShortBreakDuration ||
          DEFAULT_POMODORO_SHORT_BREAK_DURATION;
        const longBreakDur =
          task.pomodoroLongBreakDuration ||
          DEFAULT_POMODORO_LONG_BREAK_DURATION;

        totalSeconds += task.pomodoroFocusSessions * focusDur;
        if (task.pomodoroFocusSessions > 1) {
          totalSeconds += (task.pomodoroFocusSessions - 1) * shortBreakDur;
        }
        totalSeconds += longBreakDur; // Assume que sempre há uma pausa longa no final do ciclo completo
      }
      // Adiciona tempo de intervalo entre tarefas, exceto para a última tarefa
      if (index < tasks.length - 1) {
        totalSeconds += interTaskIntervalDuration * 60; // Usa intervalo dinâmico
      }
    });
    return totalSeconds;
  }, [
    tasks,
    DEFAULT_POMODORO_FOCUS_DURATION,
    DEFAULT_POMODORO_SHORT_BREAK_DURATION,
    DEFAULT_POMODORO_LONG_BREAK_DURATION,
    interTaskIntervalDuration,
  ]);

  const totalEstimatedTime = calculateTotalEstimatedTime();

  // Calcula o tempo restante total (tempo da tarefa atual + tempo das tarefas futuras)
  const totalRemainingTime =
    totalEstimatedTime - (totalGlobalElapsedTime + skippedTime);

  // Calcula o tempo estimado de conclusão
  const estimatedCompletionDate = new Date(
    Date.now() + totalRemainingTime * 1000
  );
  const estimatedCompletionTime = estimatedCompletionDate.toLocaleTimeString(
    language,
    { hour: "2-digit", minute: "2-digit" }
  );

  // Componente de entrada numérica reutilizável com setas personalizadas
  const NumberInput = ({
    id,
    label,
    value,
    onChange,
    min,
    max,
    unit,
    darkMode,
    translationKey,
    icon,
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [internalValue, setInternalValue] = useState(
      value === 0 ? "" : value.toString()
    ); // Internal state as string

    useEffect(() => {
      // Sincroniza o estado interno com a prop 'value' do pai
      setInternalValue(value === 0 ? "" : value.toString());
    }, [value]);

    const handleChange = (e) => {
      const inputValue = e.target.value;
      setInternalValue(inputValue); // Atualiza o estado interno com o valor bruto da string

      if (inputValue === "") {
        onChange(0); // Se a string estiver vazia, envia 0 para o pai
      } else {
        const parsedValue = parseInt(inputValue, 10);
        if (!isNaN(parsedValue)) {
          onChange(parsedValue); // Se for um número válido, envia para o pai
        } else {
          // Se não for um número (ex: "-"), não chama onChange, mantém o valor interno como string
          // para permitir que o usuário continue digitando.
        }
      }
    };

    const handleIncrement = () => {
      const numValue = parseInt(internalValue, 10) || 0;
      const newValue =
        max !== undefined && numValue + 1 > max ? max : numValue + 1;
      setInternalValue(newValue.toString());
      onChange(newValue);
    };

    const handleDecrement = () => {
      const numValue = parseInt(internalValue, 10) || 0;
      const newValue =
        min !== undefined && numValue - 1 < min ? min : numValue - 1;
      setInternalValue(newValue.toString());
      onChange(newValue);
    };

    return (
      <div
        className={`flex flex-col items-center p-2 sm:p-4 rounded-lg relative ${
          darkMode ? "border border-gray-600" : "border border-gray-200"
        } transition-colors duration-300 group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <label
          htmlFor={id}
          className={`absolute left-3 px-1 text-xs sm:text-sm font-medium z-10 top-0 -translate-y-1/2 ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-600"
          } transition-colors duration-300`}
        >
          {translations[language][translationKey]}
        </label>
        <div className="flex items-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
          <span className="text-2xl sm:text-3xl">{icon}</span>{" "}
          {/* Usa a prop icon diretamente */}
          <input
            type="number"
            id={id}
            className={`text-4xl sm:text-5xl font-extrabold ${
              darkMode ? "text-indigo-300" : "text-indigo-800"
            } w-20 sm:w-24 text-center !bg-transparent focus:outline-none py-1 sm:py-2 px-2 sm:px-3 !focus:bg-transparent transition-colors duration-300 custom-number-input`}
            value={internalValue} // Usa o valor interno como string
            onChange={handleChange}
            min={min}
            max={max}
            required
            autoComplete="off"
          />
          <div
            className={`flex flex-col space-y-0.5 sm:space-y-1 transition-opacity duration-300 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <button
              type="button"
              onClick={handleIncrement}
              className={`p-0.5 sm:p-1 rounded-full ${
                darkMode
                  ? "bg-indigo-700 text-indigo-300"
                  : "bg-indigo-200 text-indigo-700"
              } hover:bg-indigo-300 focus:outline-none transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 15l7-7 7 7"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={handleDecrement}
              className={`p-0.5 sm:p-1 rounded-full ${
                darkMode
                  ? "bg-indigo-700 text-indigo-300"
                  : "bg-indigo-200 text-indigo-700"
              } hover:bg-indigo-300 focus:outline-none transition-colors duration-200`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 sm:h-4 sm:w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
        {unit && (
          <span
            className={`text-xs sm:text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {unit}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-800"
      } flex flex-col items-center p-4 font-inter transition-colors duration-300`}
    >
      {/* Estilos globais para ocultar as setas de entrada numérica */}
      <style>
        {`
        input[type='number']::-webkit-inner-spin-button,
        input[type='number']::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type='number'] {
          -moz-appearance: textfield; /* Firefox */
        }
        `}
      </style>
      <div
        className={`p-4 sm:p-8 rounded-lg shadow-md w-full max-w-2xl ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
        } transition-colors duration-300`}
      >
        <div className="flex justify-between items-center mb-6">
          <h1
            className={`text-2xl sm:text-3xl font-bold ${
              darkMode ? "text-gray-100" : "text-gray-800"
            }`}
          >
            {translations[language].taskManager}
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={() => setShowOptions(true)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-indigo-300"
                  : "bg-gray-200 text-indigo-700"
              } transition-colors duration-300`}
              title={translations[language].options}
            >
              {/* Ícone de três pontos verticais */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${
                darkMode
                  ? "bg-gray-700 text-yellow-300"
                  : "bg-gray-200 text-gray-700"
              } transition-colors duration-300`}
              title={
                darkMode
                  ? translations[language].switchLightMode
                  : translations[language].switchDarkMode
              }
            >
              {darkMode ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m9-9h1M4 12H3m15.325 5.924l-.707.707M6.343 6.343l-.707-.707m12.728 0l-.707-.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Modal de Opções */}
        {showOptions && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div
              className={`p-4 sm:p-8 rounded-lg shadow-md w-full max-w-md ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white"
              } transition-colors duration-300 relative`}
            >
              <h2
                className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {translations[language].options}
              </h2>

              <button
                onClick={() => setShowOptions(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 sm:p-2 rounded-full text-gray-400 hover:text-gray-600 focus:outline-none"
                title="Fechar opções"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Seleção de Idioma */}
              <div className="mb-4 sm:mb-6">
                <label
                  className={`block text-base sm:text-lg font-semibold mb-1 sm:mb-2 ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {translations[language].language}
                </label>
                <div className="flex space-x-2 sm:space-x-3">
                  {Object.keys(translations).map((langKey) => (
                    <button
                      key={langKey}
                      onClick={() => setLanguage(langKey)}
                      className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md font-medium transition-colors duration-200 text-sm sm:text-base ${
                        language === langKey
                          ? "bg-indigo-600 text-white"
                          : `${
                              darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                            }`
                      }`}
                    >
                      {langKey === "en"
                        ? "English"
                        : langKey === "pt-BR"
                        ? "Português (BR)"
                        : "Français"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Configuração do Intervalo Entre Tarefas */}
              <div className="mb-4 sm:mb-6">
                <NumberInput
                  id="interTaskInterval"
                  label={translations[language].interTaskIntervalSetting}
                  value={interTaskIntervalDuration}
                  onChange={setInterTaskIntervalDuration}
                  min={0}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="interTaskIntervalSetting"
                  icon="⏱️" // Ícone de relógio para duração
                />
              </div>

              {/* Alternar Notificações Sonoras */}
              <div className="mb-4 sm:mb-6 flex items-center justify-between">
                <label
                  className={`block text-base sm:text-lg font-semibold ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {translations[language].enableSoundNotifications}
                </label>
                <label
                  htmlFor="soundToggle"
                  className="relative inline-flex items-center cursor-pointer"
                >
                  <input
                    type="checkbox"
                    id="soundToggle"
                    className="sr-only peer"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>

              {/* Botão Salvar/Fechar - já tratado por atualizações de estado diretas e botão de fechar */}
            </div>
          </div>
        )}

        {/* Formulário para adicionar tarefas */}
        <form
          onSubmit={addTask}
          className={`mb-6 sm:mb-8 p-4 rounded-md ${
            darkMode ? "border border-gray-700" : "border border-gray-200"
          } transition-colors duration-300`}
        >
          <div className="mb-4">
            <label
              htmlFor="taskName"
              className={`block text-sm font-bold mb-2 ${
                darkMode ? "text-gray-300" : "text-gray-700"
              } transition-colors duration-300`}
            >
              {translations[language].taskName}
            </label>
            <input
              type="text"
              id="taskName"
              className={`peer appearance-none border-b ${
                darkMode
                  ? "border-gray-600 text-gray-100"
                  : "border-gray-300 text-gray-700"
              } rounded-none w-full py-2 px-3 leading-tight focus:outline-none ${
                darkMode ? "focus:border-indigo-400" : "focus:border-indigo-500"
              } !bg-transparent !focus:bg-transparent transition-colors duration-300`}
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder=""
              required
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <div className="flex-grow w-full sm:w-auto mb-4 sm:mb-0">
              <label
                className={`block text-sm font-bold mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                } transition-colors duration-300`}
              >
                {translations[language].timeMode}
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="taskMode"
                    value="time"
                    checked={taskMode === "time"}
                    onChange={() => setTaskMode("time")}
                  />
                  <span
                    className={`ml-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } transition-colors duration-300`}
                  >
                    {translations[language].freeTime}
                  </span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    className="form-radio text-indigo-600"
                    name="taskMode"
                    value="pomodoro"
                    checked={taskMode === "pomodoro"}
                    onChange={() => setTaskMode("pomodoro")}
                  />
                  <span
                    className={`ml-2 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    } transition-colors duration-300`}
                  >
                    {translations[language].pomodoro}
                  </span>
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center focus:outline-none focus:shadow-outline sm:ml-4"
              title={translations[language].addTask}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {taskMode === "time" && (
            <div className="mb-4">
              <NumberInput
                id="taskDuration"
                label={translations[language].durationMinutes}
                value={taskDuration}
                onChange={setTaskDuration}
                min={1}
                unit="min"
                darkMode={darkMode}
                translationKey="durationMinutes"
                icon="⏱️" // Ícone de relógio para duração
              />
            </div>
          )}

          {taskMode === "pomodoro" && (
            <>
              <h3
                className={`text-lg sm:text-xl font-semibold mb-4 mt-6 ${
                  darkMode ? "text-gray-100" : "text-gray-700"
                } transition-colors duration-300`}
              >
                {translations[language].pomodoroSettings}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                {/* Sessões de Foco */}
                <NumberInput
                  id="pomodoroFocusSessions"
                  label={translations[language].focusSessions}
                  value={pomodoroCustomFocusSessions}
                  onChange={setPomodoroCustomFocusSessions}
                  min={1}
                  unit="sessions"
                  darkMode={darkMode}
                  translationKey="focusSessions"
                  icon="🎯" // Ícone de alvo para foco
                />

                {/* Duração do Foco */}
                <NumberInput
                  id="customFocusDuration"
                  label={translations[language].focusDurationMin}
                  value={customFocusDurationInput}
                  onChange={setCustomFocusDurationInput}
                  min={1}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="focusDurationMin"
                  icon="⏱️" // Ícone de relógio para duração
                />

                {/* Duração da Pausa Curta */}
                <NumberInput
                  id="customShortBreakDuration"
                  label={translations[language].shortBreakMin}
                  value={customShortBreakDurationInput}
                  onChange={setCustomShortBreakDurationInput}
                  min={1}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="shortBreakMin"
                  icon="☕" // Ícone de café para pausa curta
                />

                {/* Duração da Pausa Longa */}
                <NumberInput
                  id="customLongBreakDuration"
                  label={translations[language].longBreakMin}
                  value={customLongBreakDurationInput}
                  onChange={setCustomLongBreakDurationInput}
                  min={1}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="longBreakMin"
                  icon="🛌" // Ícone de cama para pausa longa
                />
              </div>
            </>
          )}
        </form>

        {/* Exibição do Cronômetro */}
        <div
          className={`text-center mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg relative flex flex-col ${
            darkMode ? "border border-gray-700" : "border border-gray-200"
          } transition-colors duration-300`}
        >
          {/* Nome da Tarefa (canto superior esquerdo absoluto) */}
          <div
            className={`absolute left-3 px-1 text-xs sm:text-sm font-bold z-10 top-0 -translate-y-1/2 ${
              darkMode ? "bg-gray-800 text-gray-300" : "bg-white text-gray-700"
            } transition-colors duration-300`}
          >
            <h2
              className={`text-base sm:text-xl font-semibold flex items-center ${
                darkMode ? "text-gray-100" : "text-gray-700"
              } transition-colors duration-300`}
            >
              {currentTask && currentTask.mode === "pomodoro" && (
                <span className="mr-1 sm:mr-2 text-base sm:text-xl">🍅</span>
              )}
              {isIntervalRunning
                ? translations[language].interTaskInterval
                : currentTask
                ? currentTask.name
                : translations[language].noTaskSelected}
            </h2>
          </div>

          {/* Estado Pomodoro e Emoji (abaixo do título, alinhado à esquerda) */}
          {currentTask && currentTask.mode === "pomodoro" && (
            <div
              className={`absolute left-3 px-1 text-xs sm:text-sm font-bold z-10 top-8 sm:top-12 -translate-y-1/2 ${
                darkMode
                  ? "bg-gray-800 text-gray-300"
                  : "bg-white text-base sm:text-lg font-medium"
              } flex items-center ${
                darkMode ? "text-indigo-300" : "text-indigo-700"
              } transition-colors duration-300`}
            >
              {getCurrentPhaseEmoji()}
              <span className="ml-1 sm:ml-2">
                {pomodoroState === "focus"
                  ? `${translations[language].focus} (${pomodoroCount + 1}/${
                      currentTask.pomodoroFocusSessions
                    })`
                  : pomodoroState === "shortBreak"
                  ? currentTask.pomodoroFocusSessions > 1
                    ? `${translations[language].shortBreak} (${pomodoroCount}/${
                        currentTask.pomodoroFocusSessions - 1
                      })`
                    : translations[language].shortBreak
                  : pomodoroState === "longBreak"
                  ? translations[language].longBreak
                  : translations[language].readyToStart}
              </span>
            </div>
          )}

          {/* Conteúdo Principal: Círculo do Cronômetro + Coluna de Tempos */}
          <div className="flex flex-col md:flex-row items-center justify-center mt-20 sm:mt-28">
            {/* Círculo Principal do Cronômetro (esquerda) */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-4 md:mb-0 md:mr-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Círculo de fundo */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={
                    darkMode ? "#4a5568" : "#e0e0e0"
                  } /* Cor do círculo de fundo */
                  strokeWidth="5"
                />
                {/* Círculo de progresso animado */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={strokeColor} /* Cor do progresso (dinâmica) */
                  strokeWidth="5"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)" /* Inicia o traço no topo */
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                  }} /* Transição suave */
                  ref={progressCircleRef}
                />
              </svg>
              {/* Exibição do tempo digital, centralizado sobre o SVG */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div
                  className={`text-4xl md:text-5xl font-extrabold transition-colors duration-300 leading-none`}
                  style={{ color: textColor }}
                >
                  {Math.floor(displayTime / 60)
                    .toString()
                    .padStart(2, "0")}
                </div>
                <div
                  className={`text-4xl md:text-5xl font-extrabold transition-colors duration-300 leading-none`}
                  style={{ color: textColor }}
                >
                  {(displayTime % 60).toString().padStart(2, "0")}
                </div>
              </div>
            </div>

            {/* Grade de Tempos (direita) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 md:mt-0">
              {/* Cartão de Tempo Decorrido */}
              <div
                className={`p-2 sm:p-4 rounded-lg relative border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                } transition-colors duration-300 w-full`}
              >
                <label
                  className={`absolute left-2 sm:left-3 px-1 text-xs font-bold z-10 top-0 -translate-y-1/2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                  } transition-colors duration-300`}
                >
                  {translations[language].elapsed}
                </label>
                <span
                  className={`block text-base sm:text-xl font-extrabold ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } text-center pt-2 transition-colors duration-300`}
                >
                  {formatTotalTime(totalGlobalElapsedTime)}
                </span>
              </div>

              {/* Cartão de Tempo Restante */}
              <div
                className={`p-2 sm:p-4 rounded-lg relative border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                } transition-colors duration-300 w-full`}
              >
                <label
                  className={`absolute left-2 sm:left-3 px-1 text-xs font-bold z-10 top-0 -translate-y-1/2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                  } transition-colors duration-300`}
                >
                  {translations[language].remaining}
                </label>
                <span
                  className={`block text-base sm:text-xl font-extrabold ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } text-center pt-2 transition-colors duration-300`}
                >
                  {formatTotalTime(
                    totalRemainingTime > 0 ? totalRemainingTime : 0
                  )}
                </span>
              </div>

              {/* Cartão de Tempo Estimado */}
              <div
                className={`p-2 sm:p-4 rounded-lg relative border ${
                  darkMode ? "border-gray-600" : "border-gray-200"
                } transition-colors duration-300 w-full`}
              >
                <label
                  className={`absolute left-2 sm:left-3 px-1 text-xs font-bold z-10 top-0 -translate-y-1/2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                  } transition-colors duration-300`}
                >
                  {translations[language].estimated}
                </label>
                <span
                  className={`block text-base sm:text-xl font-extrabold ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } text-center pt-2 transition-colors duration-300`}
                >
                  {formatTotalTime(totalEstimatedTime)}
                </span>
              </div>

              {/* Cartão de Tempo Pulado */}
              <div
                className={`p-2 sm:p-4 rounded-lg relative border ${
                  darkMode ? "border-gray-600" : "border border-gray-200"
                } transition-colors duration-300 w-full`}
              >
                <label
                  className={`absolute left-2 sm:left-3 px-1 text-xs font-bold z-10 top-0 -translate-y-1/2 ${
                    darkMode
                      ? "bg-gray-800 text-gray-300"
                      : "bg-white text-gray-700"
                  } transition-colors duration-300`}
                >
                  {translations[language].skipped}
                </label>
                <span
                  className={`block text-base sm:text-xl font-extrabold ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  } text-center pt-2 transition-colors duration-300`}
                >
                  {formatTotalTime(skippedTime)}
                </span>
              </div>
            </div>
          </div>
          {/* Texto de Tempo Estimado de Conclusão */}
          <p
            className={`text-xs sm:text-sm mt-2 sm:mt-4 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            } transition-colors duration-300`}
          >
            {translations[language].estimatedCompletionTime.replace(
              "{time}",
              estimatedCompletionTime
            )}
          </p>
          {/* Novo: Hora de Início da Tarefa */}
          {taskStartTime && (
            <p
              className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } transition-colors duration-300`}
            >
              {translations[language].taskStartTime}:{" "}
              {new Date(taskStartTime).toLocaleTimeString(language, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {/* Botões (abaixo de todo o conteúdo, centralizados) */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-8">
            <button
              onClick={() => {
                if (timerRunning) {
                  pauseTimer();
                } else {
                  // Encontra a primeira tarefa não concluída
                  let taskToStart = tasks.find((task) => !task.completed);

                  if (taskToStart) {
                    // Se a tarefa a ser iniciada for diferente da tarefa atual OU se a tarefa atual estiver concluída,
                    // chama startTask para inicializar corretamente.
                    if (
                      taskToStart.id !== currentTaskId ||
                      (currentTask && currentTask.completed)
                    ) {
                      startTask(taskToStart);
                    } else {
                      setTimerRunning(true); // Retoma
                      const now = Date.now(); // Captura a hora de início ao retomar
                      setTaskStartTime(now); // Define a hora de início no App.js
                      timerWorker.postMessage({
                        type: "start",
                        payload: {
                          task: currentTask,
                          timeLeft: timeLeft,
                          pomodoroState: pomodoroState,
                          pomodoroCount: pomodoroCount,
                          isIntervalRunning: isIntervalRunning,
                          intervalTimeLeft: intervalTimeLeft,
                          totalGlobalElapsedTime: totalGlobalElapsedTime,
                          skippedTime: skippedTime,
                          interTaskIntervalDuration:
                            interTaskIntervalDuration * 60,
                          taskStartTime: now, // Passa a hora de início para o worker
                        },
                      });
                      showNotification(
                        translations[language].timerResumed,
                        "started"
                      ); // Notificação para retomar
                    }
                  } else {
                    // Se não houver tarefas, o botão deve estar desabilitado
                    console.log("Nenhuma tarefa para iniciar.");
                  }
                }
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                timerRunning
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={
                tasks.length === 0 && !isIntervalRunning && !currentTaskId
              }
              title={
                timerRunning
                  ? translations[language].pauseTimer
                  : translations[language].startTimer
              }
            >
              {timerRunning ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 sm:h-6 sm:w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </button>
            <button
              onClick={resetTimer} // Agora reseta apenas a tarefa atual
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-all duration-200"
              disabled={
                !currentTaskId &&
                !isIntervalRunning &&
                timeLeft === 0 &&
                intervalTimeLeft === 0
              }
              title={translations[language].restartTask}
            >
              {/* Ícone de reset (seta circular de atualização) */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-rotate-ccw"
              >
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.76 2.75L3 8" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
            <button
              onClick={skipCurrentPhase}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-yellow-200 hover:bg-yellow-300 text-yellow-800 font-bold transition-all duration-200"
              disabled={!currentTaskId && !isIntervalRunning} // Desabilita se nenhuma tarefa ou intervalo estiver ativo
              title={translations[language].skipCurrentPhase}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
            <button
              onClick={resetAll} // Novo botão para resetar tudo
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-red-600 hover:bg-red-700 text-white font-bold transition-all duration-200"
              title={translations[language].resetAll}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Lista de Tarefas */}
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold mb-4 ${
              darkMode ? "text-gray-100" : "text-gray-800"
            } transition-colors duration-300`}
          >
            {translations[language].tasks}
          </h2>
          {tasks.length === 0 ? (
            <p
              className={`text-center text-sm sm:text-base ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } transition-colors duration-300`}
            >
              {translations[language].noTasksAdded}
            </p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {tasks.map((task, index) => (
                <li
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()} // Permite soltar
                  onDrop={handleDrop}
                  onDragEnter={(e) => handleDragEnter(e, index)}
                  onDragLeave={handleDragLeave}
                  onDragEnd={handleDragEnd}
                  className={`flex flex-col p-3 sm:p-4 rounded-lg shadow-md transition-all duration-200 ${
                    currentTaskId === task.id
                      ? "border-2 border-indigo-500"
                      : `${
                          darkMode
                            ? "border border-gray-700"
                            : "border border-gray-200"
                        }`
                  } bg-transparent cursor-grab relative`}
                >
                  <div className="flex items-center justify-between mb-1 sm:mb-2">
                    <span
                      className={`font-semibold text-base sm:text-lg flex items-center ${
                        darkMode ? "text-gray-100" : "text-gray-800"
                      } transition-colors duration-300`}
                    >
                      {task.mode === "pomodoro" && (
                        <span className="mr-1 sm:mr-2 text-base sm:text-xl">
                          🍅
                        </span>
                      )}
                      {task.name}
                    </span>
                    {/* Botões de ação no canto superior direito */}
                    <div className="flex space-x-1 sm:space-x-2">
                      {!task.completed && (
                        <button
                          onClick={() => {
                            if (currentTaskId === task.id) {
                              if (timerRunning) {
                                pauseTimer();
                              } else {
                                setTimerRunning(true); // Retoma
                                const now = Date.now(); // Captura a hora de início ao retomar
                                timerWorker.postMessage({
                                  type: "start",
                                  payload: {
                                    task: currentTask,
                                    timeLeft: timeLeft,
                                    pomodoroState: pomodoroState,
                                    pomodoroCount: pomodoroCount,
                                    isIntervalRunning: isIntervalRunning,
                                    intervalTimeLeft: intervalTimeLeft,
                                    totalGlobalElapsedTime:
                                      totalGlobalElapsedTime,
                                    skippedTime: skippedTime,
                                    interTaskIntervalDuration:
                                      interTaskIntervalDuration * 60,
                                    taskStartTime: now, // Passa a hora de início para o worker
                                  },
                                });
                                showNotification(
                                  translations[language].timerResumed,
                                  "started"
                                );
                              }
                            } else {
                              startTask(task); // Inicia esta tarefa (irá parar qualquer outra tarefa em execução)
                            }
                          }}
                          className={`p-0.5 sm:p-1 rounded-full text-white transition-all duration-200 ${
                            currentTaskId === task.id && timerRunning
                              ? "bg-red-500 hover:bg-red-600" // Cor de pausa
                              : "bg-green-500 hover:bg-green-600" // Cor de play
                          }`}
                          disabled={task.completed} // Apenas desabilita se a tarefa estiver concluída
                          title={
                            currentTaskId === task.id && timerRunning
                              ? translations[language].pauseTimer
                              : translations[language].startTimer
                          }
                        >
                          {currentTaskId === task.id && timerRunning ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 sm:h-5 sm:w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-0.5 sm:p-1 rounded-full text-red-500 hover:text-red-700 transition-all duration-200"
                        title="Deletar Tarefa"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {task.mode === "time" && (
                    <div
                      className={`flex flex-wrap gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mt-1 sm:mt-2 transition-colors duration-300`}
                    >
                      <span className="flex items-center space-x-1">
                        ⏱️ {task.duration / 60} min
                      </span>
                    </div>
                  )}

                  {task.mode === "pomodoro" && (
                    <div
                      className={`grid grid-cols-2 gap-x-2 sm:gap-x-4 gap-y-1 sm:gap-y-2 text-xs sm:text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      } mt-1 sm:mt-2 transition-colors duration-300`}
                    >
                      <span className="flex items-center space-x-1">
                        🎯 {task.pomodoroFocusSessions}
                      </span>
                      <span className="flex items-center space-x-1">
                        ⏱️ {task.pomodoroFocusDuration / 60} min
                      </span>
                      <span className="flex items-center space-x-1">
                        ☕ {task.pomodoroShortBreakDuration / 60} min
                      </span>
                      <span className="flex items-center space-x-1">
                        🛌 {task.pomodoroLongBreakDuration / 60} min
                      </span>
                    </div>
                  )}

                  {/* Ícone de verificação de conclusão (canto inferior direito) */}
                  {task.completed && (
                    <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-0.5 sm:p-1 bg-green-500 rounded-full shadow-md">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-3 w-3 sm:h-4 sm:w-4 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <Notification
        message={notification.message}
        type={notification.type}
        onClose={clearNotification}
        darkMode={darkMode}
      />
    </div>
  );
}

export default App;

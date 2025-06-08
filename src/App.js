import React, { useState, useEffect, useRef, useCallback } from "react";
import * as Tone from "tone"; // Import Tone.js

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
    taskCompleted: "Task completed! Time for a new challenge.",
    focusSessionEnded: "Focus session ended! Time for a break.",
    shortBreakEnded: "Short break ended! Back to focus.",
    longBreakEnded: "Long break ended! Well deserved rest.",
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
    taskStartTimeLabel: "Task start time", // New translation for start time label
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
    taskCompleted: "Tarefa concluída! Hora de um novo desafio.",
    focusSessionEnded: "Sessão de foco encerrada! Hora de uma pausa.",
    shortBreakEnded: "Pausa curta encerrada! De volta ao foco.",
    longBreakEnded: "Pausa longa encerrada! Descanso merecido.",
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
    options: "Opcões",
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
    taskStartTimeLabel: "Início das tarefas", // New translation for start time label
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
    taskCompleted: "Tâche terminée ! Il est temps de relever un nouveau défi.",
    focusSessionEnded: "Session de focus terminée ! C'est l'heure de la pause.",
    shortBreakEnded: "Courte pause terminée ! Retour au focus.",
    longBreakEnded: "Longue pause terminée ! Repos bien mérité.",
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
      "Toutes les tarefas sont terminadas ! Bon trabalho !", // New notification message
    enableSoundNotifications: "Activer les sons de notification", // New translation
    taskStartTimeLabel: "Heure de début de la tâche", // New translation for start time label
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

// Helper function to format total time in HH:MM
const formatTotalTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

// Main application component
function App() {
  // Durations for Pomodoro cycles in seconds (default values)
  const DEFAULT_POMODORO_FOCUS_DURATION = 25 * 60; // 25 minutes focus
  const DEFAULT_POMODORO_SHORT_BREAK_DURATION = 5 * 60; // 5 minutes short break
  const DEFAULT_POMODORO_LONG_BREAK_DURATION = 15 * 60; // 15 minutes long break
  // INTER_TASK_INTERVAL_DURATION is now a state: interTaskIntervalDuration * 60

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
  const [firstTaskStartTime, setFirstTaskStartTime] = useState(null); // Changed to firstTaskStartTime

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

  // New state to control if audio context has been started
  const [isAudioContextStarted, setIsAudioContextStarted] = useState(false);

  // Ref for the Web Worker
  const timerWorkerRef = useRef(null);

  // New states for managing timer accuracy on suspension
  const [timerStartTime, setTimerStartTime] = useState(null); // Timestamp when timer started/resumed
  const [durationAtTimerStart, setDurationAtTimerStart] = useState(0); // timeLeft or intervalTimeLeft at timerStartTime

  // Drag and drop functions
  const draggedItem = useRef(null);
  const dragOverItem = useRef(null);

  // Define the Web Worker code as a string
  const timerWorkerCode = `
    let timerInterval;
    self.onmessage = function(e) {
      if (e.data.command === 'start') {
        const delay = e.data.delay || 1000;
        if (timerInterval) {
          clearInterval(timerInterval);
        }
        timerInterval = setInterval(() => {
          self.postMessage('tick');
        }, delay);
      } else if (e.data.command === 'stop') {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };
    self.onclose = function() {
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
      }
    };
  `;

  // Initialize Web Worker on component mount
  useEffect(() => {
    // Cria uma nova instância do Web Worker a partir do código em string
    const blob = new Blob([timerWorkerCode], {
      type: "application/javascript",
    });
    const workerUrl = URL.createObjectURL(blob);
    timerWorkerRef.current = new Worker(workerUrl);

    // Escuta mensagens do Web Worker
    timerWorkerRef.current.onmessage = function (e) {
      if (e.data === "tick") {
        const currentTime = Date.now();
        const elapsedSinceStart = Math.floor(
          (currentTime - timerStartTime) / 1000
        );

        if (isIntervalRunning) {
          const newIntervalTimeLeft = Math.max(
            0,
            durationAtTimerStart - elapsedSinceStart
          );
          setIntervalTimeLeft(newIntervalTimeLeft);
        } else {
          const newTimeLeft = Math.max(
            0,
            durationAtTimerStart - elapsedSinceStart
          );
          setTimeLeft(newTimeLeft);
        }
        setTotalGlobalElapsedTime((prev) => prev + 1);
      }
    };

    // Limpa o Web Worker quando o componente é desmontado
    return () => {
      if (timerWorkerRef.current) {
        timerWorkerRef.current.postMessage({ command: "stop" }); // Envia comando para parar o worker
        timerWorkerRef.current.terminate(); // Termina o worker
        URL.revokeObjectURL(workerUrl); // Libera o URL do objeto
        timerWorkerRef.current = null;
      }
    };
  }, [timerStartTime, durationAtTimerStart, isIntervalRunning]); // Removido timerWorkerCode das dependências

  // Initialize Tone.js synths ONLY WHEN audio context is started
  useEffect(() => {
    if (!isAudioContextStarted || !Tone) return; // Only initialize if context is started and Tone is available

    console.log("Initializing Tone.js synths...");
    focusSynthRef.current = new Tone.Synth().toDestination();
    breakSynthRef.current = new Tone.Synth().toDestination();
    longBreakSynthRef.current = new Tone.PolySynth(Tone.Synth).toDestination(); // PolySynth for chords
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
  }, [isAudioContextStarted]); // Depends on isAudioContextStarted

  // Function to play sounds based on notification type
  const playSound = useCallback(
    (type) => {
      if (!soundEnabled || !isAudioContextStarted || !Tone) return; // Only play if sound is enabled and audio context started

      // Use Tone.now() as a base time, and add a small, unique offset for each sound
      // This helps prevent "Start time must be strictly greater than previous start time" errors
      // when multiple sounds are triggered very rapidly.
      const now = Tone.now();
      const delay = 0.01; // Small delay in seconds

      switch (type) {
        case "focus-ended":
          focusSynthRef.current.triggerAttackRelease(
            "C4",
            "8n",
            now + delay * 1
          );
          break;
        case "short-break-ended":
          breakSynthRef.current.triggerAttackRelease(
            "E4",
            "8n",
            now + delay * 2
          );
          break;
        case "long-break-ended":
          longBreakSynthRef.current.triggerAttackRelease(
            ["C5", "E5", "G5"],
            "4n",
            now + delay * 3
          );
          break;
        case "completed":
        case "all-tasks-completed":
          completeSynthRef.current.triggerAttackRelease(
            ["C5", "E5", "G5"],
            "4n",
            now + delay * 4
          );
          break;
        case "skipped":
          skippedSynthRef.current.triggerAttackRelease(
            "C3",
            "16n",
            now + delay * 5
          );
          break;
        case "paused":
          pausedSynthRef.current.triggerAttackRelease(
            "A3",
            "8n",
            now + delay * 6
          );
          break;
        case "started":
        case "resumed":
          startedSynthRef.current.triggerAttackRelease(
            "C4",
            "16n",
            now + delay * 7
          );
          break;
        case "added":
          addedSynthRef.current.triggerAttackRelease(
            "D4",
            "16n",
            now + delay * 8
          );
          break;
        case "reset":
          resetSynthRef.current.triggerAttackRelease(
            "C2",
            "8n",
            now + delay * 9
          );
          break;
        default:
          // No sound for other types
          break;
      }
    },
    [soundEnabled, isAudioContextStarted]
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

  // Helper function to find the next uncompleted task in the list, considering the current task's position
  const findNextTaskInSequence = useCallback(
    (currentTasks, currentActiveTaskId) => {
      let startIndex = 0;
      if (currentActiveTaskId) {
        const currentTaskIndex = currentTasks.findIndex(
          (task) => task.id === currentActiveTaskId
        );
        if (currentTaskIndex !== -1) {
          startIndex = currentTaskIndex + 1;
        }
      }

      // First, try to find the next uncompleted task *after* the current one in the original list
      for (let i = startIndex; i < currentTasks.length; i++) {
        if (!currentTasks[i].completed) {
          return currentTasks[i];
        }
      }

      // If no uncompleted tasks found after the current one,
      // then look for the first uncompleted task from the beginning of the list
      for (let i = 0; i < startIndex; i++) {
        if (!currentTasks[i].completed) {
          return currentTasks[i];
        }
      }

      // If no uncompleted tasks are found anywhere
      return null;
    },
    []
  );

  // Function to start a specific task (or an interval)
  const startTimerOrInterval = useCallback(
    (targetTask = null, isResuming = false) => {
      // Clear any existing timer by sending a stop command to the worker
      if (timerWorkerRef.current) {
        timerWorkerRef.current.postMessage({ command: "stop" });
      }

      setTimerRunning(false); // Reset main timer state
      setIsIntervalRunning(false); // Reset interval state

      if (targetTask) {
        // Starting/resuming a task
        setCurrentTaskId(targetTask.id);
        // Set firstTaskStartTime only if it's the very first task starting
        if (firstTaskStartTime === null) {
          setFirstTaskStartTime(Date.now());
        }

        let initialTime;
        let newPomodoroState = "idle";
        let newPomodoroCount = 0;

        if (targetTask.mode === "time") {
          initialTime = isResuming ? timeLeft : targetTask.duration;
        } else if (targetTask.mode === "pomodoro") {
          if (isResuming) {
            initialTime = timeLeft;
            newPomodoroState = pomodoroState;
            newPomodoroCount = pomodoroCount;
          } else {
            initialTime =
              targetTask.pomodoroFocusDuration ||
              DEFAULT_POMODORO_FOCUS_DURATION;
            newPomodoroState = "focus";
            newPomodoroCount = 0;
          }
        }
        setTimeLeft(initialTime);
        setPomodoroState(newPomodoroState);
        setPomodoroCount(newPomodoroCount);
        setTimerRunning(true); // ONLY set timerRunning here

        // Set timer start time and duration for accurate tracking
        setTimerStartTime(Date.now());
        setDurationAtTimerStart(initialTime);

        timerWorkerRef.current.postMessage({ command: "start", delay: 1000 }); // Start worker for task
      } else {
        // Starting an inter-task interval
        setCurrentTaskId(null);
        const initialIntervalTime = isResuming
          ? intervalTimeLeft
          : interTaskIntervalDuration * 60;
        setIntervalTimeLeft(initialIntervalTime);
        setTimeLeft(0); // Task time is irrelevant during interval
        setPomodoroState("idle"); // Pomodoro state is idle during interval
        setIsIntervalRunning(true); // ONLY set isIntervalRunning here

        // Set timer start time and duration for accurate tracking
        setTimerStartTime(Date.now());
        setDurationAtTimerStart(initialIntervalTime);

        timerWorkerRef.current.postMessage({ command: "start", delay: 1000 }); // Start worker for interval
      }
      showNotification(
        isResuming
          ? translations[language].timerResumed
          : translations[language].timerStarted,
        "started"
      );
    },
    [
      timeLeft,
      pomodoroState,
      pomodoroCount,
      intervalTimeLeft,
      interTaskIntervalDuration,
      showNotification,
      language,
      DEFAULT_POMODORO_FOCUS_DURATION,
      firstTaskStartTime,
    ]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps, no-unused-vars
  const handleTimerEnd = useCallback(() => {
    // The timer is already cleared by the useEffect when prevTime <= 1
    // This function focuses on setting the next state

    let tempUpdatedTasks = [...tasks];
    let shouldStartNextPhase = false; // Flag to indicate if a new phase should start immediately

    if (isIntervalRunning) {
      showNotification(translations[language].interTaskBreakEnded, "completed");
      setIsIntervalRunning(false);
      setTimerRunning(false); // Ensure main timer is off
      timerWorkerRef.current.postMessage({ command: "stop" }); // Stop worker
      const nextTaskToStart = findNextTaskInSequence(
        tempUpdatedTasks,
        currentTaskId
      ); // Use new function
      if (nextTaskToStart) {
        startTimerOrInterval(nextTaskToStart, false); // Start the next task
      } else {
        // All tasks completed, handle final state
        setCurrentTaskId(null);
        setTimeLeft(0);
        setPomodoroState("idle");
        showNotification(
          translations[language].allTasksCompletedNotification,
          "all-tasks-completed"
        );
      }
    } else if (currentTaskId) {
      const currentTask = tempUpdatedTasks.find(
        (task) => task.id === currentTaskId
      );
      if (!currentTask) return;

      if (currentTask.mode === "time") {
        // Mark as completed naturally (not skipped)
        tempUpdatedTasks = tempUpdatedTasks.map((task) =>
          task.id === currentTaskId
            ? { ...task, completed: true, skipped: false }
            : task
        );
        showNotification(translations[language].taskCompleted, "completed");

        const nextTaskToStart = findNextTaskInSequence(
          tempUpdatedTasks,
          currentTaskId
        ); // Use new function
        if (nextTaskToStart) {
          setIsIntervalRunning(true);
          setIntervalTimeLeft(interTaskIntervalDuration * 60);
          setTimerRunning(false); // Ensure main timer is off

          // Set timer start time and duration for accurate tracking
          setTimerStartTime(Date.now());
          setDurationAtTimerStart(interTaskIntervalDuration * 60);

          timerWorkerRef.current.postMessage({ command: "start", delay: 1000 }); // Start worker for interval
        } else {
          // All tasks completed, handle final state
          setCurrentTaskId(null);
          setTimeLeft(0);
          setPomodoroState("idle");
          setTimerRunning(false);
          timerWorkerRef.current.postMessage({ command: "stop" }); // Stop worker
          showNotification(
            translations[language].allTasksCompletedNotification,
            "all-tasks-completed"
          );
        }
      } else if (currentTask.mode === "pomodoro") {
        let newPomodoroCount = pomodoroCount;
        const focusDuration =
          currentTask.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
        const shortBreakDuration =
          currentTask.pomodoroShortBreakDuration ||
          DEFAULT_POMODORO_SHORT_BREAK_DURATION;
        const longBreakDuration =
          currentTask.pomodoroLongBreakDuration ||
          DEFAULT_POMODORO_LONG_BREAK_DURATION;

        if (pomodoroState === "focus") {
          newPomodoroCount++;
          showNotification(
            translations[language].focusSessionEnded,
            "focus-ended"
          );
          if (newPomodoroCount % currentTask.pomodoroFocusSessions === 0) {
            setTimeLeft(longBreakDuration);
            setPomodoroState("longBreak");
            setDurationAtTimerStart(longBreakDuration); // Set duration for accurate tracking
          } else {
            setTimeLeft(shortBreakDuration);
            setPomodoroState("shortBreak");
            setDurationAtTimerStart(shortBreakDuration); // Set duration for accurate tracking
          }
          setPomodoroCount(newPomodoroCount);
          shouldStartNextPhase = true; // Indicate that the timer should continue
        } else if (pomodoroState === "shortBreak") {
          showNotification(
            translations[language].shortBreakEnded,
            "short-break-ended"
          );
          setTimeLeft(focusDuration);
          setPomodoroState("focus");
          setDurationAtTimerStart(focusDuration); // Set duration for accurate tracking
          shouldStartNextPhase = true; // Indicate that the timer should continue
        } else if (pomodoroState === "longBreak") {
          // Mark as completed naturally (not skipped)
          tempUpdatedTasks = tempUpdatedTasks.map((task) =>
            task.id === currentTaskId
              ? { ...task, completed: true, skipped: false }
              : task
          );
          showNotification(
            translations[language].longBreakEnded,
            "long-break-ended"
          );
          setPomodoroCount(0); // Reset for next task's Pomodoro
          setPomodoroState("idle"); // Set to idle as cycle ends

          // After a long break, find the next task directly, without inter-task interval
          const nextTaskToStart = findNextTaskInSequence(
            tempUpdatedTasks,
            currentTaskId
          ); // Use new function
          if (nextTaskToStart) {
            startTimerOrInterval(nextTaskToStart, false); // Start the next task
          } else {
            // All tasks completed, handle final state
            setCurrentTaskId(null);
            setTimeLeft(0);
            setPomodoroState("idle");
            setTimerRunning(false); // Ensure main timer is off
            timerWorkerRef.current.postMessage({ command: "stop" }); // Stop worker
            showNotification(
              translations[language].allTasksCompletedNotification,
              "all-tasks-completed"
            );
          }
          setTasks(tempUpdatedTasks); // Update tasks state
          return; // Exit as next task/stop is handled
        }
      }
    }

    setTasks(tempUpdatedTasks); // Ensure tasks state is updated
    // This single check at the end will start the timer if a new phase was set
    if (shouldStartNextPhase && !isIntervalRunning) {
      // Only start if it's a Pomodoro phase transition and not an interval
      setTimerRunning(true);
      setTimerStartTime(Date.now()); // Set timer start time for accurate tracking
      timerWorkerRef.current.postMessage({ command: "start", delay: 1000 }); // Start worker for task
    }
    // If it's an interval, setIsIntervalRunning(true) already handles it.
    // If it's the end of a long break, the logic already handles starting the next task or stopping.
  }, [
    currentTaskId,
    tasks,
    pomodoroState,
    pomodoroCount,
    isIntervalRunning,
    startTimerOrInterval,
    showNotification,
    language,
    DEFAULT_POMODORO_FOCUS_DURATION,
    DEFAULT_POMODORO_SHORT_BREAK_DURATION,
    DEFAULT_POMODORO_LONG_BREAK_DURATION,
    interTaskIntervalDuration,
    findNextTaskInSequence,
  ]);

  // Effect to call handleTimerEnd when timeLeft or intervalTimeLeft reaches 0
  useEffect(() => {
    if (
      timerRunning &&
      timeLeft <= 0 &&
      !isIntervalRunning &&
      currentTaskId !== null
    ) {
      // Only call handleTimerEnd if timeLeft has truly reached 0 for a task
      // and the timer was running, and it's not an interval.
      handleTimerEnd();
    } else if (isIntervalRunning && intervalTimeLeft <= 0) {
      // Only call handleTimerEnd if intervalTimeLeft has truly reached 0
      // and the interval was running.
      handleTimerEnd();
    }
  }, [
    timeLeft,
    intervalTimeLeft,
    timerRunning,
    isIntervalRunning,
    handleTimerEnd,
    currentTaskId,
  ]);

  // Função para pausar o timer
  const pauseTimer = useCallback(() => {
    if (timerWorkerRef.current) {
      timerWorkerRef.current.postMessage({ command: "stop" });
    }
    setTimerRunning(false);
    showNotification(translations[language].timerPaused, "paused");
  }, [showNotification, language]);

  // Função para resetar o timer da tarefa atual (não reseta tempos globais)
  const resetTimer = useCallback(() => {
    if (timerWorkerRef.current) {
      timerWorkerRef.current.postMessage({ command: "stop" });
    }
    setTimerRunning(false);
    setTimeLeft(0);
    setPomodoroState("idle");
    setPomodoroCount(0);
    setIsIntervalRunning(false);
    setIntervalTimeLeft(0);
    setCurrentTaskId(null); // Ensure no task is selected
    setTimerStartTime(null); // Clear timer start time
    setDurationAtTimerStart(0); // Clear duration at timer start
    // Do NOT reset firstTaskStartTime here, as it's meant to be the global start.
    showNotification(translations[language].taskReset, "reset");
  }, [showNotification, language]);

  // Função para resetar todos os tempos (globais e da tarefa atual)
  const resetAll = useCallback(() => {
    resetTimer(); // Reset current task and timer
    setTotalGlobalElapsedTime(0); // Reset global elapsed time
    setSkippedTime(0); // Reset skipped time
    setFirstTaskStartTime(null); // Reset first task start time
    // Reset completion status and skipped status of all tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: false, skipped: false }))
    );
    showNotification(translations[language].allTasksReset, "reset");
  }, [resetTimer, showNotification, language]);

  // Function to skip current phase
  const skipCurrentPhase = useCallback(() => {
    // Clear the active timer immediately by stopping the worker
    if (timerWorkerRef.current) {
      timerWorkerRef.current.postMessage({ command: "stop" });
    }

    setTimerRunning(false); // Stop the main timer
    setIsIntervalRunning(false); // Stop the interval timer

    let timeToSkip = 0;
    let tempUpdatedTasks = [...tasks];
    let shouldStartNextPhase = false; // Flag to indicate if a new phase should start immediately

    if (isIntervalRunning) {
      timeToSkip = intervalTimeLeft;
      setSkippedTime((prev) => prev + timeToSkip);
      showNotification(translations[language].interTaskBreakSkipped, "skipped");
      const nextTaskToStart = findNextTaskInSequence(
        tempUpdatedTasks,
        currentTaskId
      ); // Use new function
      if (nextTaskToStart) {
        startTimerOrInterval(nextTaskToStart, false);
      } else {
        // All tasks completed, handle final state
        setCurrentTaskId(null);
        setTimeLeft(0);
        setPomodoroState("idle");
        showNotification(
          translations[language].allTasksCompletedNotification,
          "all-tasks-completed"
        );
      }
    } else if (currentTaskId) {
      const currentTask = tempUpdatedTasks.find(
        (task) => task.id === currentTaskId
      );
      if (!currentTask) return;

      timeToSkip = timeLeft;
      setSkippedTime((prev) => prev + timeToSkip);

      if (currentTask.mode === "time") {
        // Mark as skipped
        tempUpdatedTasks = tempUpdatedTasks.map((task) =>
          task.id === currentTaskId
            ? { ...task, completed: true, skipped: true }
            : task
        );
        showNotification(translations[language].taskSkipped, "skipped");

        const nextTaskToStart = findNextTaskInSequence(
          tempUpdatedTasks,
          currentTaskId
        ); // Use new function
        if (nextTaskToStart) {
          setIsIntervalRunning(true);
          setIntervalTimeLeft(interTaskIntervalDuration * 60);
          setTimerRunning(false); // Ensure main timer is off

          // Set timer start time and duration for accurate tracking
          setTimerStartTime(Date.now());
          setDurationAtTimerStart(interTaskIntervalDuration * 60);

          timerWorkerRef.current.postMessage({ command: "start", delay: 1000 }); // Start worker for interval
        } else {
          // All tasks completed, handle final state
          setCurrentTaskId(null);
          setTimeLeft(0);
          setPomodoroState("idle");
          setTimerRunning(false);
          showNotification(
            translations[language].allTasksCompletedNotification,
            "all-tasks-completed"
          );
        }
      } else if (currentTask.mode === "pomodoro") {
        let phaseName = "";
        let newPomodoroCount = pomodoroCount;

        const focusDuration =
          currentTask.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION;
        const shortBreakDuration =
          currentTask.pomodoroShortBreakDuration ||
          DEFAULT_POMODORO_SHORT_BREAK_DURATION;
        const longBreakDuration =
          currentTask.pomodoroLongBreakDuration ||
          DEFAULT_POMODORO_LONG_BREAK_DURATION;

        if (pomodoroState === "focus") {
          phaseName = translations[language].focus;
          newPomodoroCount++;
          if (newPomodoroCount % currentTask.pomodoroFocusSessions === 0) {
            setTimeLeft(longBreakDuration);
            setPomodoroState("longBreak");
            setDurationAtTimerStart(longBreakDuration); // Set duration for accurate tracking
          } else {
            setTimeLeft(shortBreakDuration);
            setPomodoroState("shortBreak");
            setDurationAtTimerStart(shortBreakDuration); // Set duration for accurate tracking
          }
          setPomodoroCount(newPomodoroCount);
          shouldStartNextPhase = true;
        } else if (pomodoroState === "shortBreak") {
          phaseName = translations[language].shortBreak;
          setTimeLeft(focusDuration);
          setPomodoroState("focus");
          setDurationAtTimerStart(focusDuration); // Set duration for accurate tracking
          shouldStartNextPhase = true;
        } else if (pomodoroState === "longBreak") {
          // Mark as skipped
          tempUpdatedTasks = tempUpdatedTasks.map((task) =>
            task.id === currentTaskId
              ? { ...task, completed: true, skipped: true }
              : task
          );
          showNotification(
            translations[language].longBreakEnded,
            "long-break-ended"
          );
          setPomodoroCount(0);
          setPomodoroState("idle");

          // After skipping a long break, find the next task directly, without inter-task interval
          const nextTaskToStart = findNextTaskInSequence(
            tempUpdatedTasks,
            currentTaskId
          ); // Use new function
          if (nextTaskToStart) {
            startTimerOrInterval(nextTaskToStart, false);
          } else {
            // All tasks completed, handle final state
            setCurrentTaskId(null);
            setTimeLeft(0);
            setPomodoroState("idle");
            setTimerRunning(false); // Ensure main timer is off
            showNotification(
              translations[language].allTasksCompletedNotification,
              "all-tasks-completed"
            );
          }
        }
        showNotification(
          translations[language].pomodoroPhaseSkipped.replace(
            "{phase}",
            phaseName
          ),
          "skipped"
        );
      }
    }
    setTasks(tempUpdatedTasks); // Update tasks state

    // This single check at the end will start the timer if a new phase was set
    if (shouldStartNextPhase && !isIntervalRunning) {
      // Only start if it's a Pomodoro phase transition and not an interval
      setTimerRunning(true);
      setTimerStartTime(Date.now()); // Set timer start time for accurate tracking
      timerWorkerRef.current.postMessage({ command: "start", delay: 1000 }); // Start worker for task
    }
    // If it's an interval, setIsIntervalRunning(true) already handles it.
    // If it's the end of a long break, the logic already handles starting the next task or stopping.
  }, [
    currentTaskId,
    isIntervalRunning,
    tasks,
    pomodoroState,
    pomodoroCount,
    timeLeft,
    intervalTimeLeft,
    startTimerOrInterval,
    showNotification,
    language,
    interTaskIntervalDuration,
    DEFAULT_POMODORO_FOCUS_DURATION,
    DEFAULT_POMODORO_SHORT_BREAK_DURATION,
    DEFAULT_POMODORO_LONG_BREAK_DURATION,
    findNextTaskInSequence,
  ]);

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
        totalSeconds += longBreakDur;
      }
      // Add inter-task interval only if it's not the last task AND it's not a pomodoro long break ending
      const isLastTask = index === tasks.length - 1;

      // If it's not the last task, and it's not a pomodoro long break ending (which transitions directly to next task or completion)
      // This condition needs to be more precise for pomodoro long break.
      // For simplicity, let's assume inter-task interval is added between any two tasks,
      // and the end-of-all-tasks logic handles the final state.
      // The problem is about *starting* the interval when it shouldn't.
      // The `handleTimerEnd` and `skipCurrentPhase` logic should prevent this.
      if (!isLastTask) {
        // Simplified condition to add interval between tasks
        totalSeconds += interTaskIntervalDuration * 60;
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

  // Function to determine timer colors based on Pomodoro state and dark mode
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

  // Helper function to format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Helper function to determine current phase emoji
  const getCurrentPhaseEmoji = useCallback(() => {
    if (isIntervalRunning) {
      return "🚶"; // Walking for inter-task interval
    }
    switch (pomodoroState) {
      case "focus":
        return "🎯"; // Target for focus
      case "shortBreak":
        return "☕"; // Coffee for short break
      case "longBreak":
        return "🛌"; // Bed for long break
      default:
        return "⏳"; // Hourglass for idle
    }
  }, [isIntervalRunning, pomodoroState]);

  // Get current task for display
  const currentTask = tasks.find((task) => task.id === currentTaskId);
  const displayTime = isIntervalRunning ? intervalTimeLeft : timeLeft;

  // Calculate total duration of the current cycle for circle animation
  const totalDuration = isIntervalRunning
    ? interTaskIntervalDuration * 60 // Use dynamic interval
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

  // Effect to update progress circle animation
  useEffect(() => {
    if (progressCircleRef.current) {
      const radius = 45;
      const circumference = 2 * Math.PI * radius;
      const totalDurationForCalculation = totalDuration > 0 ? totalDuration : 1; // Avoid division by zero

      // Calculate offset to empty clockwise
      const offset =
        circumference * (1 - displayTime / totalDurationForCalculation);
      progressCircleRef.current.style.strokeDasharray = circumference;
      progressCircleRef.current.style.strokeDashoffset = offset;
      progressCircleRef.current.style.stroke = strokeColor; // Apply border color
    }
  }, [displayTime, totalDuration, strokeColor]); // Depends on display time, total duration, and strokeColor

  // Drag and drop functions
  const handleDragStart = (e, index) => {
    draggedItem.current = index;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragEnter = (e, index) => {
    dragOverItem.current = index;
    e.target.classList.add("bg-indigo-100"); // Add visual feedback
  };

  const handleDragLeave = (e) => {
    e.target.classList.remove("bg-indigo-100"); // Remove visual feedback
  };

  const handleDragEnd = (e) => {
    e.target.classList.remove("bg-indigo-100"); // Remove visual feedback
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
    // Clear refs after operation
    draggedItem.current = null;
    dragOverItem.current = null;
  };

  // Function to add a new task
  const addTask = async (e) => {
    // Made async to await Tone.start()
    e.preventDefault();
    if (!taskName.trim()) return;

    // Start Tone.js audio context on first user interaction (adding a task)
    if (!isAudioContextStarted) {
      try {
        await Tone.start();
        setIsAudioContextStarted(true);
        console.log("Contexto de áudio Tone.js iniciado ao adicionar tarefa.");
      } catch (error) {
        console.error(
          "Falha ao iniciar o contexto de áudio Tone.js ao adicionar tarefa:",
          error
        );
        showNotification("Falha ao iniciar o áudio. Tente novamente.", "error");
        return; // Impede a execução se o áudio falhar
      }
    }

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
      skipped: false, // New property for skipped status
    };

    setTasks([...tasks, newTask]);
    setTaskName("");
    setTaskDuration(30); // Reset to default 30 minutes after adding
    showNotification(translations[language].taskAdded, "added");
  };

  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (currentTaskId === id) {
      resetTimer();
      setCurrentTaskId(null);
    }
  };

  // Effect to ensure currentTaskId is null if all tasks are completed
  useEffect(() => {
    const allTasksCompleted = tasks.every((task) => task.completed);
    if (allTasksCompleted && tasks.length > 0 && currentTaskId !== null) {
      // Ensure there are tasks before declaring all completed
      setCurrentTaskId(null);
      setTimerRunning(false); // Also stop the timer if it's somehow still running
      setTimeLeft(0);
      setPomodoroState("idle");
      setPomodoroCount(0);
      setIsIntervalRunning(false);
      if (timerWorkerRef.current) {
        timerWorkerRef.current.postMessage({ command: "stop" }); // Stop worker
      }
      showNotification(
        translations[language].allTasksCompletedNotification,
        "all-tasks-completed"
      ); // Show new notification
      setFirstTaskStartTime(null); // Reset first task start time when all tasks are completed
    }
  }, [tasks, currentTaskId, showNotification, language]); // Depend on tasks and currentTaskId

  // Reusable NumberInput component with custom arrows
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

    const handleChange = (e) => {
      const inputValue = e.target.value;
      if (inputValue === "") {
        onChange(0); // Treat empty string as 0
      } else {
        const parsedValue = parseInt(inputValue, 10);
        if (!isNaN(parsedValue)) {
          onChange(parsedValue);
        }
      }
    };

    const handleIncrement = () => {
      const numValue = value || 0; // Use current value, fallback to 0
      const newValue =
        max !== undefined && numValue + 1 > max ? max : numValue + 1;
      onChange(newValue);
    };

    const handleDecrement = () => {
      const numValue = value || 0; // Use current value, fallback to 0
      const newValue =
        min !== undefined && numValue - 1 < min ? min : numValue - 1;
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
          <span className="text-2xl sm:text-3xl">{icon}</span>
          <input
            type="number"
            id={id}
            className={`text-4xl sm:text-5xl font-extrabold ${
              darkMode ? "text-indigo-300" : "text-indigo-800"
            } w-20 sm:w-24 text-center !bg-transparent focus:outline-none py-1 sm:py-2 px-2 sm:px-3 !focus:bg-transparent transition-colors duration-300 custom-number-input`}
            value={value === 0 ? "" : value} // Display empty string if value is 0
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
                  : "bg-indigo-200 text-indigo-700"
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
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s-.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
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
          {((currentTask && currentTask.mode === "pomodoro") ||
            isIntervalRunning) && (
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
                {isIntervalRunning
                  ? translations[language].interTaskInterval
                  : pomodoroState === "focus"
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
                  {formatTime(displayTime).split(":")[0]}
                </div>
                <div
                  className={`text-4xl md:text-5xl font-extrabold transition-colors duration-300 leading-none`}
                  style={{ color: textColor }}
                >
                  {formatTime(displayTime).split(":")[1]}
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
          {firstTaskStartTime && (
            <p
              className={`text-xs sm:text-sm mt-1 sm:mt-2 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              } transition-colors duration-300`}
            >
              {translations[language].taskStartTimeLabel}:{" "}
              {new Date(firstTaskStartTime).toLocaleTimeString(language, {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}

          {/* Botões (abaixo de todo o conteúdo, centralizados) */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-8">
            <button
              onClick={async () => {
                // Inicia o contexto de áudio do Tone.js na primeira interação do usuário
                if (!isAudioContextStarted) {
                  try {
                    await Tone.start();
                    setIsAudioContextStarted(true);
                    console.log("Contexto de áudio Tone.js iniciado.");
                  } catch (error) {
                    console.error(
                      "Falha ao iniciar o contexto de áudio Tone.js:",
                      error
                    );
                    showNotification(
                      "Falha ao iniciar o áudio. Tente novamente.",
                      "error"
                    );
                    return; // Impede a execução se o áudio falhar
                  }
                }

                if (timerRunning || isIntervalRunning) {
                  // If either timer is running, pause
                  pauseTimer();
                } else {
                  let taskToHandle = null;
                  // Priority 1: Resume the currently selected task if it exists and is not completed
                  if (currentTaskId) {
                    const existingCurrentTask = tasks.find(
                      (t) => t.id === currentTaskId
                    );
                    if (existingCurrentTask && !existingCurrentTask.completed) {
                      taskToHandle = existingCurrentTask;
                    }
                  }

                  // Priority 2: If no current task to resume, find the first uncompleted task in the list
                  if (!taskToHandle) {
                    taskToHandle = findNextTaskInSequence(tasks, currentTaskId); // Use the new helper here
                  }

                  if (taskToHandle) {
                    // Determine if it's a resume or a new start
                    const isResuming =
                      taskToHandle.id === currentTaskId &&
                      (timeLeft > 0 || intervalTimeLeft > 0);
                    startTimerOrInterval(taskToHandle, isResuming);
                  } else if (intervalTimeLeft > 0) {
                    // If interval was paused, resume it
                    startTimerOrInterval(null, true); // Pass null to indicate resuming interval
                  } else {
                    console.log("Nenhuma tarefa para iniciar.");
                  }
                }
              }}
              className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-bold transition-all duration-200 ${
                timerRunning || isIntervalRunning
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={
                tasks.length === 0 &&
                !currentTaskId &&
                !isIntervalRunning &&
                timeLeft === 0 &&
                intervalTimeLeft === 0
              }
              title={
                timerRunning || isIntervalRunning
                  ? translations[language].pauseTimer
                  : translations[language].startTimer
              }
            >
              {timerRunning || isIntervalRunning ? (
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
                            if (
                              currentTaskId === task.id &&
                              (timerRunning || isIntervalRunning)
                            ) {
                              pauseTimer();
                            } else {
                              const isResuming =
                                task.id === currentTaskId &&
                                (timeLeft > 0 || intervalTimeLeft > 0);
                              startTimerOrInterval(task, isResuming);
                            }
                          }}
                          className={`p-0.5 sm:p-1 rounded-full text-white transition-all duration-200 ${
                            currentTaskId === task.id &&
                            (timerRunning || isIntervalRunning)
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                          disabled={
                            task.completed ||
                            ((timerRunning || isIntervalRunning) &&
                              currentTaskId !== null &&
                              currentTaskId !== task.id)
                          }
                          title={
                            currentTaskId === task.id &&
                            (timerRunning || isIntervalRunning)
                              ? translations[language].pauseTimer
                              : translations[language].startTimer
                          }
                        >
                          {currentTaskId === task.id &&
                          (timerRunning || isIntervalRunning) ? (
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
                    <div
                      className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 p-0.5 sm:p-1 rounded-full shadow-md"
                      style={{
                        backgroundColor: task.skipped ? "#F59E0B" : "#22C55E",
                      }} // Yellow for skipped, green for completed
                    >
                      {task.skipped ? (
                        // Render skip icon (double chevron)
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
                            d="M13 5l7 7-7 7M5 5l7 7-7 7"
                          />
                        </svg>
                      ) : (
                        // Render checkmark icon
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
                      )}
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

import React, { useState, useEffect, useRef, useCallback } from "react";

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
    pomodoroPhaseSkipped: "Phase Pomodoro {phase} sautée !",
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
  },
};

// Notification Component
const Notification = ({ message, type, onClose, darkMode }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setAnimationClass("animate-slide-in"); // Start slide-in animation
      const timer = setTimeout(() => {
        setAnimationClass("animate-slide-out"); // Start slide-out animation
        const clearTimer = setTimeout(() => onClose(), 500); // Wait for fade-out before clearing
        return () => clearTimeout(clearTimer);
      }, 3000); // Notification visible for 3 seconds before starting fade-out
    }
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
  const [isIntervalRunning, setIsIntervalRunning] = useState(0); // Indicates if the 5-minute interval is active
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

  const timerRef = useRef(null); // Reference for the main timer's setInterval
  const intervalTimerRef = useRef(null); // Reference for the interval timer's setInterval
  const draggedItem = useRef(null); // Reference for the item being dragged
  const dragOverItem = useRef(null); // Reference for the item being dragged over
  const progressCircleRef = useRef(null); // Reference for the SVG progress circle

  // New state for total global elapsed time
  const [totalGlobalElapsedTime, setTotalGlobalElapsedTime] = useState(0);
  // New state for total skipped time
  const [skippedTime, setSkippedTime] = useState(0);

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

  // Function to show notifications
  const showNotification = useCallback((message, type) => {
    setNotification({ message, type });
  }, []);

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
  }, [interTaskIntervalDuration]);

  // Durations for Pomodoro cycles in seconds (default values)
  const DEFAULT_POMODORO_FOCUS_DURATION = 25 * 60; // 25 minutes focus
  const DEFAULT_POMODORO_SHORT_BREAK_DURATION = 5 * 60; // 5 minutes short break
  const DEFAULT_POMODORO_LONG_BREAK_DURATION = 15 * 60; // 15 minutes long break
  // INTER_TASK_INTERVAL_DURATION is now a state: interTaskIntervalDuration * 60

  // Function to format total time in HH:MM
  const formatTotalTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
    }
    return `${minutes}min`;
  };

  // Function to add a new task
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

  // Function to delete a task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
    if (currentTaskId === id) {
      resetTimer();
      setCurrentTaskId(null);
    }
  };

  // Function to mark a task as complete
  const markTaskComplete = useCallback((id) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: true } : task
      )
    );
  }, []);

  // Function to pause the main timer
  const pauseTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    showNotification(translations[language].timerPaused, "paused");
  }, [showNotification, language]);

  // Function to reset the current task's timer (does not reset global times)
  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimerRunning(false);
    setTimeLeft(0);
    setPomodoroState("idle");
    setPomodoroCount(0);
    setIsIntervalRunning(false);
    clearInterval(intervalTimerRef.current);
    setIntervalTimeLeft(0);
    setCurrentTaskId(null); // Ensure no task is selected
    showNotification(translations[language].taskReset, "reset");
  }, [showNotification, language]);

  // Function to reset all times (global and current task)
  const resetAll = useCallback(() => {
    resetTimer(); // Reset current task and timer
    setTotalGlobalElapsedTime(0); // Reset global elapsed time
    setSkippedTime(0); // Reset skipped time
    // Reset completion status of all tasks
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, completed: false }))
    );
    showNotification(translations[language].allTasksReset, "reset");
  }, [resetTimer, showNotification, language]);

  // Function to start a specific task
  const startTask = useCallback(
    (task) => {
      // Do not call resetTimer here if you don't want global times to be reset
      // Just clear the current timer and set the new task
      clearInterval(timerRef.current);
      clearInterval(intervalTimerRef.current);
      setTimerRunning(false);
      setIsIntervalRunning(false);
      setTimeLeft(0); // Reset current task time
      setPomodoroState("idle"); // Reset Pomodoro state for the new task
      setPomodoroCount(0); // Reset Pomodoro counter for the new task

      setCurrentTaskId(task.id);
      if (task.mode === "time") {
        setTimeLeft(task.duration);
        setPomodoroState("idle");
      } else if (task.mode === "pomodoro") {
        // Use customizable focus duration of the task
        setTimeLeft(
          task.pomodoroFocusDuration || DEFAULT_POMODORO_FOCUS_DURATION
        );
        setPomodoroState("focus");
        setPomodoroCount(0); // Reset Pomodoro counter for the new task
      }
      setTimerRunning(true);
      showNotification(translations[language].timerStarted, "started");
    },
    [showNotification, language, DEFAULT_POMODORO_FOCUS_DURATION]
  );

  // Main effect for task timer (Free Time and Pomodoro)
  useEffect(() => {
    if (timerRunning && !isIntervalRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timerRef.current);
            setTimerRunning(false);

            const currentTask = tasks.find((task) => task.id === currentTaskId);

            if (currentTask && currentTask.mode === "time") {
              markTaskComplete(currentTaskId);
              showNotification(
                translations[language].taskCompleted,
                "completed"
              );

              // Check if there are any uncompleted tasks left after this one
              const remainingUncompletedTasks = tasks.filter(
                (task) => !task.completed && task.id !== currentTaskId
              );

              if (remainingUncompletedTasks.length > 0) {
                setIsIntervalRunning(true);
                setIntervalTimeLeft(interTaskIntervalDuration * 60);
              } else {
                // No more uncompleted tasks, stop everything
                setCurrentTaskId(null);
                setTimeLeft(0);
                setPomodoroState("idle");
                setTimerRunning(false); // Ensure main timer is off
                clearInterval(timerRef.current);
                clearInterval(intervalTimerRef.current); // Ensure interval timer is also off
              }
            } else if (currentTask && currentTask.mode === "pomodoro") {
              let nextPomodoroState;
              let nextTime;
              let newPomodoroCount = pomodoroCount;

              // Get customizable durations of the current task
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
                newPomodoroCount = pomodoroCount + 1; // Increment completed focus counter
                showNotification(
                  translations[language].focusSessionEnded,
                  "focus-ended"
                );
                if (
                  newPomodoroCount % currentTask.pomodoroFocusSessions ===
                  0
                ) {
                  // If focus cycle completed
                  nextPomodoroState = "longBreak";
                  nextTime = longBreakDuration;
                } else {
                  nextPomodoroState = "shortBreak";
                  nextTime = shortBreakDuration;
                }
              } else if (pomodoroState === "shortBreak") {
                showNotification(
                  translations[language].shortBreakEnded,
                  "short-break-ended"
                );
                nextPomodoroState = "focus";
                nextTime = focusDuration;
              } else if (pomodoroState === "longBreak") {
                markTaskComplete(currentTaskId);
                showNotification(
                  translations[language].longBreakEnded,
                  "long-break-ended"
                );
                nextPomodoroState = "idle";
                nextTime = 0; // No time for idle state

                // After a long Pomodoro break, try to start the next task in sequence
                const nextTaskInSequence = tasks.find(
                  (task) => !task.completed && task.id !== currentTaskId
                );
                if (nextTaskInSequence) {
                  startTask(nextTaskInSequence);
                } else {
                  // If no more uncompleted tasks AFTER the current one,
                  // check if there are ANY uncompleted tasks in the entire list (e.g., newly added ones)
                  const firstUncompletedTaskOverall = tasks.find(
                    (task) => !task.completed
                  );
                  if (firstUncompletedTaskOverall) {
                    startTask(firstUncompletedTaskOverall);
                  } else {
                    setCurrentTaskId(null); // Truly no uncompleted tasks left
                    setTimeLeft(0); // Ensure timer is reset if no tasks
                    setPomodoroState("idle"); // Ensure state is idle
                  }
                }
                return 0; // Reset time to 0 and don't set as running again
              }

              setPomodoroCount(newPomodoroCount);
              setPomodoroState(nextPomodoroState);
              setTimeLeft(nextTime);
              if (nextPomodoroState !== "idle") {
                // Only set as running if not end of cycle
                setTimerRunning(true);
              } else {
                setTimerRunning(false); // Ensure timer stops if idle
              }
            }
            return 0; // Reset time to 0 for a moment before the next state
          }
          return prevTime - 1;
        });
        setTotalGlobalElapsedTime((prev) => prev + 1); // Increment global elapsed time every second
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [
    timerRunning,
    isIntervalRunning,
    currentTaskId,
    tasks,
    pomodoroState,
    pomodoroCount,
    markTaskComplete,
    startTask,
    showNotification,
    language,
    interTaskIntervalDuration,
    DEFAULT_POMODORO_FOCUS_DURATION,
    DEFAULT_POMODORO_LONG_BREAK_DURATION,
    DEFAULT_POMODORO_SHORT_BREAK_DURATION,
  ]);

  // Effect to manage the 5-minute interval timer between tasks
  useEffect(() => {
    if (isIntervalRunning) {
      intervalTimerRef.current = setInterval(() => {
        setIntervalTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalTimerRef.current);
            setIsIntervalRunning(false);
            showNotification(
              translations[language].interTaskBreakEnded,
              "completed"
            ); // Notification for inter-task break end

            // After inter-task interval, try to start the next task in sequence
            const nextTaskInSequence = tasks
              .filter((task) => !task.completed)
              .find((task) => task.id !== currentTaskId); // Filter out current task if it was completed
            if (nextTaskInSequence) {
              startTask(nextTaskInSequence);
            } else {
              // If no more uncompleted tasks AFTER the current one,
              // check if there are ANY uncompleted tasks in the entire list (e.g., newly added ones)
              const firstUncompletedTaskOverall = tasks.find(
                (task) => !task.completed
              );
              if (firstUncompletedTaskOverall) {
                startTask(firstUncompletedTaskOverall);
              } else {
                setCurrentTaskId(null); // Truly no uncompleted tasks left
                setTimeLeft(0); // Ensure timer is reset if no tasks
                setPomodoroState("idle"); // Ensure state is idle
              }
            }
            return 0;
          }
          return prevTime - 1;
        });
        setTotalGlobalElapsedTime((prev) => prev + 1); // Increment global elapsed time every second of the interval
      }, 1000);
    } else {
      clearInterval(intervalTimerRef.current);
    }
    return () => clearInterval(intervalTimerRef.current);
  }, [
    isIntervalRunning,
    tasks,
    currentTaskId,
    startTask,
    showNotification,
    language,
    interTaskIntervalDuration,
  ]);

  // Function to skip current phase
  const skipCurrentPhase = useCallback(() => {
    clearInterval(timerRef.current);
    clearInterval(intervalTimerRef.current);
    setTimerRunning(false);
    setIsIntervalRunning(false);

    let timeToSkip = 0;
    if (isIntervalRunning) {
      timeToSkip = intervalTimeLeft;
      showNotification(translations[language].interTaskBreakSkipped, "skipped");
      // If in inter-task interval, skip to the next task
      const nextTaskInSequence = tasks
        .filter((task) => !task.completed)
        .find((task) => task.id !== currentTaskId); // Filter out current task if it was completed
      if (nextTaskInSequence) {
        startTask(nextTaskInSequence);
      } else {
        const firstUncompletedTaskOverall = tasks.find(
          (task) => !task.completed
        );
        if (firstUncompletedTaskOverall) {
          startTask(firstUncompletedTaskOverall);
        } else {
          setCurrentTaskId(null);
          setTimeLeft(0);
          setPomodoroState("idle");
        }
      }
    } else if (currentTaskId) {
      const currentTask = tasks.find((task) => task.id === currentTaskId);
      if (currentTask) {
        // Ensure currentTask exists
        timeToSkip = timeLeft;
        if (currentTask.mode === "time") {
          showNotification(translations[language].taskSkipped, "skipped");
          markTaskComplete(currentTaskId); // Mark as complete even if skipped

          // Check if there are any uncompleted tasks left after this one
          const remainingUncompletedTasks = tasks.filter(
            (task) => !task.completed && task.id !== currentTaskId
          );

          if (remainingUncompletedTasks.length > 0) {
            setIsIntervalRunning(true);
            setIntervalTimeLeft(interTaskIntervalDuration * 60); // Use dynamic interval
          } else {
            // No more uncompleted tasks, stop everything
            setCurrentTaskId(null);
            setTimeLeft(0);
            setPomodoroState("idle");
            setTimerRunning(false); // Ensure main timer is off
            clearInterval(timerRef.current);
            clearInterval(intervalTimerRef.current); // Ensure interval timer is also off
          }
        } else if (currentTask.mode === "pomodoro") {
          let phaseName = "";
          switch (pomodoroState) {
            case "focus":
              phaseName = translations[language].focus; // Use translated phase name
              break;
            case "shortBreak":
              phaseName = translations[language].shortBreak; // Use translated phase name
              break;
            case "longBreak":
              phaseName = translations[language].longBreak; // Use translated phase name
              break;
            default: // Added default case
              phaseName = "unknown phase";
              break;
          }
          showNotification(
            translations[language].pomodoroPhaseSkipped.replace(
              "{phase}",
              phaseName
            ),
            "skipped"
          );

          const totalFocusSessions = currentTask.pomodoroFocusSessions;

          // Get customizable durations of the current task
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
            // If in focus, advance to the next Pomodoro break
            const newPomodoroCount = pomodoroCount + 1; // Simulate completion of current focus
            setPomodoroCount(newPomodoroCount);

            if (newPomodoroCount % totalFocusSessions === 0) {
              setTimeLeft(longBreakDuration);
              setPomodoroState("longBreak");
            } else {
              setTimeLeft(shortBreakDuration);
              setPomodoroState("shortBreak");
            }
            setTimerRunning(true); // Start timer for the new Pomodoro state
          } else if (pomodoroState === "shortBreak") {
            // If in short break, ALWAYS advance to the next focus.
            setTimeLeft(focusDuration);
            setPomodoroState("focus");
            setTimerRunning(true);
            // pomodoroCount does not change here, as a focus session has not yet been completed.
          } else if (pomodoroState === "longBreak") {
            // If in long break, mark task as complete and end Pomodoro cycle
            markTaskComplete(currentTaskId);
            setPomodoroCount(0);
            setPomodoroState("idle");
            // After a long Pomodoro break, try to start the next task in sequence
            const nextTaskInSequence = tasks
              .filter((task) => !task.completed)
              .find((task) => task.id !== currentTaskId); // Filter out current task if it was completed
            if (nextTaskInSequence) {
              startTask(nextTaskInSequence);
            } else {
              const firstUncompletedTaskOverall = tasks.find(
                (task) => !task.completed
              );
              if (firstUncompletedTaskOverall) {
                startTask(firstUncompletedTaskOverall);
              } else {
                setCurrentTaskId(null);
                setTimeLeft(0);
              }
            }
          }
        }
      }
    }
    setSkippedTime((prev) => prev + timeToSkip); // Accumulate skipped time
  }, [
    currentTaskId,
    isIntervalRunning,
    tasks,
    pomodoroState,
    pomodoroCount,
    markTaskComplete,
    startTask,
    timeLeft,
    showNotification,
    language,
    interTaskIntervalDuration,
    intervalTimeLeft,
    DEFAULT_POMODORO_FOCUS_DURATION,
    DEFAULT_POMODORO_LONG_BREAK_DURATION,
    DEFAULT_POMODORO_SHORT_BREAK_DURATION,
  ]);

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

  // Function to determine current phase emoji
  const getCurrentPhaseEmoji = () => {
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
  };

  // Function to calculate total estimated time of all tasks
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
        totalSeconds += longBreakDur; // Assume there's always a long break at the end of the complete cycle
      }
      // Add inter-task interval time, except for the last task
      if (index < tasks.length - 1) {
        totalSeconds += interTaskIntervalDuration * 60; // Use dynamic interval
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

  // Calculate total remaining time (current task time + future tasks time)
  const totalRemainingTime =
    totalEstimatedTime - (totalGlobalElapsedTime + skippedTime);

  // Calculate estimated completion time
  const estimatedCompletionDate = new Date(
    Date.now() + totalRemainingTime * 1000
  );
  const estimatedCompletionTime = estimatedCompletionDate.toLocaleTimeString(
    language,
    { hour: "2-digit", minute: "2-digit" }
  );

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
      clearInterval(timerRef.current);
      clearInterval(intervalTimerRef.current);
      showNotification(
        translations[language].allTasksCompletedNotification,
        "all-tasks-completed"
      ); // Show new notification
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
    const handleIncrement = () => {
      onChange((prev) =>
        max !== undefined && prev + 1 > max ? max : prev + 1
      );
    };

    const handleDecrement = () => {
      onChange((prev) =>
        min !== undefined && prev - 1 < min ? min : prev - 1
      );
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
          {/* Use the icon prop directly */}
          <input
            type="number"
            id={id}
            className={`text-4xl sm:text-5xl font-extrabold ${
              darkMode ? "text-indigo-300" : "text-indigo-800"
            } w-20 sm:w-24 text-center !bg-transparent focus:outline-none py-1 sm:py-2 px-2 sm:px-3 !focus:bg-transparent transition-colors duration-300 custom-number-input`}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
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
      {/* Global styles for hiding number input arrows */}
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
              {/* Three vertical dots icon */}
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

        {/* Options Modal */}
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
                title="Close options"
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

              {/* Language Selection */}
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

              {/* Inter-Task Interval Setting */}
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
                  icon="⏱️" // Clock icon for duration
                />
              </div>

              {/* Save/Close button - already handled by direct state updates and close button */}
            </div>
          </div>
        )}

        {/* Form to add tasks */}
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
                icon="⏱️" // Clock icon for duration
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
                {/* Focus Sessions */}
                <NumberInput
                  id="pomodoroFocusSessions"
                  label={translations[language].focusSessions}
                  value={pomodoroCustomFocusSessions}
                  onChange={setPomodoroCustomFocusSessions}
                  min={1}
                  unit="sessions"
                  darkMode={darkMode}
                  translationKey="focusSessions"
                  icon="🎯" // Target icon for focus
                />

                {/* Focus Duration */}
                <NumberInput
                  id="customFocusDuration"
                  label={translations[language].focusDurationMin}
                  value={customFocusDurationInput}
                  onChange={setCustomFocusDurationInput}
                  min={1}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="focusDurationMin"
                  icon="⏱️" // Clock icon for duration
                />

                {/* Short Break Duration */}
                <NumberInput
                  id="customShortBreakDuration"
                  label={translations[language].shortBreakMin}
                  value={customShortBreakDurationInput}
                  onChange={setCustomShortBreakDurationInput}
                  min={1}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="shortBreakMin"
                  icon="☕" // Coffee icon for short break
                />

                {/* Long Break Duration */}
                <NumberInput
                  id="customLongBreakDuration"
                  label={translations[language].longBreakMin}
                  value={customLongBreakDurationInput}
                  onChange={setCustomLongBreakDurationInput}
                  min={1}
                  unit="min"
                  darkMode={darkMode}
                  translationKey="longBreakMin"
                  icon="🛌" // Bed icon for long break
                />
              </div>
            </>
          )}
        </form>

        {/* Timer Display */}
        <div
          className={`text-center mb-6 sm:mb-8 p-4 sm:p-6 rounded-lg relative flex flex-col ${
            darkMode ? "border border-gray-700" : "border border-gray-200"
          } transition-colors duration-300`}
        >
          {/* Task Name (top-left absolute) */}
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

          {/* Pomodoro State and Emoji (below title, aligned left) */}
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

          {/* Main content: Timer Circle + Times Column */}
          <div className="flex flex-col md:flex-row items-center justify-center mt-20 sm:mt-28">
            {/* Main Timer Circle (left) */}
            <div className="relative w-40 h-40 sm:w-48 sm:h-48 mb-4 md:mb-0 md:mr-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={
                    darkMode ? "#4a5568" : "#e0e0e0"
                  } /* Background circle color */
                  strokeWidth="5"
                />
                {/* Animated progress circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={strokeColor} /* Progress color (dynamic) */
                  strokeWidth="5"
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)" /* Start stroke at the top */
                  style={{
                    transition: "stroke-dashoffset 1s linear",
                  }} /* Smooth transition */
                  ref={progressCircleRef}
                />
              </svg>
              {/* Digital time display, centered over SVG */}
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

            {/* Times Grid (right) */}
            <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-4 md:mt-0">
              {/* Elapsed Card */}
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

              {/* Remaining Card */}
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

              {/* Estimated Card */}
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

              {/* Skipped Time Card */}
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
          {/* Estimated Completion Time Text */}
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

          {/* Buttons (below all content, centered) */}
          <div className="flex justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-8">
            <button
              onClick={() => {
                if (timerRunning) {
                  pauseTimer();
                } else {
                  // Find the currently selected task
                  let taskToStart = tasks.find((task) => !task.completed); // Always try to find the first uncompleted task if none is current or current is done

                  if (taskToStart) {
                    // If the task to start is different from the current task OR if the current task is completed,
                    // call startTask to initialize correctly.
                    if (
                      taskToStart.id !== currentTaskId ||
                      (currentTask && currentTask.completed)
                    ) {
                      startTask(taskToStart);
                    } else {
                      setTimerRunning(true); // Resume the current (uncompleted) task
                      showNotification(
                        translations[language].timerResumed,
                        "started"
                      ); // Notification for resuming
                    }
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
              onClick={resetTimer} // Now resets only the current task
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold transition-all duration-200"
              disabled={
                !currentTaskId &&
                !isIntervalRunning &&
                timeLeft === 0 &&
                intervalTimeLeft === 0
              }
              title={translations[language].restartTask}
            >
              {/* Reset icon (circular refresh arrow) */}
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
              disabled={!currentTaskId && !isIntervalRunning} // Disable if no task or interval is active
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
              onClick={resetAll} // New button to reset everything
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

        {/* Task List */}
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
                  onDragOver={(e) => e.preventDefault()} // Allow drop
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
                    {/* Action buttons in top-right corner */}
                    <div className="flex space-x-1 sm:space-x-2">
                      {!task.completed && (
                        <button
                          onClick={() => {
                            if (currentTaskId === task.id) {
                              if (timerRunning) {
                                pauseTimer();
                              } else {
                                setTimerRunning(true); // Resume
                                showNotification(
                                  translations[language].timerResumed,
                                  "started"
                                );
                              }
                            } else {
                              startTask(task); // Start this task (will stop any other running task)
                            }
                          }}
                          className={`p-0.5 sm:p-1 rounded-full text-white transition-all duration-200 ${
                            currentTaskId === task.id && timerRunning
                              ? "bg-red-500 hover:bg-red-600" // Pause color
                              : "bg-green-500 hover:bg-green-600" // Play color
                          }`}
                          disabled={task.completed} // Only disable if the task is completed
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
                        title="Delete Task"
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

                  {/* Completion check icon (bottom-right) */}
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

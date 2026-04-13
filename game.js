(() => {
  "use strict";

  const PAIR_CONTEXTS = [
    { a: "сегодня дождь", b: "завтра будет снег" },
    { a: "я выучил правила записи выражений", b: "я решу упражнение правильно" },
    { a: "урок по информатике начался", b: "я открыл тетрадь" },
    { a: "компьютер включён", b: "интернет работает" },
    { a: "я сделал домашнее задание", b: "учитель поставит зачёт" },
    { a: "в классе тихо", b: "мы слышим объяснение" },
    { a: "я нажал кнопку Проверить", b: "система покажет результат" },
    { a: "мы изучили конъюнкцию", b: "мы изучили дизъюнкцию" },
    { a: "звонок прозвенел", b: "перемена началась" },
    { a: "я повторил таблицу истинности", b: "я не допущу ошибку" },
    { a: "лампа горит", b: "комната освещена" },
    { a: "я собрал выражение", b: "ответ принят" },
  ];

  const TRIPLE_CONTEXTS = [
    { a: "я прочитал условие", b: "я выделил переменные", c: "я правильно записал формулу" },
    { a: "мы открыли учебник", b: "мы выписали правила", c: "мы решили номер" },
    { a: "выпал снег", b: "подул ветер", c: "на улице холодно" },
    { a: "сервер доступен", b: "база данных отвечает", c: "сайт открыт" },
    { a: "я внимательно слушаю", b: "я задаю вопросы", c: "я понимаю тему" },
    { a: "принтер включён", b: "есть бумага", c: "документ распечатан" },
    { a: "мы провели опыт", b: "мы собрали данные", c: "мы сделали вывод" },
    { a: "родители дома", b: "дома есть продукты", c: "мы приготовим ужин" },
  ];

  const TASK_BANK = buildTaskBank();

  function buildTaskBank() {
    const tasks = [];
    let nextId = 1;

    const add = (prompt, target) => {
      tasks.push({ id: nextId, prompt, target });
      nextId += 1;
    };

    add(
      "Пусть a: «Сегодня дождь», b: «Завтра будет снег». Составь формулу для высказывания: «Если сегодня дождь, то завтра будет снег».",
      "a → b",
    );

    for (const context of PAIR_CONTEXTS) {
      const a = normalizePhrase(context.a);
      const b = normalizePhrase(context.b);
      const pair = formatPairMapping(a, b);
      add(`${pair} Составь формулу для высказывания: «${capitalize(a)} и ${b}».`, "a ∧ b");
      add(`${pair} Составь формулу для высказывания: «${capitalize(a)} или ${b}».`, "a ∨ b");
      add(`${pair} Составь формулу для высказывания: «Неверно, что ${a}».`, "¬a");
      add(`${pair} Составь формулу для высказывания: «${capitalize(a)} и неверно, что ${b}».`, "a ∧ ¬b");
      add(`${pair} Составь формулу для высказывания: «Если ${a}, то ${b}».`, "a → b");
      add(`${pair} Составь формулу для высказывания: «${capitalize(a)} тогда и только тогда, когда ${b}».`, "a ↔ b");
      add(`${pair} Составь формулу для высказывания: «Либо ${a}, либо ${b}, но не одновременно».`, "a ⊕ b");
    }

    for (const context of TRIPLE_CONTEXTS) {
      const a = normalizePhrase(context.a);
      const b = normalizePhrase(context.b);
      const c = normalizePhrase(context.c);
      const triple = formatTripleMapping(a, b, c);

      add(
        `${triple} Составь формулу для высказывания: «${capitalize(a)}, и при этом верно хотя бы одно из двух: ${b} или ${c}».`,
        "a ∧ (b ∨ c)",
      );
      add(
        `${triple} Составь формулу для высказывания: «${capitalize(c)}, и одновременно верно хотя бы одно из двух: ${a} или ${b}».`,
        "(a ∨ b) ∧ c",
      );
      add(`${triple} Составь формулу для высказывания: «Неверно, что одновременно ${a} и ${b}».`, "¬(a ∧ b)");
      add(`${triple} Составь формулу для высказывания: «Если ${a} и ${b}, то ${c}».`, "(a ∧ b) → c");
      add(`${triple} Составь формулу для высказывания: «Если ${a}, то ${c} или ${b}».`, "a → (b ∨ c)");
      add(
        `${triple} Составь формулу для высказывания: «${capitalize(a)} тогда и только тогда, когда ${b}, и при этом неверно, что ${c}».`,
        "(a ↔ b) ∧ ¬c",
      );
      add(
        `${triple} Составь формулу для высказывания: «Если неверно, что ${a}, то одновременно ${b} и ${c}».`,
        "¬a → (b ∧ c)",
      );
      add(
        `${triple} Составь формулу для высказывания: «Верно хотя бы одно из двух: ${a} или ${b}; и одновременно верно, что либо неверно, что ${b}, либо ${c}».`,
        "(a ∨ b) ∧ (¬b ∨ c)",
      );
      add(
        `${triple} Составь формулу для высказывания: «Либо одновременно ${a} и неверно, что ${b}, либо одновременно неверно, что ${a} и ${c}».`,
        "(a ∧ ¬b) ∨ (¬a ∧ c)",
      );
      add(
        `${triple} Составь формулу для высказывания: «Неверно, что одновременно ${a} и выполняется хотя бы одно из двух: ${b} или ${c}».`,
        "¬(a ∧ (b ∨ c))",
      );
    }

    add("Запиши выражение: «(a и b) или (a и c)».", "(a ∧ b) ∨ (a ∧ c)");
    add("Запиши выражение: «(не a или b) и (a или c)».", "(¬a ∨ b) ∧ (a ∨ c)");
    add("Запиши выражение: «(a ⊕ b) и не c».", "(a ⊕ b) ∧ ¬c");
    add("Запиши выражение: «(a или не b) равносильно (c или a)».", "(a ∨ ¬b) ↔ (c ∨ a)");

    return tasks;
  }

  function formatPairMapping(a, b) {
    return `Пусть a: «${capitalize(a)}», b: «${capitalize(b)}».`;
  }

  function formatTripleMapping(a, b, c) {
    return `Пусть a: «${capitalize(a)}», b: «${capitalize(b)}», c: «${capitalize(c)}».`;
  }

  function normalizePhrase(text) {
    if (!text) {
      return text;
    }
    return text.trim().replace(/[.?!]+$/u, "");
  }

  function capitalize(text) {
    if (!text) {
      return text;
    }
    return text[0].toUpperCase() + text.slice(1);
  }

  const OP_INFO = {
    "¬": { precedence: 5, assoc: "right", arity: 1 },
    "∧": { precedence: 4, assoc: "left", arity: 2 },
    "∨": { precedence: 3, assoc: "left", arity: 2 },
    "⊕": { precedence: 3, assoc: "left", arity: 2 },
    "→": { precedence: 2, assoc: "right", arity: 2 },
    "↔": { precedence: 1, assoc: "left", arity: 2 },
  };

  const MODES = {
    practice: "Тренажёр",
    quiz: "Викторина на время",
    test: "Тест на 10",
  };

  const state = {
    mode: "practice",
    inputTokens: [],
    currentTask: null,
    practice: {
      attempted: 0,
      correct: 0,
    },
    quiz: {
      duration: 90,
      timeLeft: 90,
      attempted: 0,
      correct: 0,
      running: false,
      timerId: null,
    },
    test: {
      running: false,
      finished: false,
      tasks: [],
      index: 0,
      attempted: 0,
      correct: 0,
      errors: 0,
    },
  };

  const elements = {
    modeButtons: Array.from(document.querySelectorAll(".mode-btn")),
    tokenButtons: Array.from(document.querySelectorAll(".key[data-token]")),
    modeName: document.getElementById("modeName"),
    timerValue: document.getElementById("timerValue"),
    progressValue: document.getElementById("progressValue"),
    scoreValue: document.getElementById("scoreValue"),
    taskPrompt: document.getElementById("taskPrompt"),
    output: document.getElementById("expressionOutput"),
    feedback: document.getElementById("feedback"),
    checkBtn: document.getElementById("checkBtn"),
    clearBtn: document.getElementById("clearBtn"),
    backBtn: document.getElementById("backBtn"),
    nextBtn: document.getElementById("nextBtn"),
    startRoundBtn: document.getElementById("startRoundBtn"),
    resetModeBtn: document.getElementById("resetModeBtn"),
  };

  init();

  function init() {
    for (const task of TASK_BANK) {
      task.targetRpn = compileExpression(task.target);
    }

    bindEvents();
    setMode("practice");
  }

  function bindEvents() {
    for (const button of elements.modeButtons) {
      button.addEventListener("click", () => {
        setMode(button.dataset.mode);
      });
    }

    for (const button of elements.tokenButtons) {
      button.addEventListener("click", () => appendToken(button.dataset.token));
    }

    elements.checkBtn.addEventListener("click", checkCurrentAnswer);
    elements.clearBtn.addEventListener("click", clearInput);
    elements.backBtn.addEventListener("click", backspaceToken);
    elements.nextBtn.addEventListener("click", handleNextClick);
    elements.startRoundBtn.addEventListener("click", startModeRound);
    elements.resetModeBtn.addEventListener("click", resetCurrentMode);

    document.addEventListener("keydown", handleKeyboardInput);
  }

  function handleKeyboardInput(event) {
    if (event.altKey || event.ctrlKey || event.metaKey) {
      return;
    }

    const { key } = event;

    if (["a", "b", "c", "(", ")"].includes(key.toLowerCase())) {
      appendToken(key.toLowerCase());
      event.preventDefault();
      return;
    }

    const keyToToken = {
      "!": "¬",
      "&": "∧",
      "|": "∨",
      "^": "⊕",
      ">": "→",
      "=": "↔",
    };

    if (keyToToken[key]) {
      appendToken(keyToToken[key]);
      event.preventDefault();
      return;
    }

    if (key === "Backspace") {
      backspaceToken();
      event.preventDefault();
      return;
    }

    if (key === "Delete") {
      clearInput();
      event.preventDefault();
      return;
    }

    if (key === "Enter") {
      checkCurrentAnswer();
      event.preventDefault();
    }
  }

  function setMode(mode) {
    if (!MODES[mode]) {
      return;
    }

    stopQuizTimer();
    state.mode = mode;
    state.inputTokens = [];
    state.currentTask = null;

    for (const button of elements.modeButtons) {
      button.classList.toggle("active", button.dataset.mode === mode);
    }

    if (mode === "practice") {
      state.practice.attempted = 0;
      state.practice.correct = 0;
      setFeedback("Тренажёр запущен. Собери выражение и нажми «Проверить».", "");
      loadPracticeTask();
    } else if (mode === "quiz") {
      primeQuizMode();
    } else {
      primeTestMode();
    }

    renderAll();
  }

  function primeQuizMode() {
    state.quiz.timeLeft = state.quiz.duration;
    state.quiz.attempted = 0;
    state.quiz.correct = 0;
    state.quiz.running = false;
    state.currentTask = null;

    setPrompt("Нажми «Старт раунда». За 90 секунд собери как можно больше правильных выражений.");
    setFeedback("Викторина ждёт запуска.", "");
  }

  function primeTestMode() {
    state.test.running = false;
    state.test.finished = false;
    state.test.tasks = [];
    state.test.index = 0;
    state.test.attempted = 0;
    state.test.correct = 0;
    state.test.errors = 0;
    state.currentTask = null;

    setPrompt("Нажми «Старт раунда», чтобы пройти тест из 10 заданий.");
    setFeedback("Тест готов к старту.", "");
  }

  function startModeRound() {
    if (state.mode === "practice") {
      loadPracticeTask();
      clearInput();
      setFeedback("Новое задание в тренажёре.", "");
      renderAll();
      return;
    }

    if (state.mode === "quiz") {
      startQuizRound();
      return;
    }

    startTestRound();
  }

  function resetCurrentMode() {
    if (state.mode === "practice") {
      state.practice.attempted = 0;
      state.practice.correct = 0;
      loadPracticeTask();
      clearInput();
      setFeedback("Результаты тренажёра сброшены.", "");
      renderAll();
      return;
    }

    if (state.mode === "quiz") {
      stopQuizTimer();
      primeQuizMode();
      clearInput();
      renderAll();
      return;
    }

    primeTestMode();
    clearInput();
    renderAll();
  }

  function startQuizRound() {
    stopQuizTimer();

    state.quiz.timeLeft = state.quiz.duration;
    state.quiz.attempted = 0;
    state.quiz.correct = 0;
    state.quiz.running = true;
    state.inputTokens = [];
    state.currentTask = pickRandomTask();

    setFeedback("Время пошло!", "success");

    state.quiz.timerId = window.setInterval(() => {
      state.quiz.timeLeft -= 1;
      if (state.quiz.timeLeft <= 0) {
        finishQuizRound();
      }
      renderStatus();
    }, 1000);

    renderAll();
  }

  function finishQuizRound() {
    stopQuizTimer();
    state.quiz.running = false;
    state.currentTask = null;
    state.inputTokens = [];

    const attempts = state.quiz.attempted;
    const correct = state.quiz.correct;
    const percent = attempts > 0 ? Math.round((correct / attempts) * 100) : 0;

    setPrompt("Раунд завершён. Хочешь ещё? Нажми «Старт раунда».");
    setFeedback(
      `Викторина завершена: ${correct} верных из ${attempts} попыток (${percent}%).`,
      correct > 0 ? "success" : "error",
    );

    renderAll();
  }

  function stopQuizTimer() {
    if (state.quiz.timerId !== null) {
      window.clearInterval(state.quiz.timerId);
      state.quiz.timerId = null;
    }
  }

  function startTestRound() {
    state.test.running = true;
    state.test.finished = false;
    state.test.tasks = sampleUniqueTasks(10);
    state.test.index = 0;
    state.test.attempted = 0;
    state.test.correct = 0;
    state.test.errors = 0;

    state.currentTask = state.test.tasks[0];
    state.inputTokens = [];

    setFeedback("Тест начался. У тебя 10 заданий.", "success");

    renderAll();
  }

  function finishTestRound() {
    state.test.running = false;
    state.test.finished = true;

    const errors = state.test.errors;
    const gradeMessage = getGradeMessage(errors);
    const style = errors <= 5 ? "success" : "error";

    state.currentTask = null;
    state.inputTokens = [];

    setPrompt("Тест завершён. Можно пройти заново в этом же режиме.");
    setFeedback(`Ошибок: ${errors} из 10. ${gradeMessage}`, style);

    renderAll();
  }

  function getGradeMessage(errors) {
    if (errors <= 1) {
      return "Пять! Умница!";
    }
    if (errors <= 3) {
      return "Четверка. Ты молодец!";
    }
    if (errors <= 5) {
      return "Тройка :с";
    }
    return "Пересдавай...";
  }

  function checkCurrentAnswer() {
    if (!state.currentTask) {
      if (state.mode === "quiz") {
        setFeedback("Сначала запусти викторину кнопкой «Старт раунда».", "error");
      } else if (state.mode === "test") {
        setFeedback("Сначала запусти тест кнопкой «Старт раунда».", "error");
      } else {
        setFeedback("Нажми «Новое задание», чтобы получить выражение.", "error");
      }
      return;
    }

    if (state.inputTokens.length === 0) {
      setFeedback("Собери выражение кнопками перед проверкой.", "error");
      return;
    }

    const expression = state.inputTokens.join(" ");

    let userRpn;
    try {
      userRpn = compileExpression(expression);
    } catch (error) {
      setFeedback(`Ошибка записи: ${error.message}`, "error");
      return;
    }

    const isCorrect = areEquivalent(userRpn, state.currentTask.targetRpn);

    if (state.mode === "practice") {
      handlePracticeResult(isCorrect);
      return;
    }

    if (state.mode === "quiz") {
      handleQuizResult(isCorrect);
      return;
    }

    handleTestResult(isCorrect);
  }

  function handlePracticeResult(isCorrect) {
    state.practice.attempted += 1;

    if (isCorrect) {
      state.practice.correct += 1;
      setFeedback("Верно! Отличная запись.", "success");
    } else {
      setFeedback(`Не совсем. Один из верных вариантов: ${state.currentTask.target}`, "error");
    }

    renderAll();
  }

  function handleQuizResult(isCorrect) {
    if (!state.quiz.running) {
      setFeedback("Викторина не запущена.", "error");
      return;
    }

    state.quiz.attempted += 1;

    if (isCorrect) {
      state.quiz.correct += 1;
      setFeedback("Верно! +1 очко.", "success");
    } else {
      setFeedback(`Ошибка. Верный вариант: ${state.currentTask.target}`, "error");
    }

    state.inputTokens = [];
    state.currentTask = pickRandomTask(state.currentTask.id);

    renderAll();
  }

  function handleTestResult(isCorrect) {
    if (!state.test.running) {
      setFeedback("Тест сейчас не запущен.", "error");
      return;
    }

    state.test.attempted += 1;
    const questionNumber = state.test.index + 1;

    if (isCorrect) {
      state.test.correct += 1;
      setFeedback(`Задание ${questionNumber}: верно.`, "success");
    } else {
      state.test.errors += 1;
      setFeedback(`Задание ${questionNumber}: ошибка. Верный вариант: ${state.currentTask.target}`, "error");
    }

    if (state.test.index >= 9) {
      finishTestRound();
      return;
    }

    state.test.index += 1;
    state.currentTask = state.test.tasks[state.test.index];
    state.inputTokens = [];

    renderAll();
  }

  function handleNextClick() {
    if (state.mode !== "practice") {
      return;
    }

    loadPracticeTask(state.currentTask ? state.currentTask.id : null);
    clearInput();
    setFeedback("Следующее задание готово.", "");
    renderAll();
  }

  function loadPracticeTask(excludeId = null) {
    state.currentTask = pickRandomTask(excludeId);
  }

  function pickRandomTask(excludeId = null) {
    let pool = TASK_BANK;

    if (excludeId !== null && TASK_BANK.length > 1) {
      pool = TASK_BANK.filter((task) => task.id !== excludeId);
    }

    const index = Math.floor(Math.random() * pool.length);
    return pool[index];
  }

  function sampleUniqueTasks(count) {
    const shuffled = shuffle(TASK_BANK.slice());
    return shuffled.slice(0, Math.min(count, shuffled.length));
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function appendToken(token) {
    state.inputTokens.push(token);
    renderOutput();
  }

  function backspaceToken() {
    state.inputTokens.pop();
    renderOutput();
  }

  function clearInput() {
    state.inputTokens = [];
    renderOutput();
  }

  function renderAll() {
    renderPrompt();
    renderOutput();
    renderStatus();
    renderControls();
  }

  function renderPrompt() {
    if (state.currentTask) {
      setPrompt(state.currentTask.prompt);
      return;
    }

    if (state.mode === "practice") {
      setPrompt("Запиши выражение и нажми «Проверить». Если хочешь другое — «Следующее». ");
      return;
    }

    if (state.mode === "quiz") {
      setPrompt("Нажми «Старт раунда». За 90 секунд решай задания одно за другим.");
      return;
    }

    if (state.test.finished) {
      setPrompt("Тест завершен. Нажми «Старт раунда», чтобы пройти ещё раз.");
      return;
    }

    setPrompt("Нажми «Старт раунда», чтобы начать тест из 10 заданий.");
  }

  function renderOutput() {
    elements.output.textContent = state.inputTokens.length > 0 ? state.inputTokens.join(" ") : "∅";
    elements.output.style.opacity = state.inputTokens.length > 0 ? "1" : "0.55";
  }

  function renderStatus() {
    elements.modeName.textContent = MODES[state.mode];

    if (state.mode === "practice") {
      elements.timerValue.textContent = "—";
      elements.progressValue.textContent = `${state.practice.attempted} реш.`;
      elements.scoreValue.textContent = `${state.practice.correct}/${state.practice.attempted}`;
      return;
    }

    if (state.mode === "quiz") {
      elements.timerValue.textContent = state.quiz.running
        ? formatTime(state.quiz.timeLeft)
        : `${state.quiz.duration} c`;
      elements.progressValue.textContent = `${state.quiz.attempted} попыт.`;
      elements.scoreValue.textContent = `${state.quiz.correct} верн.`;
      return;
    }

    elements.timerValue.textContent = "—";

    if (state.test.running) {
      elements.progressValue.textContent = `${state.test.index + 1}/10`;
    } else if (state.test.finished) {
      elements.progressValue.textContent = "10/10";
    } else {
      elements.progressValue.textContent = "0/10";
    }

    elements.scoreValue.textContent = `${state.test.correct} верн.`;
  }

  function renderControls() {
    const practiceMode = state.mode === "practice";
    const quizMode = state.mode === "quiz";
    const testMode = state.mode === "test";

    elements.nextBtn.disabled = !practiceMode;
    elements.checkBtn.disabled = quizMode && !state.quiz.running;

    if (practiceMode) {
      elements.startRoundBtn.textContent = "Новое задание";
      return;
    }

    if (quizMode) {
      elements.startRoundBtn.textContent = state.quiz.running ? "Перезапустить" : "Старт раунда";
      return;
    }

    if (testMode) {
      elements.startRoundBtn.textContent = state.test.running ? "Перезапустить" : "Старт раунда";
    }
  }

  function setPrompt(text) {
    elements.taskPrompt.textContent = text;
  }

  function setFeedback(text, type) {
    elements.feedback.textContent = text;
    elements.feedback.classList.remove("success", "error");

    if (type) {
      elements.feedback.classList.add(type);
    }
  }

  function formatTime(totalSeconds) {
    const safe = Math.max(0, totalSeconds);
    const minutes = Math.floor(safe / 60)
      .toString()
      .padStart(2, "0");
    const seconds = Math.floor(safe % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  }

  function compileExpression(expression) {
    const tokens = tokenize(expression);
    return toRpn(tokens);
  }

  function tokenize(expression) {
    const compact = expression.replace(/\s+/g, "");
    if (!compact) {
      throw new Error("пустое выражение");
    }

    const tokens = [];

    for (let i = 0; i < compact.length; i += 1) {
      const char = compact[i];

      if (/[abc]/i.test(char)) {
        tokens.push(char.toLowerCase());
        continue;
      }

      if (char === "-" && compact[i + 1] === ">") {
        tokens.push("→");
        i += 1;
        continue;
      }

      if (char === "<" && compact.slice(i, i + 3) === "<->") {
        tokens.push("↔");
        i += 2;
        continue;
      }

      const aliases = {
        "!": "¬",
        "&": "∧",
        "|": "∨",
        "^": "⊕",
        ">": "→",
        "=": "↔",
      };

      const normalized = aliases[char] || char;

      if (normalized === "(" || normalized === ")" || OP_INFO[normalized]) {
        tokens.push(normalized);
        continue;
      }

      throw new Error(`неизвестный символ «${char}»`);
    }

    return tokens;
  }

  function toRpn(tokens) {
    const output = [];
    const stack = [];
    let expectOperand = true;

    const pushOperator = (operator) => {
      const current = OP_INFO[operator];

      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (!OP_INFO[top]) {
          break;
        }

        const topInfo = OP_INFO[top];
        const needPop = current.assoc === "left"
          ? current.precedence <= topInfo.precedence
          : current.precedence < topInfo.precedence;

        if (!needPop) {
          break;
        }

        output.push(stack.pop());
      }

      stack.push(operator);
    };

    for (const token of tokens) {
      if (isVariable(token)) {
        if (!expectOperand) {
          throw new Error("пропущена операция между частями выражения");
        }
        output.push(token);
        expectOperand = false;
        continue;
      }

      if (token === "(") {
        if (!expectOperand) {
          throw new Error("перед «(» нужна операция");
        }
        stack.push(token);
        expectOperand = true;
        continue;
      }

      if (token === ")") {
        if (expectOperand) {
          throw new Error("пустые скобки или пропущен операнд");
        }

        let foundOpening = false;
        while (stack.length > 0) {
          const top = stack.pop();
          if (top === "(") {
            foundOpening = true;
            break;
          }
          output.push(top);
        }

        if (!foundOpening) {
          throw new Error("лишняя закрывающая скобка");
        }

        expectOperand = false;
        continue;
      }

      if (!OP_INFO[token]) {
        throw new Error(`неподдерживаемый оператор «${token}»`);
      }

      if (token === "¬") {
        if (!expectOperand) {
          throw new Error("оператор «¬» должен стоять перед выражением");
        }
        pushOperator(token);
        expectOperand = true;
        continue;
      }

      if (expectOperand) {
        throw new Error(`оператор «${token}» стоит не на месте`);
      }

      pushOperator(token);
      expectOperand = true;
    }

    if (expectOperand) {
      throw new Error("выражение не может заканчиваться оператором");
    }

    while (stack.length > 0) {
      const token = stack.pop();
      if (token === "(") {
        throw new Error("не хватает закрывающей скобки");
      }
      output.push(token);
    }

    validateRpn(output);
    return output;
  }

  function validateRpn(rpn) {
    let depth = 0;

    for (const token of rpn) {
      if (isVariable(token)) {
        depth += 1;
        continue;
      }

      const info = OP_INFO[token];
      if (!info) {
        throw new Error("ошибка разбора выражения");
      }

      if (info.arity === 1) {
        if (depth < 1) {
          throw new Error("оператору «¬» не хватает аргумента");
        }
        continue;
      }

      if (depth < 2) {
        throw new Error(`оператору «${token}» не хватает аргументов`);
      }

      depth -= 1;
    }

    if (depth !== 1) {
      throw new Error("выражение составлено некорректно");
    }
  }

  function isVariable(token) {
    return token === "a" || token === "b" || token === "c";
  }

  function evaluateRpn(rpn, values) {
    const stack = [];

    for (const token of rpn) {
      if (isVariable(token)) {
        stack.push(Boolean(values[token]));
        continue;
      }

      if (token === "¬") {
        const value = stack.pop();
        stack.push(!value);
        continue;
      }

      const right = stack.pop();
      const left = stack.pop();

      switch (token) {
        case "∧":
          stack.push(left && right);
          break;
        case "∨":
          stack.push(left || right);
          break;
        case "⊕":
          stack.push(Boolean(left) !== Boolean(right));
          break;
        case "→":
          stack.push(!left || right);
          break;
        case "↔":
          stack.push(left === right);
          break;
        default:
          throw new Error(`оператор «${token}» не поддерживается`);
      }
    }

    return stack[0];
  }

  function areEquivalent(firstRpn, secondRpn) {
    for (let mask = 0; mask < 8; mask += 1) {
      const values = {
        a: Boolean(mask & 1),
        b: Boolean(mask & 2),
        c: Boolean(mask & 4),
      };

      const left = evaluateRpn(firstRpn, values);
      const right = evaluateRpn(secondRpn, values);

      if (left !== right) {
        return false;
      }
    }

    return true;
  }
})();

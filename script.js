document.addEventListener("DOMContentLoaded", () => {
  // ... (Tất cả các khai báo const DOM elements giữ nguyên như file bạn gửi) ...
  const settingsScreen = document.getElementById("settings-screen");
  const gameScreen = document.getElementById("game-screen");
  const startGameBtn = document.getElementById("start-game-btn");
  const restartGameBtn = document.getElementById("restart-game-btn");
  const ingameRestartBtn = document.getElementById("ingame-restart-btn");

  const currentRoundDisplay = document.getElementById("current-round");
  const currentQuestionInRoundDisplay = document.getElementById(
    "current-question-in-round"
  );
  const totalQuestionsInRoundDisplay = document.getElementById(
    "total-questions-in-round"
  );
  const playerScoreDisplay = document.getElementById("player-score");
  const opponentScoreDisplay = document.getElementById("opponent-score");

  const fixedNumberDisplayArea = document.getElementById(
    "fixed-number-display-area"
  );
  const numberContextLabel = document.getElementById("number-context-label");
  const liveADisplay = document.getElementById("live-a");
  const liveBDisplay = document.getElementById("live-b");
  const liveCDisplay = document.getElementById("live-c");

  const phaseContentArea = document.getElementById("phase-content-area");
  const memorizationPhaseDiv = document.getElementById("memorization-phase");
  const questionPhaseDiv = document.getElementById("question-phase");
  const resultPhaseDiv = document.getElementById("result-phase");
  const gameOverScreen = document.getElementById("game-over-screen");

  const memorizationRoundNumber = document.getElementById(
    "memorization-round-number"
  );
  const memoCountdownDisplay = document.getElementById("memo-countdown");
  const proceedToQuestionsBtn = document.getElementById(
    "proceed-to-questions-btn"
  );

  const questionRoundNumber = document.getElementById("question-round-number");
  const questionNumberInRoundDisplay = document.getElementById(
    "question-number-in-round-display"
  );
  const questionTextDisplay = document.getElementById("question-text");
  const answerBtns = document.querySelectorAll(".answer-btn");
  const answerTimerDisplay = document.getElementById("answer-timer");
  const ansCountdownDisplay = document.getElementById("ans-countdown");

  const resultMessageDisplay = document.getElementById("result-message");
  const cumulativeADisplay = document.getElementById("cumulative-a-display");
  const cumulativeBDisplay = document.getElementById("cumulative-b-display");
  const cumulativeCDisplay = document.getElementById("cumulative-c-display");
  const nextActionCountdownDisplay = document.getElementById(
    "next-action-countdown"
  );

  const memoProgressBar = document.getElementById("memo-progress-bar");
  const ansProgressBar = document.getElementById("ans-progress-bar");
  const nextActionProgressBar = document.getElementById(
    "next-action-progress-bar"
  );

  const finalResultMessageDisplay = document.getElementById(
    "final-result-message"
  );
  const finalPlayerScoreDisplay = document.getElementById("final-player-score");
  const finalOpponentScoreDisplay = document.getElementById(
    "final-opponent-score"
  );

  const memoTimeSelect = document.getElementById("memo-time-select");
  const resultTimeSelect = document.getElementById("result-time-select");
  const answerTimeSelect = document.getElementById("answer-time-select");
  const totalRoundsSelect = document.getElementById("total-rounds-select");
  const startQuestionsSelect = document.getElementById(
    "start-questions-select"
  );

  const toggleRulesBtn = document.getElementById("toggle-rules-btn");
  const rulesContent = document.getElementById("rules-content");
  const viewHistoryBtn = document.getElementById("view-history-btn");
  const historyPopup = document.getElementById("history-popup");
  const closeHistoryPopupBtn = document.getElementById(
    "close-history-popup-btn"
  );
  const historyListContainer = document.getElementById(
    "history-list-container"
  );
  const clearHistoryBtn = document.getElementById("clear-history-btn");
  const interRoundPhaseDiv = document.getElementById("inter-round-phase");
  const interRoundMessage = document.getElementById("inter-round-message");
  const interRoundInfo = document.getElementById("inter-round-info");
  const proceedToNextRoundBtn = document.getElementById(
    "proceed-to-next-round-btn"
  );
  const ingameHomeBtn = document.getElementById("ingame-home-btn");

  const totalRoundsDisplayIngame = document.getElementById(
    "total-rounds-display-ingame"
  );
  const gameStatusText = document.getElementById("game-status-text");
  const winConditionInfoDiv = document.getElementById("win-condition-info");

  // DOM Elements for Estimated Rank Score Display
  const baseScoreEstimationDisplay = document.getElementById(
    "base-score-estimation"
  );
  const totalMultiplierEstimationDisplay = document.getElementById(
    "total-multiplier-estimation"
  );
  const finalRankEstimationDisplay = document.getElementById(
    "final-rank-estimation"
  );

  const MAX_HISTORY_ITEMS = 50;
  let QUESTIONS_PER_ROUND_CONFIG = [];
  let TOTAL_ROUNDS_CONFIG = 5;
  let START_QUESTIONS_CONFIG = 3;
  let initialIsTotalQuestionsEven = false;

  let MEMORIZATION_TIME_CONFIG = 10;
  let RESULT_DISPLAY_TIME_CONFIG = 5;
  let ANSWER_TIME_LIMIT_CONFIG = 0;

  const UI_UPDATE_INTERVAL = 50;

  let currentRound;
  let currentQuestionInRound;
  let playerScore;
  let opponentScore;
  let totalQuestionsAnsweredOverall;
  let totalGameQuestions;

  let initialNumbers = { A: 0, B: 0, C: 0 };
  let cumulativeSums = { A: 0, B: 0, C: 0 };
  let newNumbersForQuestion = { A: 0, B: 0, C: 0 };
  let questionData;

  let memoTimerInterval, answerTimerInterval, nextActionTimerInterval;
  let memoStartTime, ansStartTime, resultStartTime;
  let totalMemoTimeMs, totalAnsTimeMs, totalResultTimeMs;

  function setFixedNumberAreaState(stateClass) {
    if (fixedNumberDisplayArea) {
      fixedNumberDisplayArea.classList.remove(
        "state-memorize",
        "state-new-number",
        "state-result-sum"
      );
      if (stateClass) {
        fixedNumberDisplayArea.classList.add(stateClass);
      }
    }
  }

  function generateQuestionsPerRoundArray() {
    QUESTIONS_PER_ROUND_CONFIG = [0];
    let initialTotal = 0;
    for (let i = 0; i < TOTAL_ROUNDS_CONFIG; i++) {
      const questionsInThisRound = START_QUESTIONS_CONFIG + i;
      QUESTIONS_PER_ROUND_CONFIG.push(questionsInThisRound);
      initialTotal += questionsInThisRound;
    }
    initialIsTotalQuestionsEven = initialTotal % 2 === 0;
    if (
      initialIsTotalQuestionsEven &&
      TOTAL_ROUNDS_CONFIG > 0 &&
      QUESTIONS_PER_ROUND_CONFIG.length > TOTAL_ROUNDS_CONFIG
    ) {
      QUESTIONS_PER_ROUND_CONFIG[TOTAL_ROUNDS_CONFIG]++;
    }
  }

  function formatTime(milliseconds) {
    if (milliseconds < 0) milliseconds = 0;
    return (milliseconds / 1000).toFixed(1);
  }

  function updateProgressBar(barElement, currentTimeMs, totalTimeMs) {
    if (!barElement) return;
    const percentage =
      totalTimeMs > 0 ? Math.max(0, (currentTimeMs / totalTimeMs) * 100) : 0;
    barElement.style.width = percentage + "%";
    barElement.classList.remove("success", "warning", "danger");
    barElement.style.backgroundColor = "";
    if (currentTimeMs <= 0) {
      barElement.style.width = "0%";
    } else if (percentage <= 30) {
      barElement.classList.add("danger");
    } else if (percentage <= 60) {
      barElement.classList.add("warning");
    } else {
      barElement.style.backgroundColor = "var(--success-color)";
    }
  }

  function updateTotalRoundsDisplayIngame() {
    if (totalRoundsDisplayIngame) {
      totalRoundsDisplayIngame.textContent = TOTAL_ROUNDS_CONFIG;
    }
  }

  // --- HÀM TÍNH TOÁN HỆ SỐ CHO RANK SCORE ---
  function calculateAnswerTimeFactor(answerTime) {
    if (answerTime === 0) return 1.0;
    if (answerTime === 5) return 1.8;
    if (answerTime === 10) return 1.6;
    if (answerTime === 15) return 1.4;
    if (answerTime === 30) return 1.25;
    if (answerTime === 45) return 1.1;
    return 1.0;
  }
  function calculateResultDisplayFactor(resultTime) {
    if (resultTime === 3) return 1.3;
    if (resultTime === 5) return 1.2;
    if (resultTime === 10) return 1.1;
    if (resultTime === 15) return 1.0;
    if (resultTime === 20) return 0.95;
    if (resultTime === 30) return 0.9;
    return 1.0;
  }
  function calculateTotalRoundsFactor(totalRounds) {
    if (totalRounds === 3) return 0.9;
    if (totalRounds === 4) return 0.95;
    if (totalRounds === 5) return 1.0;
    return 1.0;
  }
  function calculateStartQuestionsFactor(startQuestions) {
    if (startQuestions === 3) return 1.0;
    if (startQuestions === 4) return 1.05;
    if (startQuestions === 5) return 1.1;
    return 1.0;
  }
  function calculateMemorizationFactor(memoTime) {
    if (memoTime === 10) return 1.15;
    if (memoTime === 15) return 1.12;
    if (memoTime === 20) return 1.09;
    if (memoTime === 25) return 1.06;
    if (memoTime === 30) return 1.03;
    if (memoTime === 35) return 1.0;
    if (memoTime === 40) return 0.97;
    if (memoTime === 45) return 0.94;
    if (memoTime === 50) return 0.91;
    if (memoTime === 55) return 0.88;
    if (memoTime === 60) return 0.85;
    return 1.0;
  }
  function calculateExtraQuestionFactor(hadExtraQuestion) {
    return hadExtraQuestion ? 1.05 : 1.0;
  }

  function updateEstimatedRankDisplay() {
    if (
      !baseScoreEstimationDisplay ||
      !totalMultiplierEstimationDisplay ||
      !finalRankEstimationDisplay
    ) {
      return;
    }

    const currentSettings = {
      memoTime: MEMORIZATION_TIME_CONFIG,
      resultTime: RESULT_DISPLAY_TIME_CONFIG,
      answerTime: ANSWER_TIME_LIMIT_CONFIG,
      totalRounds: TOTAL_ROUNDS_CONFIG,
      startQuestions: START_QUESTIONS_CONFIG,
    };

    // 1. Tính lại tổng số câu hỏi (tempTotalGameQuestionsEst) dựa trên config hiện tại
    let tempQuestionsPerRound = [0];
    let tempInitialTotal = 0;
    for (let i = 0; i < currentSettings.totalRounds; i++) {
      const questionsInThisRound = currentSettings.startQuestions + i;
      tempQuestionsPerRound.push(questionsInThisRound);
      tempInitialTotal += questionsInThisRound;
    }
    const tempIsTotalQuestionsEven = tempInitialTotal % 2 === 0;
    let tempTotalGameQuestionsEst = tempInitialTotal;
    if (
      tempIsTotalQuestionsEven &&
      currentSettings.totalRounds > 0 &&
      tempQuestionsPerRound.length > currentSettings.totalRounds
    ) {
      tempTotalGameQuestionsEst++;
    }

    // 2. Tính số câu tối thiểu cần thắng để đạt đa số
    const majorityTargetForEstimation =
      Math.floor(tempTotalGameQuestionsEst / 2) + 1;

    // 3. Điểm cơ bản ước tính DỰA TRÊN SỐ CÂU TỐI THIỂU ĐỂ THẮNG ĐA SỐ
    //    Giả định bạn thắng với số câu bằng majorityTarget, và đối thủ ít hơn 1.
    //    Chênh lệch điểm lúc đó sẽ là 1. Nhưng để "ước tính" điểm tiềm năng
    //    khi thắng đa số, ta có thể lấy majorityTarget làm cơ sở.
    //    Hoặc, nếu bạn muốn ước tính dựa trên chênh lệch tối thiểu (1 điểm) khi thắng đa số:
    //    const baseScoreForEstimation = 1 * 100; // Chênh lệch tối thiểu là 1
    //    Tuy nhiên, để phản ánh "giá trị" của việc thắng đa số với X câu,
    //    việc dùng majorityTarget * 100 có thể hợp lý hơn cho mục đích hiển thị này.
    const baseScoreForEstimation = majorityTargetForEstimation * 100;

    // 4. Tính các hệ số nhân
    const answerTimeFactor = calculateAnswerTimeFactor(
      currentSettings.answerTime
    );
    const resultDisplayFactor = calculateResultDisplayFactor(
      currentSettings.resultTime
    );
    const totalRoundsFactor = calculateTotalRoundsFactor(
      currentSettings.totalRounds
    );
    const startQuestionsFactor = calculateStartQuestionsFactor(
      currentSettings.startQuestions
    );
    const memorizationFactor = calculateMemorizationFactor(
      currentSettings.memoTime
    );
    const extraQuestionFactor = calculateExtraQuestionFactor(
      tempIsTotalQuestionsEven
    );

    const totalMultiplier =
      answerTimeFactor *
      resultDisplayFactor *
      totalRoundsFactor *
      startQuestionsFactor *
      memorizationFactor *
      extraQuestionFactor;

    const finalEstimatedRank = Math.round(
      baseScoreForEstimation * totalMultiplier
    );

    baseScoreEstimationDisplay.textContent =
      baseScoreForEstimation.toLocaleString(); // Thêm định dạng số
    totalMultiplierEstimationDisplay.textContent = totalMultiplier.toFixed(2);
    finalRankEstimationDisplay.textContent =
      finalEstimatedRank.toLocaleString(); // Thêm định dạng số

    // Cập nhật ghi chú cho rõ ràng hơn
    const noteElement = document.querySelector(".estimated-score-note");
    if (noteElement) {
      noteElement.textContent = `(Điểm cơ bản ước tính khi thắng đa số ${majorityTargetForEstimation}/${tempTotalGameQuestionsEst} câu, nhân với các hệ số)`;
    }
  }

  function loadSettings() {
    // ... (Tải các cài đặt như cũ)
    const savedMemoTime = localStorage.getItem("geniusGameMemoTime");
    if (savedMemoTime && memoTimeSelect) {
      MEMORIZATION_TIME_CONFIG = parseInt(savedMemoTime, 10);
      memoTimeSelect.value = savedMemoTime;
    } else if (memoTimeSelect) {
      memoTimeSelect.value = MEMORIZATION_TIME_CONFIG.toString();
    }
    const savedResultTime = localStorage.getItem("geniusGameResultTime");
    if (savedResultTime && resultTimeSelect) {
      RESULT_DISPLAY_TIME_CONFIG = parseInt(savedResultTime, 10);
      resultTimeSelect.value = savedResultTime;
    } else if (resultTimeSelect) {
      resultTimeSelect.value = RESULT_DISPLAY_TIME_CONFIG.toString();
    }
    const savedAnswerTime = localStorage.getItem("geniusGameAnswerTime");
    if (savedAnswerTime && answerTimeSelect) {
      ANSWER_TIME_LIMIT_CONFIG = parseInt(savedAnswerTime, 10);
      answerTimeSelect.value = savedAnswerTime;
    } else if (answerTimeSelect) {
      answerTimeSelect.value = ANSWER_TIME_LIMIT_CONFIG.toString();
    }
    const savedTotalRounds = localStorage.getItem("geniusGameTotalRounds");
    if (savedTotalRounds && totalRoundsSelect) {
      TOTAL_ROUNDS_CONFIG = parseInt(savedTotalRounds, 10);
      totalRoundsSelect.value = savedTotalRounds;
    } else if (totalRoundsSelect) {
      totalRoundsSelect.value = TOTAL_ROUNDS_CONFIG.toString();
    }
    const savedStartQuestions = localStorage.getItem(
      "geniusGameStartQuestions"
    );
    if (savedStartQuestions && startQuestionsSelect) {
      START_QUESTIONS_CONFIG = parseInt(savedStartQuestions, 10);
      startQuestionsSelect.value = savedStartQuestions;
    } else if (startQuestionsSelect) {
      startQuestionsSelect.value = START_QUESTIONS_CONFIG.toString();
    }

    if (startQuestionsSelect) {
      START_QUESTIONS_CONFIG = parseInt(startQuestionsSelect.value, 10);
    }
    generateQuestionsPerRoundArray();
    calculateTotalGameQuestions();
    updateTotalRoundsDisplayIngame();
    updateEstimatedRankDisplay();
  }

  function saveSettings() {
    // ... (Lưu các cài đặt như cũ) ...
    if (memoTimeSelect) {
      localStorage.setItem("geniusGameMemoTime", memoTimeSelect.value);
      MEMORIZATION_TIME_CONFIG = parseInt(memoTimeSelect.value, 10);
    }
    if (resultTimeSelect) {
      localStorage.setItem("geniusGameResultTime", resultTimeSelect.value);
      RESULT_DISPLAY_TIME_CONFIG = parseInt(resultTimeSelect.value, 10);
    }
    if (answerTimeSelect) {
      localStorage.setItem("geniusGameAnswerTime", answerTimeSelect.value);
      ANSWER_TIME_LIMIT_CONFIG = parseInt(answerTimeSelect.value, 10);
    }
    if (totalRoundsSelect) {
      localStorage.setItem("geniusGameTotalRounds", totalRoundsSelect.value);
      TOTAL_ROUNDS_CONFIG = parseInt(totalRoundsSelect.value, 10);
    }
    if (startQuestionsSelect) {
      localStorage.setItem(
        "geniusGameStartQuestions",
        startQuestionsSelect.value
      );
      START_QUESTIONS_CONFIG = parseInt(startQuestionsSelect.value, 10);
    }
    generateQuestionsPerRoundArray();
    calculateTotalGameQuestions();
    updateTotalRoundsDisplayIngame();
    updateEstimatedRankDisplay();
  }

  loadSettings();
  if (memoTimeSelect) memoTimeSelect.addEventListener("change", saveSettings);
  if (resultTimeSelect)
    resultTimeSelect.addEventListener("change", saveSettings);
  if (answerTimeSelect)
    answerTimeSelect.addEventListener("change", saveSettings);
  if (totalRoundsSelect) {
    totalRoundsSelect.addEventListener("change", saveSettings);
  }
  if (startQuestionsSelect) {
    startQuestionsSelect.addEventListener("change", saveSettings);
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  function calculateTotalGameQuestions() {
    totalGameQuestions = 0;
    for (let i = 1; i <= TOTAL_ROUNDS_CONFIG; i++) {
      if (QUESTIONS_PER_ROUND_CONFIG[i] !== undefined) {
        totalGameQuestions += QUESTIONS_PER_ROUND_CONFIG[i];
      }
    }
  }
  function updateScoreDisplay() {
    playerScoreDisplay.textContent = playerScore;
    opponentScoreDisplay.textContent = opponentScore;
  }
  function updateGameInfoDisplay() {
    currentRoundDisplay.textContent = currentRound;
    currentQuestionInRoundDisplay.textContent = currentQuestionInRound;
    totalQuestionsInRoundDisplay.textContent =
      QUESTIONS_PER_ROUND_CONFIG[currentRound] || 0;
    if (memorizationRoundNumber)
      memorizationRoundNumber.textContent = currentRound;
    if (questionRoundNumber) questionRoundNumber.textContent = currentRound;
    if (questionNumberInRoundDisplay)
      questionNumberInRoundDisplay.textContent = currentQuestionInRound;
  }
  function messageIncludesWinType(msg) {
    return msg.toLowerCase().includes("(đa số)");
  }

  function updateGameStatusDisplay() {
    if (!gameStatusText || !winConditionInfoDiv) return;
    const questionsPlayedThisSession = totalQuestionsAnsweredOverall;
    const questionsLeftInGame = totalGameQuestions - questionsPlayedThisSession;
    let statusMsg = "";
    winConditionInfoDiv.classList.remove(
      "status-good",
      "status-bad",
      "status-neutral"
    );
    if (playerScore > opponentScore) {
      const lead = playerScore - opponentScore;
      statusMsg = `Bạn dẫn ${lead} điểm.`;
      winConditionInfoDiv.classList.add("status-good");
    } else if (opponentScore > playerScore) {
      const trail = opponentScore - playerScore;
      statusMsg = `Đối thủ dẫn ${trail} điểm.`;
      winConditionInfoDiv.classList.add("status-bad");
    } else {
      statusMsg = "Tỉ số đang hòa!";
      winConditionInfoDiv.classList.add("status-neutral");
    }
    const currentFinalMessage = finalResultMessageDisplay
      ? finalResultMessageDisplay.textContent || ""
      : "";
    if (
      questionsLeftInGame > 0 &&
      !messageIncludesWinType(currentFinalMessage)
    ) {
      statusMsg += ` (Còn ${questionsLeftInGame} câu)`;
    } else if (
      currentRound <= TOTAL_ROUNDS_CONFIG &&
      currentQuestionInRound <= QUESTIONS_PER_ROUND_CONFIG[currentRound] &&
      questionsLeftInGame <= 0 &&
      !messageIncludesWinType(currentFinalMessage)
    ) {
      statusMsg += ` (Câu cuối!)`;
    }
    gameStatusText.textContent = statusMsg;
  }

  function calculateRankScore(
    pScore,
    oScore,
    gameSettings,
    isMajorityWinOutcome
  ) {
    if (pScore <= oScore) {
      return 0;
    }

    const scoreDifference = pScore - oScore; // CHÊNH LỆCH ĐIỂM THỰC TẾ
    const baseScoreFromDiff = scoreDifference * 100; // ĐIỂM CƠ BẢN TỪ CHÊNH LỆCH THỰC TẾ

    const answerTimeFactor = calculateAnswerTimeFactor(gameSettings.answerTime);
    const resultDisplayFactor = calculateResultDisplayFactor(
      gameSettings.resultTime
    );
    const totalRoundsFactor = calculateTotalRoundsFactor(
      gameSettings.totalRounds
    );
    const startQuestionsFactor = calculateStartQuestionsFactor(
      gameSettings.startQuestions
    );
    const memorizationFactor = calculateMemorizationFactor(
      gameSettings.memoTime
    );
    const extraQuestionFactor = calculateExtraQuestionFactor(
      gameSettings.hadExtraQuestion
    );

    let rankScore =
      baseScoreFromDiff *
      answerTimeFactor *
      resultDisplayFactor *
      totalRoundsFactor *
      startQuestionsFactor *
      memorizationFactor *
      extraQuestionFactor;

    // Nếu bạn muốn có một điểm thưởng cố định khi thắng theo kiểu "Đa số" (ngoài điểm từ chênh lệch)
    // thì có thể thêm ở đây. Ví dụ:
    // if (isMajorityWinOutcome) {
    //     rankScore += 250; // Thưởng thêm vì thắng sớm kiểu đa số
    // }

    return Math.round(rankScore);
  }

  function saveGameResult(pScore, oScore, resultMsg, isMajorityWin = false) {
    // Thêm isMajorityWin
    let history = JSON.parse(localStorage.getItem("geniusGameHistory")) || [];
    const gameDate = new Date();
    const formattedDate = `${gameDate.toLocaleDateString(
      "vi-VN"
    )} ${gameDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    })}`;
    let resultType = "draw";
    if (
      resultMsg.toLowerCase().includes("thắng") ||
      resultMsg.toLowerCase().includes("chiến thắng")
    ) {
      resultType = "win";
    } else if (
      resultMsg.toLowerCase().includes("thua") ||
      resultMsg.toLowerCase().includes("tiếc")
    ) {
      resultType = "lose";
    }

    const gameSettingsForHistory = {
      memoTime: MEMORIZATION_TIME_CONFIG,
      resultTime: RESULT_DISPLAY_TIME_CONFIG,
      answerTime: ANSWER_TIME_LIMIT_CONFIG,
      totalRounds: TOTAL_ROUNDS_CONFIG,
      startQuestions: START_QUESTIONS_CONFIG,
      actualTotalQuestions: totalGameQuestions,
      hadExtraQuestion: initialIsTotalQuestionsEven,
    };

    let rankScoreValue = 0;
    if (pScore > oScore) {
      // Chỉ tính rank nếu người chơi thắng
      rankScoreValue = calculateRankScore(
        pScore,
        oScore,
        gameSettingsForHistory,
        isMajorityWin
      );
    }

    const newEntry = {
      playerScore: pScore,
      opponentScore: oScore,
      resultText: resultMsg,
      resultType: resultType,
      date: formattedDate,
      timestamp: gameDate.getTime(),
      settings: gameSettingsForHistory,
      rankScore: rankScoreValue, // Lưu điểm rank
    };
    history.unshift(newEntry);
    if (history.length > MAX_HISTORY_ITEMS) {
      history = history.slice(0, MAX_HISTORY_ITEMS);
    }
    localStorage.setItem("geniusGameHistory", JSON.stringify(history));
  }
  function loadAndDisplayHistory() {
    const history = JSON.parse(localStorage.getItem("geniusGameHistory")) || [];
    historyListContainer.innerHTML = "";
    if (history.length === 0) {
      historyListContainer.innerHTML = "<p>Chưa có lịch sử nào.</p>";
      if (clearHistoryBtn) clearHistoryBtn.classList.add("hidden");
      return;
    }
    if (clearHistoryBtn) clearHistoryBtn.classList.remove("hidden");
    const ul = document.createElement("ul");
    ul.style.listStyleType = "none";
    ul.style.paddingLeft = "0";
    history.forEach((entry) => {
      const li = document.createElement("li");
      li.classList.add("history-item");
      const mainInfoDiv = document.createElement("div");
      mainInfoDiv.classList.add("history-main-info");
      const resultSpan = document.createElement("span");
      resultSpan.classList.add("result", entry.resultType);
      resultSpan.textContent = entry.resultText;
      const scoreSpan = document.createElement("span");
      scoreSpan.classList.add("score");
      scoreSpan.textContent = `Bạn: ${entry.playerScore} - "Đối Thủ": ${entry.opponentScore}`;
      const dateSpan = document.createElement("span");
      dateSpan.classList.add("date");
      dateSpan.textContent = entry.date;
      const rankScoreSpan = document.createElement("span");
      rankScoreSpan.classList.add("rank-score-history");
      rankScoreSpan.textContent = ` (Rank: ${
        entry.rankScore !== undefined ? entry.rankScore : "N/A"
      })`; // Hiển thị N/A nếu không có

      mainInfoDiv.appendChild(resultSpan);
      mainInfoDiv.appendChild(scoreSpan);
      mainInfoDiv.appendChild(rankScoreSpan);
      mainInfoDiv.appendChild(dateSpan);
      li.appendChild(mainInfoDiv);
      if (entry.settings) {
        const settingsDiv = document.createElement("div");
        settingsDiv.classList.add("history-settings-info");
        let settingsString = `Cài đặt: Vòng(${
          entry.settings.totalRounds
        }), Nhớ(${entry.settings.memoTime}s), KQ(${
          entry.settings.resultTime
        }s), Trả lời(${
          entry.settings.answerTime === 0
            ? "∞"
            : entry.settings.answerTime + "s"
        }), Câu BĐ(${entry.settings.startQuestions})`;
        if (entry.settings.hadExtraQuestion) {
          settingsString += ` (Có câu phụ, tổng ${entry.settings.actualTotalQuestions} câu)`;
        }
        settingsDiv.textContent = settingsString;
        li.appendChild(settingsDiv);
      }
      ul.appendChild(li);
    });
    historyListContainer.appendChild(ul);
  }
  function showPhase(phaseToShow) {
    [
      memorizationPhaseDiv,
      questionPhaseDiv,
      resultPhaseDiv,
      interRoundPhaseDiv,
      gameOverScreen,
    ].forEach((p) => {
      if (p) p.classList.add("hidden");
    });
    if (phaseToShow) {
      phaseToShow.classList.remove("hidden");
    }
  }
  function startInterRoundPhase() {
    showPhase(interRoundPhaseDiv);
    const nextRoundNumber = currentRound + 1;
    if (interRoundMessage) {
      interRoundMessage.textContent = `Vòng ${currentRound} Hoàn Tất!`;
    }
    if (interRoundInfo) {
      if (nextRoundNumber <= TOTAL_ROUNDS_CONFIG) {
        interRoundInfo.textContent = `Sẵn sàng cho Vòng ${nextRoundNumber}?`;
      } else {
        interRoundInfo.textContent = "Bạn đã hoàn thành tất cả các vòng!";
      }
    }
    if (proceedToNextRoundBtn) {
      if (nextRoundNumber <= TOTAL_ROUNDS_CONFIG) {
        proceedToNextRoundBtn.textContent = `Bắt Đầu Vòng ${nextRoundNumber}`;
        proceedToNextRoundBtn.classList.remove("hidden");
      } else {
        proceedToNextRoundBtn.classList.add("hidden");
      }
    }
    setFixedNumberAreaState(null);
    if (liveADisplay) liveADisplay.textContent = "-";
    if (liveBDisplay) liveBDisplay.textContent = "-";
    if (liveCDisplay) liveCDisplay.textContent = "-";
    if (numberContextLabel) numberContextLabel.textContent = "Nghỉ giữa vòng";
  }
  function showScreen(screenToShow) {
    [settingsScreen, gameScreen].forEach((s) => {
      if (s) s.classList.add("hidden");
    });
    if (screenToShow) {
      screenToShow.classList.remove("hidden");
    }
    if (screenToShow === gameScreen) {
      if (fixedNumberDisplayArea)
        fixedNumberDisplayArea.classList.remove("hidden");
      showPhase(null);
    } else if (screenToShow === settingsScreen) {
      if (fixedNumberDisplayArea)
        fixedNumberDisplayArea.classList.add("hidden");
    }
  }
  function initGame() {
    currentRound = 0;
    playerScore = 0;
    opponentScore = 0;
    totalQuestionsAnsweredOverall = 0;
    currentQuestionInRound = 0;

    if (QUESTIONS_PER_ROUND_CONFIG.length === 0 || TOTAL_ROUNDS_CONFIG === 0) {
      loadSettings();
    } else {
      generateQuestionsPerRoundArray(); // Luôn tạo lại dựa trên config
      calculateTotalGameQuestions(); // Luôn tính lại dựa trên mảng mới
    }
    updateTotalRoundsDisplayIngame();
    updateScoreDisplay();
    updateGameStatusDisplay();

    totalMemoTimeMs = MEMORIZATION_TIME_CONFIG * 1000;
    totalAnsTimeMs = ANSWER_TIME_LIMIT_CONFIG * 1000;
    totalResultTimeMs = RESULT_DISPLAY_TIME_CONFIG * 1000;

    if (memoProgressBar)
      updateProgressBar(memoProgressBar, totalMemoTimeMs, totalMemoTimeMs);
    if (ansProgressBar && ANSWER_TIME_LIMIT_CONFIG > 0) {
      updateProgressBar(ansProgressBar, totalAnsTimeMs, totalAnsTimeMs);
      if (answerTimerDisplay) answerTimerDisplay.classList.remove("hidden");
    } else if (ansProgressBar) {
      updateProgressBar(ansProgressBar, 0, 1);
      if (answerTimerDisplay) answerTimerDisplay.classList.add("hidden");
    }
    if (nextActionProgressBar)
      updateProgressBar(
        nextActionProgressBar,
        totalResultTimeMs,
        totalResultTimeMs
      );

    clearInterval(memoTimerInterval);
    clearInterval(answerTimerInterval);
    clearInterval(nextActionTimerInterval);
    if (fixedNumberDisplayArea)
      fixedNumberDisplayArea.classList.remove("hidden");
    setFixedNumberAreaState(null);
    if (liveADisplay) liveADisplay.textContent = "?";
    if (liveBDisplay) liveBDisplay.textContent = "?";
    if (liveCDisplay) liveCDisplay.textContent = "?";
    if (numberContextLabel)
      numberContextLabel.textContent = "Đang tải vòng mới...";
    startNextRound();
  }
  function startNextRound() {
    currentRound++;
    if (currentRound > TOTAL_ROUNDS_CONFIG) {
      return;
    }
    currentQuestionInRound = 0;
    updateGameInfoDisplay();
    startMemorizationPhase();
  }

  function updateMemoTimerCallback() {
    const elapsedTime = Date.now() - memoStartTime;
    let timeLeftMs = totalMemoTimeMs - elapsedTime;
    if (timeLeftMs <= 0) {
      timeLeftMs = 0;
      clearInterval(memoTimerInterval);
      if (memoCountdownDisplay)
        memoCountdownDisplay.textContent = formatTime(0);
      updateProgressBar(memoProgressBar, 0, totalMemoTimeMs);
      requestAnimationFrame(() => {
        proceedToQuestions();
      });
      return;
    }
    if (memoCountdownDisplay)
      memoCountdownDisplay.textContent = formatTime(timeLeftMs);
    updateProgressBar(memoProgressBar, timeLeftMs, totalMemoTimeMs);
  }
  function updateAnswerTimerCallback() {
    const elapsedTime = Date.now() - ansStartTime;
    let ansTimeLeftMs = totalAnsTimeMs - elapsedTime;
    if (ansTimeLeftMs <= 0) {
      ansTimeLeftMs = 0;
      clearInterval(answerTimerInterval);
      if (ansCountdownDisplay) ansCountdownDisplay.textContent = formatTime(0);
      updateProgressBar(ansProgressBar, 0, totalAnsTimeMs);
      requestAnimationFrame(() => {
        handleAnswer(null);
      });
      return;
    }
    if (ansCountdownDisplay)
      ansCountdownDisplay.textContent = formatTime(ansTimeLeftMs);
    updateProgressBar(ansProgressBar, ansTimeLeftMs, totalAnsTimeMs);
  }
  function updateNextActionTimerCallback() {
    const elapsedTime = Date.now() - resultStartTime;
    let timeLeftMs = totalResultTimeMs - elapsedTime;
    if (timeLeftMs <= 0) {
      timeLeftMs = 0;
      clearInterval(nextActionTimerInterval);
      if (nextActionCountdownDisplay)
        nextActionCountdownDisplay.textContent = formatTime(0);
      updateProgressBar(nextActionProgressBar, 0, totalResultTimeMs);
      requestAnimationFrame(() => {
        if (
          currentQuestionInRound >= QUESTIONS_PER_ROUND_CONFIG[currentRound]
        ) {
          if (currentRound < TOTAL_ROUNDS_CONFIG) {
            startInterRoundPhase();
          } else {
            endGame(false);
          }
        } else {
          startNextQuestion();
        }
      });
      return;
    }
    if (nextActionCountdownDisplay)
      nextActionCountdownDisplay.textContent = formatTime(timeLeftMs);
    updateProgressBar(nextActionProgressBar, timeLeftMs, totalResultTimeMs);
  }

  function startMemorizationPhase() {
    showPhase(memorizationPhaseDiv);
    if (proceedToQuestionsBtn) proceedToQuestionsBtn.classList.add("hidden");
    setFixedNumberAreaState("state-memorize");
    if (numberContextLabel)
      numberContextLabel.textContent = "Số ban đầu (Ghi nhớ):";
    initialNumbers = {
      A: getRandomInt(1, 9),
      B: getRandomInt(1, 9),
      C: getRandomInt(1, 9),
    };
    cumulativeSums = { ...initialNumbers };
    if (liveADisplay) liveADisplay.textContent = initialNumbers.A;
    if (liveBDisplay) liveBDisplay.textContent = initialNumbers.B;
    if (liveCDisplay) liveCDisplay.textContent = initialNumbers.C;
    memoStartTime = Date.now();
    clearInterval(memoTimerInterval);
    updateMemoTimerCallback();
    memoTimerInterval = setInterval(
      updateMemoTimerCallback,
      UI_UPDATE_INTERVAL
    );
  }
  function proceedToQuestions() {
    if (numberContextLabel)
      numberContextLabel.textContent = "Số mới cho câu hỏi:";
    startNextQuestion();
  }
  function generateQuestion() {
    newNumbersForQuestion = {
      A: getRandomInt(1, 9),
      B: getRandomInt(1, 9),
      C: getRandomInt(1, 9),
    };
    setFixedNumberAreaState("state-new-number");
    if (liveADisplay) liveADisplay.textContent = newNumbersForQuestion.A;
    if (liveBDisplay) liveBDisplay.textContent = newNumbersForQuestion.B;
    if (liveCDisplay) liveCDisplay.textContent = newNumbersForQuestion.C;
    const tempSums = {
      A: cumulativeSums.A + newNumbersForQuestion.A,
      B: cumulativeSums.B + newNumbersForQuestion.B,
      C: cumulativeSums.C + newNumbersForQuestion.C,
    };
    const questionTypes = [
      "max",
      "min",
      "middle",
      "even",
      "odd",
      "lessThanX",
      "greaterThanX",
    ];
    let validQuestionTypes = [];
    const sumsArray = Object.values(tempSums);
    const sortedEntries = Object.entries(tempSums).sort(
      ([, a], [, b]) => a - b
    );
    const maxValCheck = Math.max(...sumsArray);
    if (sumsArray.filter((s) => s === maxValCheck).length === 1) {
      validQuestionTypes.push("max");
    }
    const minValCheck = Math.min(...sumsArray);
    if (sumsArray.filter((s) => s === minValCheck).length === 1) {
      validQuestionTypes.push("min");
    }
    if (new Set(sumsArray).size === 3) {
      validQuestionTypes.push("middle");
    }
    const evenColsCount = sumsArray.filter((s) => s % 2 === 0).length;
    if (evenColsCount === 1 || evenColsCount === 0) {
      validQuestionTypes.push("even");
    }
    const oddColsCount = sumsArray.filter((s) => s % 2 !== 0).length;
    if (oddColsCount === 1 || oddColsCount === 0) {
      validQuestionTypes.push("odd");
    }
    validQuestionTypes.push("lessThanX");
    validQuestionTypes.push("greaterThanX");
    if (validQuestionTypes.length === 0) {
      const q = "Cột nào có tổng lớn nhất?";
      const mF = Math.max(tempSums.A, tempSums.B, tempSums.C);
      const mcF = Object.keys(tempSums).filter((c) => tempSums[c] === mF);
      const cA = mcF.length === 1 ? mcF[0] : "Không có";
      return { text: q, answer: cA, sumsForThisQuestion: tempSums };
    }
    const type =
      validQuestionTypes[getRandomInt(0, validQuestionTypes.length - 1)];
    let question = "";
    let correctAnswer = "Không có";
    switch (type) {
      case "max":
        question = "Cột nào có tổng lớn nhất?";
        correctAnswer = Object.keys(tempSums).find(
          (c) => tempSums[c] === maxValCheck
        );
        break;
      case "min":
        question = "Cột nào có tổng nhỏ nhất?";
        correctAnswer = Object.keys(tempSums).find(
          (c) => tempSums[c] === minValCheck
        );
        break;
      case "middle":
        question =
          "Cột nào có tổng không phải lớn nhất cũng không phải nhỏ nhất?";
        correctAnswer = sortedEntries[1][0];
        break;
      case "even":
        question = "Cột nào có tổng là số chẵn?";
        const eC = Object.keys(tempSums).filter((c) => tempSums[c] % 2 === 0);
        if (eC.length === 1) {
          correctAnswer = eC[0];
        } else {
          correctAnswer = "Không có";
        }
        break;
      case "odd":
        question = "Cột nào có tổng là số lẻ?";
        const oC = Object.keys(tempSums).filter((c) => tempSums[c] % 2 !== 0);
        if (oC.length === 1) {
          correctAnswer = oC[0];
        } else {
          correctAnswer = "Không có";
        }
        break;
      case "lessThanX":
      case "greaterThanX":
        {
          let xV;
          const tSVX = Object.values(tempSums);
          const dSSX = [...new Set(tSVX)].sort((a, b) => a - b);
          let pCA = "Không có";
          let qG = !1;
          const strats = [];
          if (dSSX.length >= 2) {
            for (let i = 0; i < dSSX.length - 1; i++) {
              const s1 = dSSX[i],
                s2 = dSSX[i + 1];
              if (s2 - s1 > 1) {
                strats.push(() => {
                  const xC = s1 + getRandomInt(1, s2 - s1 - 1);
                  let aSC;
                  if (type === "lessThanX") {
                    aSC = Object.keys(tempSums).filter((c) => tempSums[c] < xC);
                  } else {
                    aSC = Object.keys(tempSums).filter((c) => tempSums[c] > xC);
                  }
                  if (aSC.length === 1) {
                    xV = xC;
                    pCA = aSC[0];
                    return !0;
                  }
                  return !1;
                });
              }
            }
          }
          if (dSSX.length > 1) {
            strats.push(() => {
              if (type === "lessThanX") {
                const tX = dSSX[1],
                  cLT = Object.keys(tempSums).filter((c) => tempSums[c] < tX);
                if (cLT.length === 1) {
                  xV = tX;
                  pCA = cLT[0];
                  return !0;
                }
              }
              return !1;
            });
            strats.push(() => {
              if (type === "greaterThanX") {
                const tX = dSSX[dSSX.length - 2],
                  cGT = Object.keys(tempSums).filter((c) => tempSums[c] > tX);
                if (cGT.length === 1) {
                  xV = tX;
                  pCA = cGT[0];
                  return !0;
                }
              }
              return !1;
            });
          }
          if (dSSX.length > 0) {
            strats.push(() => {
              if (type === "lessThanX") xV = dSSX[0];
              else xV = dSSX[dSSX.length - 1];
              pCA = "Không có";
              return !0;
            });
            strats.push(() => {
              if (type === "lessThanX")
                xV = Math.min(...tSVX) - getRandomInt(1, 3);
              else xV = Math.max(...tSVX) + getRandomInt(1, 3);
              if (xV < 1 && type === "lessThanX") xV = 1;
              pCA = "Không có";
              return !0;
            });
          }
          if (strats.length > 0) {
            for (let i = strats.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [strats[i], strats[j]] = [strats[j], strats[i]];
            }
            for (const strat of strats) {
              if (strat()) {
                qG = !0;
                break;
              }
            }
          }
          if (!qG) {
            if (dSSX.length > 0) {
              xV =
                type === "lessThanX"
                  ? Math.min(...tSVX) - 1
                  : Math.max(...tSVX) + 1;
              if (xV < 1 && type === "lessThanX") xV = Math.min(...tSVX);
            } else {
              xV =
                tSVX.length > 0
                  ? tSVX[0] + (type === "lessThanX" ? 1 : -1)
                  : getRandomInt(5, 15);
            }
            pCA = "Không có";
          }
          question = `Cột nào có tổng ${
            type === "lessThanX" ? "nhỏ hơn" : "lớn hơn"
          } ${xV}?`;
          correctAnswer = pCA;
        }
        break;
      default:
        question = "Cột nào có tổng lớn nhất?";
        const mVd = Math.max(tempSums.A, tempSums.B, tempSums.C),
          mcD = Object.keys(tempSums).filter((c) => tempSums[c] === mVd);
        if (mcD.length === 1) correctAnswer = mcD[0];
        else correctAnswer = "Không có";
    }
    return {
      text: question,
      answer: correctAnswer,
      sumsForThisQuestion: tempSums,
    };
  }
  function checkMajorityWin() {
    if (totalGameQuestions <= 0) return false; // Đảm bảo totalGameQuestions đã được tính
    const majorityTarget = Math.floor(totalGameQuestions / 2) + 1;
    if (playerScore >= majorityTarget && playerScore > opponentScore) {
      endGame(true, `Bạn đã thắng ${playerScore} câu (Đa số)!`);
      return true;
    }
    if (opponentScore >= majorityTarget && opponentScore > playerScore) {
      endGame(true, `"Đối Thủ" đã thắng ${opponentScore} câu (Đa số)!`);
      return true;
    }
    return false;
  }
  function startNextQuestion() {
    currentQuestionInRound++;
    totalQuestionsAnsweredOverall++;
    updateGameInfoDisplay();
    updateGameStatusDisplay();
    if (currentQuestionInRound > QUESTIONS_PER_ROUND_CONFIG[currentRound]) {
      // Không làm gì ở đây, displayResultsAndProceed sẽ lo việc chuyển phase
      return;
    }
    showPhase(questionPhaseDiv);
    if (numberContextLabel)
      numberContextLabel.textContent = "Số mới cho câu hỏi:";
    answerBtns.forEach((btn) => btn.classList.remove("disabled"));
    questionData = generateQuestion();
    if (questionTextDisplay)
      questionTextDisplay.textContent = questionData.text;
    if (ANSWER_TIME_LIMIT_CONFIG > 0) {
      if (answerTimerDisplay) answerTimerDisplay.classList.remove("hidden");
      ansStartTime = Date.now();
      clearInterval(answerTimerInterval);
      updateAnswerTimerCallback();
      answerTimerInterval = setInterval(
        updateAnswerTimerCallback,
        UI_UPDATE_INTERVAL
      );
    } else {
      if (answerTimerDisplay) answerTimerDisplay.classList.add("hidden");
      clearInterval(answerTimerInterval);
    }
  }
  function handleAnswer(playerAnswer) {
    clearInterval(answerTimerInterval);
    answerBtns.forEach((btn) => btn.classList.add("disabled"));
    cumulativeSums = { ...questionData.sumsForThisQuestion };
    let resultText = "",
      resultClass = "";
    if (playerAnswer === null) {
      opponentScore++;
      resultText = "Hết giờ! Đối thủ +1 điểm.";
      resultClass = "incorrect";
    } else if (playerAnswer === questionData.answer) {
      playerScore++;
      resultText = "Chính xác! +1 điểm.";
      resultClass = "correct";
    } else {
      opponentScore++;
      resultText = `Sai rồi! Đáp án đúng: ${questionData.answer}. Đối thủ +1 điểm.`;
      resultClass = "incorrect";
    }
    if (resultMessageDisplay) {
      resultMessageDisplay.textContent = resultText;
      resultMessageDisplay.className = "";
      resultMessageDisplay.classList.add(resultClass);
    }
    updateScoreDisplay();
    if (checkMajorityWin()) {
      return;
    }
    updateGameStatusDisplay();
    displayResultsAndProceed();
  }
  function displayResultsAndProceed() {
    showPhase(resultPhaseDiv);
    setFixedNumberAreaState("state-result-sum");
    if (numberContextLabel)
      numberContextLabel.textContent = "Tổng lũy kế sau câu hỏi:";
    if (liveADisplay) liveADisplay.textContent = cumulativeSums.A;
    if (liveBDisplay) liveBDisplay.textContent = cumulativeSums.B;
    if (liveCDisplay) liveCDisplay.textContent = cumulativeSums.C;
    if (cumulativeADisplay) cumulativeADisplay.textContent = cumulativeSums.A;
    if (cumulativeBDisplay) cumulativeBDisplay.textContent = cumulativeSums.B;
    if (cumulativeCDisplay) cumulativeCDisplay.textContent = cumulativeSums.C;
    resultStartTime = Date.now();
    clearInterval(nextActionTimerInterval);
    updateNextActionTimerCallback();
    nextActionTimerInterval = setInterval(
      updateNextActionTimerCallback,
      UI_UPDATE_INTERVAL
    );
  }
  function endGame(isMajorityWinOutcome, message = "") {
    clearInterval(memoTimerInterval);
    clearInterval(answerTimerInterval);
    clearInterval(nextActionTimerInterval);
    showPhase(gameOverScreen);
    setFixedNumberAreaState(null);
    if (fixedNumberDisplayArea) fixedNumberDisplayArea.classList.add("hidden");
    if (finalPlayerScoreDisplay)
      finalPlayerScoreDisplay.textContent = playerScore;
    if (finalOpponentScoreDisplay)
      finalOpponentScoreDisplay.textContent = opponentScore;
    let finalMessageText = "";
    if (isMajorityWinOutcome) {
      finalMessageText = message;
    } else {
      if (playerScore > opponentScore) {
        finalMessageText = "CHÚC MỪNG BẠN ĐÃ CHIẾN THẮNG!";
      } else if (opponentScore > playerScore) {
        finalMessageText = "Rất tiếc, bạn đã thua cuộc.";
      } else {
        finalMessageText = "Kết quả HÒA!";
      }
    }
    if (finalResultMessageDisplay)
      finalResultMessageDisplay.textContent = finalMessageText;
    saveGameResult(
      playerScore,
      opponentScore,
      finalMessageText,
      isMajorityWinOutcome
    );
  }

  if (startGameBtn)
    startGameBtn.addEventListener("click", () => {
      showScreen(gameScreen);
      initGame();
    });
  if (restartGameBtn)
    restartGameBtn.addEventListener("click", () => {
      showScreen(gameScreen);
      initGame();
    });
  if (ingameRestartBtn)
    ingameRestartBtn.addEventListener("click", () => {
      initGame();
    });
  answerBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (!btn.classList.contains("disabled")) {
        handleAnswer(btn.dataset.answer);
      }
    });
  });
  if (proceedToQuestionsBtn) {
    proceedToQuestionsBtn.addEventListener("click", () => {
      clearInterval(memoTimerInterval);
      proceedToQuestions();
    });
  }
  if (toggleRulesBtn)
    toggleRulesBtn.addEventListener("click", () => {
      if (rulesContent) rulesContent.classList.toggle("hidden");
    });
  if (viewHistoryBtn) {
    viewHistoryBtn.addEventListener("click", () => {
      loadAndDisplayHistory();
      if (historyPopup) historyPopup.classList.remove("hidden");
    });
  }
  if (closeHistoryPopupBtn) {
    closeHistoryPopupBtn.addEventListener("click", () => {
      if (historyPopup) historyPopup.classList.add("hidden");
    });
  }
  if (historyPopup) {
    historyPopup.addEventListener("click", (event) => {
      if (event.target === historyPopup) {
        historyPopup.classList.add("hidden");
      }
    });
  }
  if (clearHistoryBtn) {
    clearHistoryBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chơi không?")) {
        localStorage.removeItem("geniusGameHistory");
        loadAndDisplayHistory();
      }
    });
  }
  if (proceedToNextRoundBtn) {
    proceedToNextRoundBtn.addEventListener("click", () => {
      startNextRound();
    });
  }
  if (ingameHomeBtn) {
    ingameHomeBtn.addEventListener("click", () => {
      if (
        confirm(
          "Bạn có chắc chắn muốn thoát game và về màn hình chính không? Tiến trình hiện tại sẽ không được lưu."
        )
      ) {
        clearInterval(memoTimerInterval);
        clearInterval(answerTimerInterval);
        clearInterval(nextActionTimerInterval);
        showScreen(settingsScreen);
      }
    });
  }

  showScreen(settingsScreen);
});

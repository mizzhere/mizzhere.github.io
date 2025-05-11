document.addEventListener("DOMContentLoaded", () => {
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
  
    const totalRoundsDisplayIngame = document.getElementById( // Hiển thị tổng số vòng trong game-info
      "total-rounds-display-ingame"
    );
    const gameStatusText = document.getElementById("game-status-text"); // Cho thông tin thắng/thua
    const winConditionInfoDiv = document.getElementById("win-condition-info"); // Container của game-status-text
  
    const MAX_HISTORY_ITEMS = 50;
    let QUESTIONS_PER_ROUND_CONFIG = [];
    let TOTAL_ROUNDS_CONFIG = 5;
    let START_QUESTIONS_CONFIG = 3;
  
    let MEMORIZATION_TIME_CONFIG = 10;
    let RESULT_DISPLAY_TIME_CONFIG = 5;
    let ANSWER_TIME_LIMIT_CONFIG = 0;
    // const ANSWER_TIME_LIMIT = 3; // XÓA BIẾN KHÔNG DÙNG
  
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
  
    let memoTimerInterval;
    let answerTimerInterval;
    let nextActionTimerInterval;
  
    // XÓA dòng này khỏi global scope, sẽ gọi trong initGame và saveSettings
    // if (totalRoundsDisplayIngame) {
    //   totalRoundsDisplayIngame.textContent = TOTAL_ROUNDS_CONFIG;
    // }
  
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
      for (let i = 0; i < TOTAL_ROUNDS_CONFIG; i++) {
        QUESTIONS_PER_ROUND_CONFIG.push(START_QUESTIONS_CONFIG + i);
      }
    }
  
    function updateProgressBar(barElement, currentTime, totalTime) {
      if (!barElement) return;
      const percentage = Math.max(0, (currentTime / totalTime) * 100);
      barElement.style.width = percentage + "%";
      barElement.classList.remove("success", "warning", "danger");
      barElement.style.backgroundColor = "";
      if (currentTime <= 0) {
        barElement.style.width = "0%";
      } else if (percentage <= 30) {
        barElement.classList.add("danger");
      } else if (percentage <= 60) {
        barElement.classList.add("warning");
      } else {
        barElement.style.backgroundColor = "var(--success-color)";
      }
    }
  
    function updateTotalRoundsDisplayIngame() { // Hàm này đã đúng
      if (totalRoundsDisplayIngame) {
        totalRoundsDisplayIngame.textContent = TOTAL_ROUNDS_CONFIG;
      }
    }
  
    function loadSettings() {
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
  
      generateQuestionsPerRoundArray();
      updateTotalRoundsDisplayIngame(); // Cập nhật hiển thị sau khi tải setting
    }
  
    function saveSettings() {
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
      updateTotalRoundsDisplayIngame(); // Cập nhật hiển thị sau khi lưu
    }
  
    loadSettings();
  
    if (memoTimeSelect) memoTimeSelect.addEventListener("change", saveSettings);
    if (resultTimeSelect) resultTimeSelect.addEventListener("change", saveSettings);
    if (answerTimeSelect) answerTimeSelect.addEventListener("change", saveSettings);
    if (totalRoundsSelect) totalRoundsSelect.addEventListener("change", saveSettings);
    if (startQuestionsSelect) startQuestionsSelect.addEventListener("change", saveSettings);
  
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
      if (memorizationRoundNumber) memorizationRoundNumber.textContent = currentRound;
      if (questionRoundNumber) questionRoundNumber.textContent = currentRound;
      if (questionNumberInRoundDisplay) questionNumberInRoundDisplay.textContent = currentQuestionInRound;
    }
  
    function updateGameStatusDisplay() { // Hàm cập nhật thông tin thắng/thua
      if (!gameStatusText || !winConditionInfoDiv) return;
  
      const questionsActuallyLeft = totalGameQuestions - totalQuestionsAnsweredOverall;
      let statusMsg = "";
  
      winConditionInfoDiv.classList.remove('status-good', 'status-bad', 'status-neutral');
  
      if (playerScore > opponentScore) {
          const lead = playerScore - opponentScore;
          statusMsg = `Bạn dẫn ${lead} điểm.`;
          winConditionInfoDiv.classList.add('status-good');
          if (playerScore > opponentScore + questionsActuallyLeft && questionsActuallyLeft >= 0) {
              statusMsg = "Thắng An Toàn!";
          }
      } else if (opponentScore > playerScore) {
          const trail = opponentScore - playerScore;
          statusMsg = `Đối thủ dẫn ${trail} điểm.`;
          winConditionInfoDiv.classList.add('status-bad');
          if (opponentScore > playerScore + questionsActuallyLeft && questionsActuallyLeft >= 0) {
              statusMsg = "Nguy cơ Thua An Toàn!";
          }
      } else {
          statusMsg = "Tỉ số đang hòa!";
          winConditionInfoDiv.classList.add('status-neutral');
      }
  
      if (questionsActuallyLeft > 0 && !(playerScore > opponentScore + questionsActuallyLeft && questionsActuallyLeft >= 0) && !(opponentScore > playerScore + questionsActuallyLeft && questionsActuallyLeft >= 0) ) {
          statusMsg += ` (Còn ${questionsActuallyLeft} câu)`;
      } else if (currentRound <= TOTAL_ROUNDS_CONFIG && currentQuestionInRound <= QUESTIONS_PER_ROUND_CONFIG[currentRound] && questionsActuallyLeft === 0) {
           if(!statusMsg.includes("An Toàn")) statusMsg += ` (Câu cuối!)`;
      }
      gameStatusText.textContent = statusMsg;
    }
  
  
    function saveGameResult(pScore, oScore, resultMsg) {
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
  
      const newEntry = {
        playerScore: pScore,
        opponentScore: oScore,
        resultText: resultMsg,
        resultType: resultType,
        date: formattedDate,
        timestamp: gameDate.getTime(),
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
        const resultSpan = document.createElement("span");
        resultSpan.classList.add("result", entry.resultType);
        let displayResultText = "Hòa";
        if (entry.resultType === "win") displayResultText = "Thắng";
        else if (entry.resultType === "lose") displayResultText = "Thua";
        if (entry.resultText.toLowerCase().includes("an toàn")) {
          displayResultText += " An Toàn";
        }
        resultSpan.textContent = displayResultText;
        const scoreSpan = document.createElement("span");
        scoreSpan.classList.add("score");
        scoreSpan.textContent = `Bạn: ${entry.playerScore} - Đối thủ: ${entry.opponentScore}`;
        const dateSpan = document.createElement("span");
        dateSpan.classList.add("date");
        dateSpan.textContent = entry.date;
        li.appendChild(resultSpan);
        li.appendChild(scoreSpan);
        li.appendChild(dateSpan);
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
        proceedToNextRoundBtn.textContent = `Bắt Đầu Vòng ${nextRoundNumber}`;
        proceedToNextRoundBtn.classList.remove("hidden");
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
      updateTotalRoundsDisplayIngame(); // Gọi ở đây để cập nhật từ config
      calculateTotalGameQuestions();
      updateScoreDisplay();
      updateGameStatusDisplay(); // Cập nhật trạng thái game ban đầu
  
      if (memoProgressBar)
        updateProgressBar(
          memoProgressBar,
          MEMORIZATION_TIME_CONFIG,
          MEMORIZATION_TIME_CONFIG
        );
      if (ansProgressBar && ANSWER_TIME_LIMIT_CONFIG > 0) {
        updateProgressBar(
          ansProgressBar,
          ANSWER_TIME_LIMIT_CONFIG,
          ANSWER_TIME_LIMIT_CONFIG
        );
      } else if (ansProgressBar) {
        updateProgressBar(ansProgressBar, 0, 1);
        if (answerTimerDisplay) answerTimerDisplay.classList.add("hidden");
      }
      if (nextActionProgressBar)
        updateProgressBar(
          nextActionProgressBar,
          RESULT_DISPLAY_TIME_CONFIG,
          RESULT_DISPLAY_TIME_CONFIG
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
        // Nếu đã chơi hết số vòng cấu hình, endGame() sẽ được gọi từ startNextQuestion
        // khi hết câu của vòng cuối. Không cần gọi endGame ở đây.
        return;
      }
      currentQuestionInRound = 0;
      updateGameInfoDisplay();
      startMemorizationPhase();
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
  
      const totalMemoTime = MEMORIZATION_TIME_CONFIG;
      let timeLeft = totalMemoTime;
      if (memoCountdownDisplay) memoCountdownDisplay.textContent = timeLeft;
      updateProgressBar(memoProgressBar, timeLeft, totalMemoTime);
  
      clearInterval(memoTimerInterval);
      memoTimerInterval = setInterval(() => {
        timeLeft--;
        if (memoCountdownDisplay) memoCountdownDisplay.textContent = timeLeft;
        updateProgressBar(memoProgressBar, timeLeft, totalMemoTime);
        if (timeLeft <= 0) {
          clearInterval(memoTimerInterval);
          proceedToQuestions();
        }
      }, 1000);
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
        "max", "min", "middle", "even", "odd", "lessThanX", "greaterThanX",
      ];
      let validQuestionTypes = [];
      const sumsArray = Object.values(tempSums);
      const sortedEntries = Object.entries(tempSums).sort(([, a], [, b]) => a - b);
  
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
        const question = "Cột nào có tổng lớn nhất?";
        const maxVal_fallback = Math.max(tempSums.A, tempSums.B, tempSums.C);
        const maxCols_fallback = Object.keys(tempSums).filter(
          (col) => tempSums[col] === maxVal_fallback
        );
        const correctAnswer =
          maxCols_fallback.length === 1 ? maxCols_fallback[0] : "Không có";
        return {
          text: question,
          answer: correctAnswer,
          sumsForThisQuestion: tempSums,
        };
      }
  
      const type = validQuestionTypes[getRandomInt(0, validQuestionTypes.length - 1)];
      let question = "";
      let correctAnswer = "Không có";
  
      switch (type) {
        case "max":
          question = "Cột nào có tổng lớn nhất?";
          // Giả sử maxValCheck đã được tính đúng và chỉ có 1 cột max
          correctAnswer = Object.keys(tempSums).find(col => tempSums[col] === maxValCheck);
          break;
        case "min":
          question = "Cột nào có tổng nhỏ nhất?";
          correctAnswer = Object.keys(tempSums).find(col => tempSums[col] === minValCheck);
          break;
        case "middle":
          question = "Cột nào có tổng không phải lớn nhất cũng không phải nhỏ nhất?";
          correctAnswer = sortedEntries[1][0];
          break;
        case "even":
          question = "Cột nào có tổng là số chẵn?";
          const evenCols = Object.keys(tempSums).filter(
            (col) => tempSums[col] % 2 === 0
          );
          if (evenCols.length === 1) {
            correctAnswer = evenCols[0];
          } else {
            correctAnswer = "Không có";
          }
          break;
        case "odd":
          question = "Cột nào có tổng là số lẻ?";
          const oddCols = Object.keys(tempSums).filter(
            (col) => tempSums[col] % 2 !== 0
          );
          if (oddCols.length === 1) {
            correctAnswer = oddCols[0];
          } else {
            correctAnswer = "Không có";
          }
          break;
        case "lessThanX":
        case "greaterThanX":
          {
            let xValue;
            const tempSumValuesForX = Object.values(tempSums);
            const distinctSortedSumsForX = [...new Set(tempSumValuesForX)].sort(
              (a, b) => a - b
            );
            let potentialCorrectAnswer = "Không có";
            let questionGenerated = false;
            const strategies = [];
            if (distinctSortedSumsForX.length >= 2) {
              for (let i = 0; i < distinctSortedSumsForX.length - 1; i++) {
                const s1 = distinctSortedSumsForX[i];
                const s2 = distinctSortedSumsForX[i + 1];
                if (s2 - s1 > 1) {
                  strategies.push(() => {
                    const xCand = s1 + getRandomInt(1, s2 - s1 - 1);
                    let actualSatisfyingColumns;
                    if (type === "lessThanX") {
                      actualSatisfyingColumns = Object.keys(tempSums).filter(
                        (col) => tempSums[col] < xCand
                      );
                    } else {
                      actualSatisfyingColumns = Object.keys(tempSums).filter(
                        (col) => tempSums[col] > xCand
                      );
                    }
                    if (actualSatisfyingColumns.length === 1) {
                      xValue = xCand;
                      potentialCorrectAnswer = actualSatisfyingColumns[0];
                      return true;
                    } return false;
                  });
                }
              }
            }
            if (distinctSortedSumsForX.length > 1) {
              strategies.push(() => {
                if (type === "lessThanX") {
                  const targetX = distinctSortedSumsForX[1];
                  const colsLessThanTarget = Object.keys(tempSums).filter(
                    (col) => tempSums[col] < targetX
                  );
                  if (colsLessThanTarget.length === 1) {
                    xValue = targetX;
                    potentialCorrectAnswer = colsLessThanTarget[0];
                    return true;
                  }
                } return false;
              });
              strategies.push(() => {
                if (type === "greaterThanX") {
                  const targetX = distinctSortedSumsForX[distinctSortedSumsForX.length - 2];
                  const colsGreaterThanTarget = Object.keys(tempSums).filter(
                    (col) => tempSums[col] > targetX
                  );
                  if (colsGreaterThanTarget.length === 1) {
                    xValue = targetX;
                    potentialCorrectAnswer = colsGreaterThanTarget[0];
                    return true;
                  }
                } return false;
              });
            }
            if (distinctSortedSumsForX.length > 0) {
              strategies.push(() => {
                if (type === "lessThanX") xValue = distinctSortedSumsForX[0];
                else xValue = distinctSortedSumsForX[distinctSortedSumsForX.length - 1];
                potentialCorrectAnswer = "Không có";
                return true;
              });
              strategies.push(() => {
                if (type === "lessThanX")
                  xValue = Math.min(...tempSumValuesForX) - getRandomInt(1, 3);
                else xValue = Math.max(...tempSumValuesForX) + getRandomInt(1, 3);
                if (xValue < 1 && type === "lessThanX") xValue = 1;
                potentialCorrectAnswer = "Không có";
                return true;
              });
            }
            if (strategies.length > 0) {
              for (let i = strategies.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [strategies[i], strategies[j]] = [strategies[j], strategies[i]];
              }
              for (const strategy of strategies) {
                if (strategy()) { questionGenerated = true; break; }
              }
            }
            if (!questionGenerated) {
              if (distinctSortedSumsForX.length > 0) {
                xValue = type === "lessThanX"
                    ? Math.min(...tempSumValuesForX) - 1
                    : Math.max(...tempSumValuesForX) + 1;
                if (xValue < 1 && type === "lessThanX")
                  xValue = Math.min(...tempSumValuesForX);
              } else {
                xValue = tempSumValuesForX.length > 0
                    ? tempSumValuesForX[0] + (type === "lessThanX" ? 1 : -1)
                    : getRandomInt(5, 15);
              }
              potentialCorrectAnswer = "Không có";
            }
            question = `Cột nào có tổng ${
              type === "lessThanX" ? "nhỏ hơn" : "lớn hơn"
            } ${xValue}?`;
            correctAnswer = potentialCorrectAnswer;
          }
          break;
        default:
          question = "Cột nào có tổng lớn nhất?";
          const maxVal_default = Math.max(tempSums.A, tempSums.B, tempSums.C);
          const maxCols_default = Object.keys(tempSums).filter(
            (col) => tempSums[col] === maxVal_default
          );
          if (maxCols_default.length === 1) correctAnswer = maxCols_default[0];
          else correctAnswer = "Không có";
          break;
      }
      return {
        text: question,
        answer: correctAnswer,
        sumsForThisQuestion: tempSums,
      };
    }
  
    function startNextQuestion() {
      if (checkSafeWin()) return;
  
      currentQuestionInRound++;
      totalQuestionsAnsweredOverall++;
      updateGameInfoDisplay();
      updateGameStatusDisplay(); // Cập nhật thông tin thắng/thua
  
      if (currentQuestionInRound > QUESTIONS_PER_ROUND_CONFIG[currentRound]) {
        setFixedNumberAreaState(null);
        if (numberContextLabel)
          numberContextLabel.textContent =
            currentRound < TOTAL_ROUNDS_CONFIG
              ? "Đang chuyển vòng..."
              : "Hoàn tất trò chơi!";
        if (liveADisplay) liveADisplay.textContent = "?";
        if (liveBDisplay) liveBDisplay.textContent = "?";
        if (liveCDisplay) liveCDisplay.textContent = "?";
  
        if (currentRound < TOTAL_ROUNDS_CONFIG) {
          startInterRoundPhase();
        } else {
          endGame(false);
        }
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
        const totalAnsTime = ANSWER_TIME_LIMIT_CONFIG;
        let ansTimeLeft = totalAnsTime;
        if (ansCountdownDisplay) ansCountdownDisplay.textContent = ansTimeLeft;
        updateProgressBar(ansProgressBar, ansTimeLeft, totalAnsTime);
        clearInterval(answerTimerInterval);
        answerTimerInterval = setInterval(() => {
          ansTimeLeft--;
          if (ansCountdownDisplay) ansCountdownDisplay.textContent = ansTimeLeft;
          updateProgressBar(ansProgressBar, ansTimeLeft, totalAnsTime);
          if (ansTimeLeft <= 0) {
            clearInterval(answerTimerInterval);
            handleAnswer(null);
          }
        }, 1000);
      } else {
        if (answerTimerDisplay) answerTimerDisplay.classList.add("hidden");
        clearInterval(answerTimerInterval);
      }
    }
  
    function handleAnswer(playerAnswer) {
      clearInterval(answerTimerInterval);
      answerBtns.forEach((btn) => btn.classList.add("disabled"));
      cumulativeSums = { ...questionData.sumsForThisQuestion };
      let resultText = "";
      let resultClass = "";
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
      updateGameStatusDisplay(); // Cập nhật trạng thái game sau khi có kết quả
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
  
      const totalResultTime = RESULT_DISPLAY_TIME_CONFIG;
      let timeLeft = totalResultTime;
      if (nextActionCountdownDisplay)
        nextActionCountdownDisplay.textContent = timeLeft;
      updateProgressBar(nextActionProgressBar, timeLeft, totalResultTime);
      clearInterval(nextActionTimerInterval);
      nextActionTimerInterval = setInterval(() => {
        timeLeft--;
        if (nextActionCountdownDisplay)
          nextActionCountdownDisplay.textContent = timeLeft;
        updateProgressBar(nextActionProgressBar, timeLeft, totalResultTime);
        if (timeLeft <= 0) {
          clearInterval(nextActionTimerInterval);
          startNextQuestion();
        }
      }, 1000);
    }
  
    function checkSafeWin() {
      // totalQuestionsAnsweredOverall đã bao gồm câu hiện tại SẮP được hỏi
      // (vì nó được tăng ở đầu startNextQuestion)
      // Do đó, số câu thực sự còn lại là totalGameQuestions - totalQuestionsAnsweredOverall
      const questionsRemainingInGame = totalGameQuestions - totalQuestionsAnsweredOverall;
  
      if (playerScore > opponentScore + questionsRemainingInGame && questionsRemainingInGame >=0) {
          endGame(true, "Bạn đã Thắng An Toàn!");
          return true;
      }
      if (opponentScore > playerScore + questionsRemainingInGame && questionsRemainingInGame >=0) {
          endGame(true, "\"Đối Thủ\" đã Thắng An Toàn!");
          return true;
      }
      return false;
    }
  
    function endGame(isSafeWin, message = "") {
      clearInterval(memoTimerInterval);
      clearInterval(answerTimerInterval);
      clearInterval(nextActionTimerInterval);
      showPhase(gameOverScreen);
      setFixedNumberAreaState(null);
      if (fixedNumberDisplayArea)
        fixedNumberDisplayArea.classList.add("hidden");
  
      if (finalPlayerScoreDisplay)
        finalPlayerScoreDisplay.textContent = playerScore;
      if (finalOpponentScoreDisplay)
        finalOpponentScoreDisplay.textContent = opponentScore;
  
      let finalMessageText = "";
      if (isSafeWin) {
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
      saveGameResult(playerScore, opponentScore, finalMessageText);
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

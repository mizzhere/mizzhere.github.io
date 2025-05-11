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

    // --- VÙNG HIỂN THỊ SỐ CỐ ĐỊNH ---
    const fixedNumberDisplayArea = document.getElementById("fixed-number-display-area");
    const numberContextLabel = document.getElementById("number-context-label"); // SỬA TÊN BIẾN
    const liveADisplay = document.getElementById("live-a");
    const liveBDisplay = document.getElementById("live-b");
    const liveCDisplay = document.getElementById("live-c");
    // --------------------------------

    // --- KHU VỰC NỘI DUNG PHASE THAY ĐỔI ---
    const phaseContentArea = document.getElementById("phase-content-area");
    const memorizationPhaseDiv = document.getElementById("memorization-phase");
    const questionPhaseDiv = document.getElementById("question-phase");
    const resultPhaseDiv = document.getElementById("result-phase");
    const gameOverScreen = document.getElementById("game-over-screen");
    // ------------------------------------

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

    const memoProgressBar = document.getElementById('memo-progress-bar');
    const ansProgressBar = document.getElementById('ans-progress-bar');
    const nextActionProgressBar = document.getElementById('next-action-progress-bar');

    const finalResultMessageDisplay = document.getElementById(
        "final-result-message"
    );
    const finalPlayerScoreDisplay = document.getElementById("final-player-score");
    const finalOpponentScoreDisplay = document.getElementById(
        "final-opponent-score"
    );

    const memoTimeSelect = document.getElementById("memo-time-select");
    const resultTimeSelect = document.getElementById("result-time-select");


    const toggleRulesBtn = document.getElementById("toggle-rules-btn");
    const rulesContent = document.getElementById("rules-content");
    const viewHistoryBtn = document.getElementById("view-history-btn");
    const historyPopup = document.getElementById("history-popup");
    const closeHistoryPopupBtn = document.getElementById("close-history-popup-btn");
    const historyListContainer = document.getElementById("history-list-container");
    const clearHistoryBtn = document.getElementById("clear-history-btn");

    const MAX_HISTORY_ITEMS = 50; // Giới hạn số lượng mục lịch sử được lưu
    const QUESTIONS_PER_ROUND = [0, 3, 4, 5, 6, 7];
    const TOTAL_ROUNDS = 5;
    let MEMORIZATION_TIME_CONFIG = 10;
    let RESULT_DISPLAY_TIME_CONFIG = 5;
    const ANSWER_TIME_LIMIT = 3;


    let currentRound;
    let currentQuestionInRound;
    let playerScore;
    let opponentScore;
    let totalQuestionsAnsweredOverall;
    let totalGameQuestions;

    let initialNumbers = { A: 0, B: 0, C: 0 };
    let cumulativeSums = { A: 0, B: 0, C: 0 };
    let newNumbersForQuestion = { A: 0, B: 0, C: 0 }; // Đổi tên biến này cho rõ ràng
    let questionData;

    let memoTimerInterval;
    let answerTimerInterval;
    let nextActionTimerInterval; // SỬA TÊN BIẾN

    function updateProgressBar(barElement, currentTime, totalTime) {
        if (!barElement) return;
        const percentage = Math.max(0, (currentTime / totalTime) * 100);
        barElement.style.width = percentage + '%';
        barElement.classList.remove('success', 'warning', 'danger');
        barElement.style.backgroundColor = '';
        if (currentTime <= 0) {
            barElement.style.width = '0%';
        } else if (percentage <= 30) {
            barElement.classList.add('danger');
        } else if (percentage <= 60) {
            barElement.classList.add('warning');
        } else {
            barElement.style.backgroundColor = 'var(--success-color)';
        }
    }
    function loadSettings() {
        const savedMemoTime = localStorage.getItem('geniusGameMemoTime');
        if (savedMemoTime && memoTimeSelect) {
            MEMORIZATION_TIME_CONFIG = parseInt(savedMemoTime, 10);
            memoTimeSelect.value = savedMemoTime;
        } else if (memoTimeSelect) { // Set giá trị mặc định cho select nếu không có gì được lưu
            memoTimeSelect.value = MEMORIZATION_TIME_CONFIG.toString();
        }


        const savedResultTime = localStorage.getItem('geniusGameResultTime');
        if (savedResultTime && resultTimeSelect) {
            RESULT_DISPLAY_TIME_CONFIG = parseInt(savedResultTime, 10);
            resultTimeSelect.value = savedResultTime;
        } else if (resultTimeSelect) {
            resultTimeSelect.value = RESULT_DISPLAY_TIME_CONFIG.toString();
        }
    }

    // Hàm lưu cài đặt vào localStorage
    function saveSettings() {
        if (memoTimeSelect) {
            localStorage.setItem('geniusGameMemoTime', memoTimeSelect.value);
            MEMORIZATION_TIME_CONFIG = parseInt(memoTimeSelect.value, 10);
        }
        if (resultTimeSelect) {
            localStorage.setItem('geniusGameResultTime', resultTimeSelect.value);
            RESULT_DISPLAY_TIME_CONFIG = parseInt(resultTimeSelect.value, 10);
        }
    }

    // Gọi loadSettings khi DOM đã tải xong
    loadSettings();

    // Gắn event listener để lưu khi người dùng thay đổi cài đặt
    if (memoTimeSelect) {
        memoTimeSelect.addEventListener('change', saveSettings);
    }
    if (resultTimeSelect) {
        resultTimeSelect.addEventListener('change', saveSettings);
    }
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function calculateTotalGameQuestions() {
        totalGameQuestions = 0;
        for (let i = 1; i <= TOTAL_ROUNDS; i++) {
            totalGameQuestions += QUESTIONS_PER_ROUND[i];
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
            QUESTIONS_PER_ROUND[currentRound] || 0;
        memorizationRoundNumber.textContent = currentRound; // Cập nhật luôn cho H2
        questionRoundNumber.textContent = currentRound;
        questionNumberInRoundDisplay.textContent = currentQuestionInRound;
    }
    function saveGameResult(pScore, oScore, resultMsg) {
        let history = JSON.parse(localStorage.getItem('geniusGameHistory')) || [];
        const gameDate = new Date();
        const formattedDate = `${gameDate.toLocaleDateString('vi-VN')} ${gameDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`;

        let resultType = "draw";
        if (resultMsg.toLowerCase().includes("thắng") || resultMsg.toLowerCase().includes("chiến thắng")) {
            resultType = "win";
        } else if (resultMsg.toLowerCase().includes("thua") || resultMsg.toLowerCase().includes("tiếc")) {
            resultType = "lose";
        }

        const newEntry = {
            playerScore: pScore,
            opponentScore: oScore,
            resultText: resultMsg, // Lưu cả thông điệp đầy đủ
            resultType: resultType, // win, lose, draw
            date: formattedDate,
            timestamp: gameDate.getTime() // Để sort nếu cần
        };

        history.unshift(newEntry); // Thêm vào đầu mảng

        // Giới hạn số lượng mục lịch sử
        if (history.length > MAX_HISTORY_ITEMS) {
            history = history.slice(0, MAX_HISTORY_ITEMS);
        }

        localStorage.setItem('geniusGameHistory', JSON.stringify(history));
    }

    function loadAndDisplayHistory() {
        const history = JSON.parse(localStorage.getItem('geniusGameHistory')) || [];
        historyListContainer.innerHTML = ''; // Xóa nội dung cũ

        if (history.length === 0) {
            historyListContainer.innerHTML = '<p>Chưa có lịch sử nào.</p>';
            if(clearHistoryBtn) clearHistoryBtn.classList.add('hidden'); // Ẩn nút xóa nếu không có lịch sử
            return;
        }
        if(clearHistoryBtn) clearHistoryBtn.classList.remove('hidden');


        const ul = document.createElement('ul');
        ul.style.listStyleType = 'none';
        ul.style.paddingLeft = '0';

        history.forEach(entry => {
            const li = document.createElement('li');
            li.classList.add('history-item');

            const resultSpan = document.createElement('span');
            resultSpan.classList.add('result');
            resultSpan.classList.add(entry.resultType); // Thêm class win/lose/draw
            
            // Rút gọn thông điệp kết quả để hiển thị
            let displayResultText = "Hòa";
            if (entry.resultType === 'win') displayResultText = "Thắng";
            else if (entry.resultType === 'lose') displayResultText = "Thua";
            if (entry.resultText.toLowerCase().includes("an toàn")) {
                displayResultText += " An Toàn";
            }

            resultSpan.textContent = displayResultText;

            const scoreSpan = document.createElement('span');
            scoreSpan.classList.add('score');
            scoreSpan.textContent = `Bạn: ${entry.playerScore} - Đối thủ: ${entry.opponentScore}`;

            const dateSpan = document.createElement('span');
            dateSpan.classList.add('date');
            dateSpan.textContent = entry.date;

            li.appendChild(resultSpan);
            li.appendChild(scoreSpan);
            li.appendChild(dateSpan);
            ul.appendChild(li);
        });
        historyListContainer.appendChild(ul);
    }
    // Hàm quản lý hiển thị các phase chính (bao gồm cả gameOverScreen)
    function showPhase(phaseToShow) {
        [memorizationPhaseDiv, questionPhaseDiv, resultPhaseDiv, gameOverScreen].forEach(p => {
            if (p) p.classList.add("hidden");
        });

        if (phaseToShow) {
            phaseToShow.classList.remove("hidden");
        }
    }

    function showScreen(screenToShow) {
        [settingsScreen, gameScreen].forEach(s => {
            if (s) s.classList.add("hidden");
        });

        if (screenToShow) {
            screenToShow.classList.remove("hidden");
        }

        if (screenToShow === gameScreen) {
            if (fixedNumberDisplayArea) fixedNumberDisplayArea.classList.remove("hidden");
            showPhase(null); // Ẩn tất cả các phase con khi bắt đầu game screen
        } else if (screenToShow === settingsScreen) {
            if (fixedNumberDisplayArea) fixedNumberDisplayArea.classList.add("hidden");
        }
    }

    function initGame() {
        currentRound = 0;
        
        playerScore = 0;
        opponentScore = 0;
        totalQuestionsAnsweredOverall = 0;
        calculateTotalGameQuestions();
        updateScoreDisplay();

        if (memoProgressBar) updateProgressBar(memoProgressBar, MEMORIZATION_TIME_CONFIG, MEMORIZATION_TIME_CONFIG);
        if (ansProgressBar) updateProgressBar(ansProgressBar, ANSWER_TIME_LIMIT, ANSWER_TIME_LIMIT); // ANSWER_TIME_LIMIT vẫn cố định
        if (nextActionProgressBar) updateProgressBar(nextActionProgressBar, RESULT_DISPLAY_TIME_CONFIG, RESULT_DISPLAY_TIME_CONFIG);

        clearInterval(memoTimerInterval);
        clearInterval(answerTimerInterval);
        clearInterval(nextActionTimerInterval); // SỬA TÊN

        if (fixedNumberDisplayArea) fixedNumberDisplayArea.classList.remove('hidden');

        if (liveADisplay) liveADisplay.textContent = '?';
        if (liveBDisplay) liveBDisplay.textContent = '?';
        if (liveCDisplay) liveCDisplay.textContent = '?';
        if (numberContextLabel) numberContextLabel.textContent = "Đang tải vòng mới...";

        startNextRound();
    }

    function startNextRound() {
        currentRound++;
        if (currentRound > TOTAL_ROUNDS) {
            endGame(false);
            return;
        }
        currentQuestionInRound = 0;
        updateGameInfoDisplay();
        startMemorizationPhase();
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
        if (finalResultMessageDisplay) finalResultMessageDisplay.textContent = finalMessageText;

        // Lưu kết quả game
        saveGameResult(playerScore, opponentScore, finalMessageText);
    }
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', () => {
            loadAndDisplayHistory();
            if (historyPopup) historyPopup.classList.remove('hidden');
        });
    }

    if (closeHistoryPopupBtn) {
        closeHistoryPopupBtn.addEventListener('click', () => {
            if (historyPopup) historyPopup.classList.add('hidden');
        });
    }

    if (historyPopup) { // Đóng popup khi click bên ngoài content
        historyPopup.addEventListener('click', (event) => {
            if (event.target === historyPopup) {
                historyPopup.classList.add('hidden');
            }
        });
    }


    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', () => {
            if (confirm("Bạn có chắc chắn muốn xóa toàn bộ lịch sử chơi không?")) {
                localStorage.removeItem('geniusGameHistory');
                loadAndDisplayHistory(); // Tải lại để hiển thị "Chưa có lịch sử"
            }
        });
    }
    function startMemorizationPhase() {
        showPhase(memorizationPhaseDiv); // SỬA: Dùng showPhase
        if (proceedToQuestionsBtn) proceedToQuestionsBtn.classList.add("hidden");

        if (numberContextLabel) numberContextLabel.textContent = "Số ban đầu (Ghi nhớ):";

        initialNumbers = {
            A: getRandomInt(1, 9),
            B: getRandomInt(1, 9),
            C: getRandomInt(1, 9),
        };
        cumulativeSums = { ...initialNumbers };

        if (liveADisplay) liveADisplay.textContent = initialNumbers.A;
        if (liveBDisplay) liveBDisplay.textContent = initialNumbers.B;
        if (liveCDisplay) liveCDisplay.textContent = initialNumbers.C;

        const totalMemoTime = MEMORIZATION_TIME_CONFIG; // SỬ DỤNG GIÁ TRỊ CẤU HÌNH
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
                // if (proceedToQuestionsBtn) proceedToQuestionsBtn.classList.remove("hidden"); // Bỏ nếu tự động chuyển
                proceedToQuestions();
            }
        }, 1000);
    }

    function proceedToQuestions() {
        if (numberContextLabel) numberContextLabel.textContent = "Số mới cho câu hỏi:";
        startNextQuestion(); // SỬA: Xóa 1 lần gọi
    }

    function generateQuestion() {
        newNumbersForQuestion = { // Sử dụng biến này nhất quán
            A: getRandomInt(1, 9),
            B: getRandomInt(1, 9),
            C: getRandomInt(1, 9),
        };

        if (liveADisplay) liveADisplay.textContent = newNumbersForQuestion.A;
        if (liveBDisplay) liveBDisplay.textContent = newNumbersForQuestion.B;
        if (liveCDisplay) liveCDisplay.textContent = newNumbersForQuestion.C;

        const tempSums = {
            A: cumulativeSums.A + newNumbersForQuestion.A,
            B: cumulativeSums.B + newNumbersForQuestion.B,
            C: cumulativeSums.C + newNumbersForQuestion.C,
        };

        // ... (Logic tạo câu hỏi giữ nguyên từ phiên bản trước của bạn, đã được cải thiện)
        const questionTypes = [
            "max", "min", "middle", "even", "odd", "lessThanX", "greaterThanX",
        ];
        let availableTypes = [...questionTypes];
        const distinctSumCount = new Set(Object.values(tempSums)).size;

        if (distinctSumCount < 3) {
            availableTypes = availableTypes.filter(t => t !== "middle");
        }
        
        const type = availableTypes.length > 0 ? availableTypes[getRandomInt(0, availableTypes.length - 1)] : "max";
        let question = "";
        let correctAnswer = "Không có";

        const sortedValues = Object.entries(tempSums).sort(([, a], [, b]) => a - b);

        switch (type) {
            case "max":
                question = "Cột nào có tổng lớn nhất?";
                const maxVal = Math.max(tempSums.A, tempSums.B, tempSums.C);
                const maxCols = Object.keys(tempSums).filter(col => tempSums[col] === maxVal);
                if (maxCols.length === 1) correctAnswer = maxCols[0];
                break;
            case "min":
                question = "Cột nào có tổng nhỏ nhất?";
                const minVal = Math.min(tempSums.A, tempSums.B, tempSums.C);
                const minCols = Object.keys(tempSums).filter(col => tempSums[col] === minVal);
                if (minCols.length === 1) correctAnswer = minCols[0];
                break;
            case "middle":
                question = "Cột nào có tổng không phải lớn nhất cũng không phải nhỏ nhất?";
                if (distinctSumCount === 3 && sortedValues[0][1] < sortedValues[1][1] && sortedValues[1][1] < sortedValues[2][1]) {
                     correctAnswer = sortedValues[1][0];
                }
                break;
                case "even":
                    question = "Cột nào có tổng là số chẵn?";
                    const evenCols = Object.keys(tempSums).filter(col => tempSums[col] % 2 === 0);
                    if (evenCols.length === 1) {
                        correctAnswer = evenCols[0];
                    } else if (evenCols.length === 0) { // Tức là cả 3 cột đều lẻ
                        correctAnswer = "Không có";
                    }
                    // Nếu evenCols.length là 2 hoặc 3, câu hỏi này không hợp lệ theo luật
                    // Trong trường hợp này, generateQuestion sẽ cần thử lại một loại câu hỏi khác
                    // hoặc đảm bảo tempSums được tạo ra sao cho không rơi vào TH này nếu type là "even"
                    break;
    
                case "odd":
                    question = "Cột nào có tổng là số lẻ?";
                    const oddCols = Object.keys(tempSums).filter(col => tempSums[col] % 2 !== 0);
                    if (oddCols.length === 1) {
                        correctAnswer = oddCols[0];
                    } else if (oddCols.length === 0) { // Tức là cả 3 cột đều chẵn
                        correctAnswer = "Không có";
                    }
                    // Nếu oddCols.length là 2 hoặc 3, câu hỏi này không hợp lệ theo luật
                    break;
    
            case "lessThanX":
            case "greaterThanX":
                {
                    let xValue;
                    const tempSumValues = Object.values(tempSums);
                    const distinctSortedSums = [...new Set(tempSumValues)].sort((a, b) => a - b);
                    let potentialCorrectAnswer = "Không có";
                    let questionGenerated = false;
                    const strategies = [];

                    if (distinctSortedSums.length >= 2) {
                        for (let i = 0; i < distinctSortedSums.length - 1; i++) {
                            const s1 = distinctSortedSums[i];
                            const s2 = distinctSortedSums[i + 1];
                            if (s2 - s1 > 1) {
                                strategies.push(() => {
                                    const xCand = s1 + getRandomInt(1, s2 - s1 - 1);
                                    let actualSatisfyingColumns;
                                    if (type === "lessThanX") {
                                        actualSatisfyingColumns = Object.keys(tempSums).filter(col => tempSums[col] < xCand);
                                    } else {
                                        actualSatisfyingColumns = Object.keys(tempSums).filter(col => tempSums[col] > xCand);
                                    }
                                    if (actualSatisfyingColumns.length === 1) {
                                        xValue = xCand;
                                        potentialCorrectAnswer = actualSatisfyingColumns[0];
                                        return true;
                                    }
                                    return false;
                                });
                            }
                        }
                    }

                    if (distinctSortedSums.length > 1) {
                        strategies.push(() => {
                            const targetX = distinctSortedSums[1];
                            const colsLessThanTarget = Object.keys(tempSums).filter(col => tempSums[col] < targetX);
                            if (colsLessThanTarget.length === 1 && type === "lessThanX") {
                                xValue = targetX;
                                potentialCorrectAnswer = colsLessThanTarget[0];
                                return true;
                            }
                            return false;
                        });
                        strategies.push(() => {
                            const targetX = distinctSortedSums[distinctSortedSums.length - 2];
                            const colsGreaterThanTarget = Object.keys(tempSums).filter(col => tempSums[col] > targetX);
                            if (colsGreaterThanTarget.length === 1 && type === "greaterThanX") {
                                xValue = targetX;
                                potentialCorrectAnswer = colsGreaterThanTarget[0];
                                return true;
                            }
                            return false;
                        });
                    }
                    
                    if (distinctSortedSums.length > 0) {
                        strategies.push(() => { 
                            if (type === "lessThanX") xValue = distinctSortedSums[0]; 
                            else xValue = distinctSortedSums[distinctSortedSums.length -1]; 
                            potentialCorrectAnswer = "Không có";
                            return true;
                        });
                         strategies.push(() => { 
                            if (type === "lessThanX") xValue = Math.min(...tempSumValues) - getRandomInt(1,3);
                            else xValue = Math.max(...tempSumValues) + getRandomInt(1,3);
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
                            if (strategy()) {
                                questionGenerated = true;
                                break;
                            }
                        }
                    }

                    if (!questionGenerated) { 
                        if (distinctSortedSums.length > 0) {
                            xValue = (type === "lessThanX") ? Math.min(...tempSumValues) - 1 : Math.max(...tempSumValues) + 1;
                            if (xValue < 1 && type === "lessThanX") xValue = Math.min(...tempSumValues);
                        } else { 
                             xValue = tempSumValues.length > 0 ? tempSumValues[0] + (type === "lessThanX" ? 1 : -1) : getRandomInt(5,15); // Adjusted fallback
                        }
                        potentialCorrectAnswer = "Không có";
                    }
                    question = `Cột nào có tổng ${type === "lessThanX" ? "nhỏ hơn" : "lớn hơn"} ${xValue}?`;
                    correctAnswer = potentialCorrectAnswer;
                }
                break;
            default: 
                question = "Cột nào có tổng lớn nhất?";
                const maxVal_fallback = Math.max(tempSums.A, tempSums.B, tempSums.C);
                const maxCols_fallback = Object.keys(tempSums).filter(col => tempSums[col] === maxVal_fallback);
                if (maxCols_fallback.length === 1) correctAnswer = maxCols_fallback[0];
                else correctAnswer = "Không có";
                break;
        }
        return { text: question, answer: correctAnswer, sumsForThisQuestion: tempSums };
    }

    function startNextQuestion() {
        if (checkSafeWin()) return; // Gọi trước khi tăng totalQuestionsAnsweredOverall

        currentQuestionInRound++;
        totalQuestionsAnsweredOverall++;
        updateGameInfoDisplay();

        if (currentQuestionInRound > QUESTIONS_PER_ROUND[currentRound]) {
            if (numberContextLabel) numberContextLabel.textContent = "Đang chuyển vòng...";
            if (liveADisplay) liveADisplay.textContent = "?";
            if (liveBDisplay) liveBDisplay.textContent = "?";
            if (liveCDisplay) liveCDisplay.textContent = "?";
            startNextRound();
            return;
        }

        showPhase(questionPhaseDiv); // SỬA: Dùng showPhase
        if (numberContextLabel) numberContextLabel.textContent = "Số mới cho câu hỏi:";
        answerBtns.forEach((btn) => btn.classList.remove("disabled"));

        questionData = generateQuestion();
        if (questionTextDisplay) questionTextDisplay.textContent = questionData.text;
        // currentCorrectAnswer đã được gán trong questionData.answer từ generateQuestion()

        const USE_ANSWER_TIMER = false;
        if (USE_ANSWER_TIMER) {
            // ... (logic timer)
        } else {
            if (answerTimerDisplay) answerTimerDisplay.classList.add('hidden');
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
        } else if (playerAnswer === questionData.answer) { // So sánh với questionData.answer
            playerScore++;
            resultText = "Chính xác! +1 điểm.";
            resultClass = "correct";
        } else {
            opponentScore++;
            resultText = `Sai rồi! Đáp án đúng: ${questionData.answer}. Đối thủ +1 điểm.`; // Lấy từ questionData.answer
            resultClass = "incorrect";
        }
        if (resultMessageDisplay) {
            resultMessageDisplay.textContent = resultText;
            resultMessageDisplay.className = ""; // Xóa class cũ
            resultMessageDisplay.classList.add(resultClass);
        }

        updateScoreDisplay();
        displayResultsAndProceed();
    }

    function displayResultsAndProceed() {
        showPhase(resultPhaseDiv); // SỬA: Dùng showPhase

        if (liveADisplay) liveADisplay.textContent = "?";
        if (liveBDisplay) liveBDisplay.textContent = "?";
        if (liveCDisplay) liveCDisplay.textContent = "?";
        if (numberContextLabel) numberContextLabel.textContent = "Kết quả & Tổng Lũy Kế:";

        if (cumulativeADisplay) cumulativeADisplay.textContent = cumulativeSums.A;
        if (cumulativeBDisplay) cumulativeBDisplay.textContent = cumulativeSums.B;
        if (cumulativeCDisplay) cumulativeCDisplay.textContent = cumulativeSums.C;

        const totalResultTime = RESULT_DISPLAY_TIME_CONFIG; // SỬ DỤNG GIÁ TRỊ CẤU HÌNH
        let timeLeft = totalResultTime;
        if (nextActionCountdownDisplay) nextActionCountdownDisplay.textContent = timeLeft;
        updateProgressBar(nextActionProgressBar, timeLeft, totalResultTime);

        clearInterval(nextActionTimerInterval);
        nextActionTimerInterval = setInterval(() => {
            timeLeft--;
            if (nextActionCountdownDisplay) nextActionCountdownDisplay.textContent = timeLeft;
            updateProgressBar(nextActionProgressBar, timeLeft, totalResultTime);
            if (timeLeft <= 0) {
                clearInterval(nextActionTimerInterval); // SỬA TÊN
                startNextQuestion();
            }
        }, 1000);
    }

    function checkSafeWin() {
        const questionsRemainingInGame = totalGameQuestions - totalQuestionsAnsweredOverall;
        if (playerScore > opponentScore + questionsRemainingInGame && questionsRemainingInGame >= 0) {
            endGame(true, "Bạn đã Thắng An Toàn!");
            return true;
        }
        if (opponentScore > playerScore + questionsRemainingInGame && questionsRemainingInGame >= 0) {
            endGame(true, "\"Đối Thủ\" đã Thắng An Toàn!");
            return true;
        }
        return false;
    }

    function endGame(isSafeWin, message = "") {
        clearInterval(memoTimerInterval);
        clearInterval(answerTimerInterval);
        clearInterval(nextActionTimerInterval); // SỬA TÊN

        showPhase(gameOverScreen); // SỬA: Dùng showPhase để hiển thị gameOverScreen
        if (fixedNumberDisplayArea) fixedNumberDisplayArea.classList.add("hidden");

        if (finalPlayerScoreDisplay) finalPlayerScoreDisplay.textContent = playerScore;
        if (finalOpponentScoreDisplay) finalOpponentScoreDisplay.textContent = opponentScore;

        if (isSafeWin) {
            if (finalResultMessageDisplay) finalResultMessageDisplay.textContent = message;
        } else {
            if (playerScore > opponentScore) {
                if (finalResultMessageDisplay) finalResultMessageDisplay.textContent = "CHÚC MỪNG BẠN ĐÃ CHIẾN THẮNG!";
            } else if (opponentScore > playerScore) {
                if (finalResultMessageDisplay) finalResultMessageDisplay.textContent = "Rất tiếc, bạn đã thua cuộc.";
            } else {
                if (finalResultMessageDisplay) finalResultMessageDisplay.textContent = "Kết quả HÒA!";
            }
        }
    }

    if (startGameBtn) startGameBtn.addEventListener("click", () => {
        showScreen(gameScreen);
        initGame();
    });

    if (restartGameBtn) restartGameBtn.addEventListener("click", () => {
        showScreen(gameScreen);
        initGame();
    });

    if (ingameRestartBtn) ingameRestartBtn.addEventListener("click", () => {
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

    if (toggleRulesBtn) toggleRulesBtn.addEventListener("click", () => {
        if (rulesContent) rulesContent.classList.toggle("hidden");
    });

    showScreen(settingsScreen);
});

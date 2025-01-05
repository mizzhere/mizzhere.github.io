const boardSize = 7;
const escapeCell = [3, 3];
let pieces = {
  D1: null, D2: null, D3: null, D4: null, D5: null, D6: null,
  W1: null, W2: null, W3: null, W4: null, W5: null, W6: null
};
let blackEscaped = 0, whiteEscaped = 0;
let selectedPiece = null;
let turn = "D"; // Lượt chơi: "D" = Đen, "W" = Trắng

const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const scoreElement = document.getElementById("score");

// Thêm chướng ngại vật vào bàn cờ
const obstacles = [
  [3, 0], // Chướng ngại vật tại (3, 0)
  [3, 6]  // Chướng ngại vật tại (3, 6)
];

// Hàm kiểm tra xem ô có phải là chướng ngại vật không
function isObstacle(row, col) {
  return obstacles.some(([r, c]) => r === row && c === col);
}

// Hàm vẽ chướng ngại vật trên bàn cờ
function drawObstacles() {
  obstacles.forEach(([row, col]) => {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add("obstacle");
  });
}

// Hàm tạo bàn cờ
function createBoard() {
  boardElement.style.gridTemplateColumns = `repeat(${boardSize}, 1fr)`;
  boardElement.style.gridTemplateRows = `repeat(${boardSize}, 1fr)`;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = row;
      cell.dataset.col = col;
      boardElement.appendChild(cell);
    }
  }

  drawObstacles(); // Vẽ chướng ngại vật sau khi tạo bàn cờ
}

// Hàm kiểm tra điều kiện không có quá 2 quân trong cùng 1 hàng hoặc 1 cột
function isValidPlacement(row, col, color) {
  let countRow = 0, countCol = 0;

  // Kiểm tra hàng
  for (let i = 0; i < boardSize; i++) {
    const piece = getPieceAt(row, i);
    if (piece && piece.startsWith(color)) countRow++;
  }

  // Kiểm tra cột
  for (let i = 0; i < boardSize; i++) {
    const piece = getPieceAt(i, col);
    if (piece && piece.startsWith(color)) countCol++;
  }

  return countRow < 2 && countCol < 2;
}

// Hàm lấy quân tại vị trí (row, col)
function getPieceAt(row, col) {
  for (const [piece, position] of Object.entries(pieces)) {
    if (position && position[0] === row && position[1] === col) {
      return piece;
    }
  }
  return null;
}

// Hàm xếp ngẫu nhiên các quân
// Hàm xếp ngẫu nhiên các quân
function randomizePieces() {
  const availableBlackPositions = [];
  const availableWhitePositions = [];

  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < 3; col++) {
      if (!isObstacle(row, col)) {
        availableBlackPositions.push([row, col]);
      }
    }
    for (let col = 4; col < boardSize; col++) {
      if (!isObstacle(row, col)) {
        availableWhitePositions.push([row, col]);
      }
    }
  }

  let blackCount = 0;
  while (blackCount < 6) {
    const randomIndex = Math.floor(Math.random() * availableBlackPositions.length);
    const [row, col] = availableBlackPositions.splice(randomIndex, 1)[0];
    if (isValidPlacement(row, col, 'D')) {
      pieces[`D${blackCount + 1}`] = [row, col];
      blackCount++;
    } else {
      availableBlackPositions.push([row, col]);
    }
  }

  let whiteCount = 0;
  while (whiteCount < 6) {
    const randomIndex = Math.floor(Math.random() * availableWhitePositions.length);
    const [row, col] = availableWhitePositions.splice(randomIndex, 1)[0];
    if (isValidPlacement(row, col, 'W')) {
      pieces[`W${whiteCount + 1}`] = [row, col];
      whiteCount++;
    } else {
      availableWhitePositions.push([row, col]);
    }
  }

  drawPieces();
}


// Hàm vẽ các quân cờ
function drawPieces() {
  boardElement.querySelectorAll(".piece").forEach(piece => piece.remove());

  for (const [piece, [row, col]] of Object.entries(pieces)) {
    if (row !== null && col !== null) {
      const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
      const pieceElement = document.createElement("div");
      pieceElement.classList.add("piece", piece.startsWith("D") ? "black" : "white");
      pieceElement.textContent = piece;
      pieceElement.dataset.piece = piece;
      cell.appendChild(pieceElement);
    }
  }
}

// Tô sáng các ô của đội đang đến lượt
function highlightTurn() {
  document.querySelectorAll(".cell").forEach(cell => {
    cell.classList.remove("highlight");

    const row = parseInt(cell.dataset.row, 10);
    const col = parseInt(cell.dataset.col, 10);

    Object.entries(pieces).forEach(([piece, [r, c]]) => {
      if (r === row && c === col && piece.startsWith(turn)) {
        cell.classList.add("highlight");
      }
    });
  });
}

// Cập nhật ô thoát hiểm với màu sắc rõ ràng hơn
function updateEscapeCell() {
  const escapeCellElement = document.querySelector(`.cell[data-row='${escapeCell[0]}'][data-col='${escapeCell[1]}']`);
  escapeCellElement.classList.add("escape");
}

// Đánh dấu ô được chọn
function highlightSelectedCell() {
  document.querySelectorAll(".cell").forEach(cell => cell.classList.remove("selected"));
  if (selectedPiece && pieces[selectedPiece]) {
    const [row, col] = pieces[selectedPiece];
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    cell.classList.add("selected");
  }
}

// Cập nhật điểm số
function updateScore() {
  //scoreElement.textContent = `Black escaped: ${blackEscaped} | White escaped: ${whiteEscaped}`;
}

// Kiểm tra thắng
function checkVictory() {
  if (blackEscaped >= 2) {
    statusElement.textContent = "Black team wins!";
    document.removeEventListener("keydown", handleMove);
  } else if (whiteEscaped >= 2) {
    statusElement.textContent = "White team wins!";
    document.removeEventListener("keydown", handleMove);
  }
}

// Di chuyển quân cờ
function movePiece(direction) {
  if (!selectedPiece || !pieces[selectedPiece]) return;
  let [row, col] = pieces[selectedPiece];
  let [dx, dy] = [0, 0];

  if (direction === "ArrowUp") dx = -1;
  else if (direction === "ArrowDown") dx = 1;
  else if (direction === "ArrowLeft") dy = -1;
  else if (direction === "ArrowRight") dy = 1;

  // Di chuyển đến tận cùng
  while (true) {
    const newRow = row + dx;
    const newCol = col + dy;

    // Kiểm tra nếu ra ngoài bàn cờ
    if (newRow < 0 || newRow >= boardSize || newCol < 0 || newCol >= boardSize) break;

    // Kiểm tra nếu gặp quân khác
    const pieceAtNewPosition = getPieceAt(newRow, newCol);
    if (pieceAtNewPosition) break;

    // Kiểm tra nếu gặp chướng ngại vật
    if (isObstacle(newRow, newCol)) break;

    // Cập nhật vị trí
    row = newRow;
    col = newCol;
  }

  // Kiểm tra nếu vị trí mới hợp lệ và không có quân cờ nào
  if (row !== pieces[selectedPiece][0] || col !== pieces[selectedPiece][1]) {
    pieces[selectedPiece] = [row, col];

    // Kiểm tra ô thoát hiểm
    if (row === escapeCell[0] && col === escapeCell[1]) {
      statusElement.textContent = `${selectedPiece} has escaped!`;
      if (selectedPiece.startsWith("D")) blackEscaped++;
      else whiteEscaped++;
      delete pieces[selectedPiece];
    }

    // Cập nhật trạng thái và lượt chơi
    selectedPiece = null;
    turn = turn === "D" ? "W" : "D";
    statusElement.textContent = `${turn === "D" ? "Black" : "White"}'s turn. Select a piece to move.`;
    drawPieces();
    highlightTurn();
    updateScore();
    checkVictory();
  }
}

// Sự kiện click chọn quân cờ trên máy tính
boardElement.addEventListener("click", e => {
  if (e.target.classList.contains("piece")) {
    const piece = e.target.dataset.piece;
    if (piece.startsWith(turn)) {
      selectedPiece = piece;
      statusElement.textContent = `Selected ${selectedPiece}. Use arrow keys to move.`;
      highlightSelectedCell();
    } else {
      statusElement.textContent = `It's ${turn === "D" ? "Black" : "White"}'s turn!`;
    }
  }
});

// Sự kiện di chuyển quân cờ bằng phím mũi tên trên máy tính
function handleMove(e) {
  if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
    movePiece(e.key);
    highlightSelectedCell();
  }
}
document.addEventListener("keydown", handleMove);

// Sự kiện chạm trên điện thoại
boardElement.addEventListener("touchstart", e => {
  if (e.target.classList.contains("piece")) {
    const piece = e.target.dataset.piece;
    if (piece.startsWith(turn)) {
      selectedPiece = piece;
      statusElement.textContent = `Selected ${selectedPiece}. Use your finger to move.`;
      highlightSelectedCell();
    } else {
      statusElement.textContent = `It's ${turn === "D" ? "Black" : "White"}'s turn!`;
    }
  }
});

boardElement.addEventListener("touchmove", e => {
  e.preventDefault();
  if (!selectedPiece || !pieces[selectedPiece]) return;

  const touch = e.touches[0];
  const cellSize = 40;  // Kích thước mỗi ô, giả sử mỗi ô là 40px

  const row = Math.floor((touch.clientY - boardElement.offsetTop) / cellSize);
  const col = Math.floor((touch.clientX - boardElement.offsetLeft) / cellSize);

  // Kiểm tra nếu vị trí mới hợp lệ và không có quân cờ nào
  if (row >= 0 && row < boardSize && col >= 0 && col < boardSize && isValidPlacement(row, col, turn)) {
    pieces[selectedPiece] = [row, col];
    drawPieces();
    highlightSelectedCell();
  }
});


// Khởi tạo trò chơi
createBoard();
randomizePieces();
highlightTurn();
updateEscapeCell();
updateScore();

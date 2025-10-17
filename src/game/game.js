// Generate an empty board of given size
export function generateEmptyBoard(size = 4) {
  return Array(size)
    .fill(null)
    .map(() => Array(size).fill(0));
}

// Get all empty cells on the board
export function getEmptyCells(board) {
  const empty = [];
  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[r].length; c++) {
      if (board[r][c] === 0) empty.push([r, c]);
    }
  }
  return empty;
}

// Add a random tile (2 or 4) to a random empty cell
export function addRandomTile(board) {
  const emptyCells = getEmptyCells(board);
  if (emptyCells.length === 0) return board;
  const [r, c] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[r][c] = Math.random() < 0.9 ? 2 : 4;
  return board;
}

// Initialize the board with two random tiles
export function initializeBoard(size = 4) {
  let board = generateEmptyBoard(size);
  board = addRandomTile(board);
  board = addRandomTile(board);
  return board;
}

// Slide and merge a single row to the left, return new row and score
export function slide(row) {
  let score = 0;
  row = row.filter((v) => v !== 0);
  for (let i = 0; i < row.length - 1; i++) {
    if (row[i] === row[i + 1]) {
      row[i] *= 2;
      score += row[i];
      row[i + 1] = 0;
    }
  }
  row = row.filter((v) => v !== 0);
  while (row.length < 4) row.push(0);
  return { row, score };
}

// Move board left
export function moveLeft(board) {
  let totalScore = 0;
  const newBoard = board.map((r) => {
    const { row, score } = slide([...r]);
    totalScore += score;
    return row;
  });
  return { newBoard, totalScore };
}

// Move board right
export function moveRight(board) {
  let totalScore = 0;
  const newBoard = board.map((r) => {
    const { row, score } = slide([...r].reverse());
    totalScore += score;
    return row.reverse();
  });
  return { newBoard, totalScore };
}

// Move board up
export function moveUp(board) {
  let newBoard = transpose(board);
  const { newBoard: moved, totalScore } = moveLeft(newBoard);
  return { newBoard: transpose(moved), totalScore };
}

// Move board down
export function moveDown(board) {
  let newBoard = transpose(board);
  const { newBoard: moved, totalScore } = moveRight(newBoard);
  return { newBoard: transpose(moved), totalScore };
}

// Helper function to transpose the board
function transpose(board) {
  return board[0].map((_, c) => board.map((r) => r[c]));
}

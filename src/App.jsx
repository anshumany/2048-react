import { useState, useEffect } from "react";
import {
  initializeBoard,
  moveLeft,
  moveRight,
  moveUp,
  moveDown,
  addRandomTile,
  getEmptyCells,
} from "./game/game";
import "./App.css";

function App() {
  const [board, setBoard] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setBoard(initializeBoard());
    setScore(0);
    setGameOver(false);
  };

  useEffect(() => {
    startGame();
  }, []);

  const hasMoves = (board) => {
    if (getEmptyCells(board).length > 0) return true;
    for (let r = 0; r < 4; r++)
      for (let c = 0; c < 3; c++)
        if (board[r][c] === board[r][c + 1]) return true;
    for (let c = 0; c < 4; c++)
      for (let r = 0; r < 3; r++)
        if (board[r][c] === board[r + 1][c]) return true;
    return false;
  };

  const handleKeyDown = (e) => {
    if (gameOver) return;

    let moveResult;
    if (e.key === "ArrowLeft") moveResult = moveLeft(board);
    else if (e.key === "ArrowRight") moveResult = moveRight(board);
    else if (e.key === "ArrowUp") moveResult = moveUp(board);
    else if (e.key === "ArrowDown") moveResult = moveDown(board);
    else return;

    const { newBoard, totalScore } = moveResult;

    if (JSON.stringify(newBoard) !== JSON.stringify(board)) {
      const boardWithNewTile = addRandomTile(newBoard);
      setBoard(boardWithNewTile);
      setScore(score + totalScore);
      if (!hasMoves(boardWithNewTile)) setGameOver(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [board, score, gameOver]);

  return (
    <div className="game-container">
      <h1>2048 Game</h1>
      <p>Score: {score}</p>
      <button onClick={startGame}>Restart</button>
      <div className="board">
        {board.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div key={j} className={`cell value-${cell}`}>
                {cell !== 0 ? cell : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
      {gameOver && <h2>Game Over!</h2>}
    </div>
  );
}

export default App;

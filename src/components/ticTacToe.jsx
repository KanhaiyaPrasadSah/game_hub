import React, { useState, useEffect } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);
  const [mode, setMode] = useState("pvp"); // "pvp" | "cpu"

  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Cols
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  const calculateWinner = (squares) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: combo };
      }
    }
    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return;

    // If playing vs computer, only allow human (X) to click
    if (mode === "cpu" && !isXNext) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? "X" : "O";
    updateGameState(newBoard, !isXNext);
  };

  const updateGameState = (newBoard, nextIsX) => {
    const result = calculateWinner(newBoard);
    if (result) {
      setBoard(newBoard);
      setWinner(result.player);
      setWinningLine(result.line);
    } else if (!newBoard.includes(null)) {
      setBoard(newBoard);
      setWinner("Draw");
      setWinningLine([]);
    } else {
      setBoard(newBoard);
      setIsXNext(nextIsX);
    }
  };

  // Simple AI move for computer (O)
  const makeComputerMove = () => {
    const squares = [...board];

    // 1) Try to win
    const winMove = findBestMove(squares, "O");
    if (winMove !== null) {
      squares[winMove] = "O";
      updateGameState(squares, true);
      return;
    }

    // 2) Block X from winning
    const blockMove = findBestMove(squares, "X");
    if (blockMove !== null) {
      squares[blockMove] = "O";
      updateGameState(squares, true);
      return;
    }

    // 3) Otherwise random empty cell
    const emptyIndices = squares
      .map((val, idx) => (val === null ? idx : null))
      .filter((v) => v !== null);

    if (emptyIndices.length === 0) return; // no move possible

    const randomIndex =
      emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    squares[randomIndex] = "O";
    updateGameState(squares, true);
  };

  const findBestMove = (squares, player) => {
    for (let [a, b, c] of winningCombinations) {
      const line = [squares[a], squares[b], squares[c]];
      const playerCount = line.filter((v) => v === player).length;
      const emptyIndexInLine = [a, b, c].find((idx) => squares[idx] === null);
      if (playerCount === 2 && emptyIndexInLine !== undefined) {
        return emptyIndexInLine;
      }
    }
    return null;
  };

  // Trigger computer move when mode is CPU, no winner, and it's O's turn
  useEffect(() => {
    if (mode === "cpu" && !winner && !isXNext) {
      const timer = setTimeout(() => {
        makeComputerMove();
      }, 500); // small delay for better UX
      return () => clearTimeout(timer);
    }
  }, [mode, isXNext, winner, board]);

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    // reset game when changing mode
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  const statusColor =
    winner && winner !== "Draw"
      ? winner === "X"
        ? "#3b82f6"
        : "#ef4444"
      : isXNext
      ? "#3b82f6"
      : "#ef4444";

  return (
    <div className="ttt-container">
      <h2 className="ttt-title">Tic Tac Toe</h2>

      {/* Mode Selection */}
      <div className="ttt-mode-toggle">
        <button
          className={`ttt-mode-btn ${mode === "pvp" ? "active" : ""}`}
          onClick={() => handleModeChange("pvp")}
        >
          Player vs Player
        </button>
        <button
          className={`ttt-mode-btn ${mode === "cpu" ? "active" : ""}`}
          onClick={() => handleModeChange("cpu")}
        >
          Player vs Computer
        </button>
      </div>

      <div
        className={`ttt-status ${winner ? "game-over" : ""}`}
        style={{ color: statusColor }}
      >
        {winner
          ? winner === "Draw"
            ? "It's a Draw!"
            : `Winner: ${winner}`
          : mode === "cpu"
          ? `Turn: ${isXNext ? "You (X)" : "Computer (O)"}`
          : `Turn: ${isXNext ? "X" : "O"}`}
      </div>

      <div className="ttt-grid">
        {board.map((square, i) => (
          <button
            key={i}
            className={`ttt-square ${
              winningLine.includes(i) ? "winner-sq" : ""
            } ${square ? "filled" : ""}`}
            onClick={() => handleClick(i)}
            style={{
              color: square === "X" ? "#3b82f6" : "#ef4444",
            }}
          >
            {square}
          </button>
        ))}
      </div>

      <button className="ttt-reset-btn" onClick={resetGame}>
        Reset Match
      </button>
    </div>
  );
};

export default TicTacToe;

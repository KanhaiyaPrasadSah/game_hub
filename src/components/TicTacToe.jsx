import React, { useState } from 'react';
import './TicTacToe.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [winner, setWinner] = useState(null);
  const [winningLine, setWinningLine] = useState([]);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  const handleClick = (index) => {
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = isXNext ? 'X' : 'O';
    setBoard(newBoard);

    const result = calculateWinner(newBoard);
    if (result) {
      setWinner(result.player);
      setWinningLine(result.line);
    } else if (!newBoard.includes(null)) {
      setWinner('Draw');
    } else {
      setIsXNext(!isXNext);
    }
  };

  const calculateWinner = (squares) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { player: squares[a], line: combo };
      }
    }
    return null;
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
  };

  return (
    <div className="ttt-container">
      <h2 className="ttt-title">Tic Tac Toe</h2>
      
      <div className={`ttt-status ${winner ? 'game-over' : ''}`} 
           style={{ color: isXNext ? '#3b82f6' : '#ef4444' }}>
        {winner ? (winner === 'Draw' ? "It's a Draw!" : `Winner: ${winner}`) : `Turn: ${isXNext ? 'X' : 'O'}`}
      </div>

      <div className="ttt-grid">
        {board.map((square, i) => (
          <button
            key={i}
            className={`ttt-square ${winningLine.includes(i) ? 'winner-sq' : ''} ${square ? 'filled' : ''}`}
            onClick={() => handleClick(i)}
            style={{ color: square === 'X' ? '#3b82f6' : '#ef4444' }}
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
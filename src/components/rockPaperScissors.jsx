import React, { useState } from 'react';
import './RockPaperScissors.css';

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [result, setResult] = useState("Choose your move!");
  const [isShaking, setIsShaking] = useState(false);
  const [scores, setScores] = useState({ player: 0, computer: 0 });

  const choices = [
    { name: 'Stone', emoji: '✊', beats: 'Scissors' },
    { name: 'Paper', emoji: '✋', beats: 'Stone' },
    { name: 'Scissors', emoji: '✌️', beats: 'Paper' }
  ];

  const playGame = (choice) => {
    if (isShaking) return;

    setIsShaking(true);
    setResult("Wait for it...");
    
    // Reset choices for the animation phase
    setPlayerChoice(null);
    setComputerChoice(null);

    setTimeout(() => {
      const computerMove = choices[Math.floor(Math.random() * choices.length)];
      const playerMove = choices.find(c => c.name === choice);

      setPlayerChoice(playerMove);
      setComputerChoice(computerMove);
      setIsShaking(false);

      if (playerMove.name === computerMove.name) {
        setResult("It's a Tie! 🤝");
      } else if (playerMove.beats === computerMove.name) {
        setResult("You Win! 🎉");
        setScores(prev => ({ ...prev, player: prev.player + 1 }));
      } else {
        setResult("Computer Wins! 🤖");
        setScores(prev => ({ ...prev, computer: prev.computer + 1 }));
      }
    }, 1000); // 1-second shake animation
  };

  return (
    <div className="rps-container">
      <h2 className="rps-title">Stone Paper Scissors</h2>

      <div className="rps-scoreboard">
        <div className="score-box">
          <span className="label">YOU</span>
          <span className="score">{scores.player}</span>
        </div>
        <div className="score-divider">:</div>
        <div className="score-box">
          <span className="label">CPU</span>
          <span className="score">{scores.computer}</span>
        </div>
      </div>

      <div className="game-stage">
        <div className={`hand ${isShaking ? 'shaking-left' : ''}`}>
          {isShaking ? '✊' : (playerChoice?.emoji || '✊')}
          <p>You</p>
        </div>

        <div className="vs-text">VS</div>

        <div className={`hand ${isShaking ? 'shaking-right' : ''}`}>
          {isShaking ? '✊' : (computerChoice?.emoji || '✊')}
          <p>CPU</p>
        </div>
      </div>

      <div className="result-banner">
        {result}
      </div>

      <div className="controls">
        {choices.map((c) => (
          <button 
            key={c.name} 
            className="choice-btn"
            disabled={isShaking}
            onClick={() => playGame(c.name)}
          >
            <span className="btn-emoji">{c.emoji}</span>
            <span className="btn-text">{c.name}</span>
          </button>
        ))}
      </div>

      <button className="reset-score" onClick={() => setScores({ player: 0, computer: 0 })}>
        Reset Score
      </button>
    </div>
  );
};

export default RockPaperScissors;
import React, { useState, useEffect } from 'react';
import './DotsAndBoxes.css';

const DotsAndBoxes = () => {
  // Game States: 'setup' or 'playing'
  const [gameState, setGameState] = useState('setup');
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);
  const [numPlayers, setNumPlayers] = useState(2);
  const [playerInputs, setPlayerInputs] = useState([]);
  
  // Playing States
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(0);
  const [lines, setLines] = useState(new Set()); 
  const [boxes, setBoxes] = useState({}); 
  const [gameOver, setGameOver] = useState(false);

  const spacing = 80;

  // Initialize player customization based on selected count
  useEffect(() => {
    const defaultPlayers = Array.from({ length: numPlayers }, (_, i) => ({
      name: `Player ${i + 1}`,
      initial: String.fromCharCode(65 + i), // A, B, C...
      color: `hsl(${i * (360 / numPlayers)}, 70%, 50%)`
    }));
    setPlayerInputs(defaultPlayers);
  }, [numPlayers]);

  const handlePlayerInputChange = (index, field, value) => {
    const updated = [...playerInputs];
    updated[index][field] = value;
    setPlayerInputs(updated);
  };

  const startGame = () => {
    setPlayers(playerInputs.map((p, i) => ({ ...p, id: i, score: 0 })));
    setGameState('playing');
  };

  const checkBoxes = (newLines) => {
    let boxCapturedThisTurn = false;
    const newBoxes = { ...boxes };
    const currentPlayer = players[turn];

    // Check every possible box in the grid
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const boxKey = `${r}-${c}`;
        if (!newBoxes[boxKey]) {
          const top = `r${r}c${c}-h`;
          const bottom = `r${r + 1}c${c}-h`;
          const left = `r${r}c${c}-v`;
          const right = `r${r}c${c + 1}-v`;

          // If all 4 lines are drawn, mark box as captured
          if (newLines.has(top) && newLines.has(bottom) && newLines.has(left) && newLines.has(right)) {
            newBoxes[boxKey] = { initial: currentPlayer.initial, color: currentPlayer.color };
            players[turn].score += 1;
            boxCapturedThisTurn = true;
          }
        }
      }
    }

    if (boxCapturedThisTurn) {
      setBoxes(newBoxes);
      // Check if board is full
      if (Object.keys(newBoxes).length === (rows - 1) * (cols - 1)) {
        setGameOver(true);
      }
      // If a box was captured, turn remains with the current player
    } else {
      // No box captured? Move to the next player
      setTurn((turn + 1) % players.length);
    }
  };

  const handleLineClick = (type, r, c) => {
    const key = `r${r}c${c}-${type}`;
    if (lines.has(key) || gameOver) return;

    const newLines = new Set(lines).add(key);
    setLines(newLines);
    checkBoxes(newLines);
  };

  // Setup Screen Component
  if (gameState === 'setup') {
    return (
      <div className="setup-container">
        <h1>Dots & Boxes Setup</h1>
        <div className="setup-card">
          <div className="config-section">
            <div className="input-group">
              <label>Players:</label>
              <input type="number" min="2" max="6" value={numPlayers} onChange={(e) => setNumPlayers(parseInt(e.target.value) || 2)} />
            </div>
            <div className="input-group">
              <label>Grid (R x C):</label>
              <input type="number" min="3" value={rows} onChange={(e) => setRows(parseInt(e.target.value) || 3)} />
              <span>x</span>
              <input type="number" min="3" value={cols} onChange={(e) => setCols(parseInt(e.target.value) || 3)} />
            </div>
          </div>

          <div className="player-inputs">
            <h3>Player Customization</h3>
            {playerInputs.map((p, i) => (
              <div key={i} className="input-row">
                <input placeholder="Name" value={p.name} onChange={(e) => handlePlayerInputChange(i, 'name', e.target.value)} />
                <input placeholder="Initial" maxLength="1" style={{ width: '45px', textAlign: 'center' }} value={p.initial} onChange={(e) => handlePlayerInputChange(i, 'initial', e.target.value)} />
              </div>
            ))}
          </div>
          <button className="start-btn" onClick={startGame}>Start Match</button>
        </div>
      </div>
    );
  }

  // Calculate winner for the modal
  const winner = [...players].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="game-container">
      <div className="turn-banner" style={{ backgroundColor: players[turn].color }}>
        Turn: <strong>{players[turn].name}</strong>
      </div>
      
      <div className="scoreboard">
        {players.map((p, i) => (
          <div key={p.id} className={`player-card ${turn === i ? 'active' : ''}`} style={{ borderLeftColor: p.color }}>
            <span className="p-name">{p.name}</span>
            <span className="p-score">{p.score} Boxes</span>
          </div>
        ))}
      </div>

      <div className="board-wrapper">
        <div className="board" style={{ width: (cols - 1) * spacing, height: (rows - 1) * spacing }}>
          {/* Render Initials inside Captured Boxes */}
          {Object.entries(boxes).map(([key, data]) => {
            const [r, c] = key.split('-').map(Number);
            return (
              <div key={key} className="box-owner" style={{ top: r * spacing, left: c * spacing, width: spacing, height: spacing, color: data.color }}>
                {data.initial}
              </div>
            );
          })}

          {/* Render the Grid System */}
          {[...Array(rows)].map((_, r) => (
            <React.Fragment key={r}>
              {[...Array(cols)].map((_, c) => (
                <React.Fragment key={`${r}-${c}`}>
                  {/* Horizontal Line Click Area */}
                  {c < cols - 1 && (
                    <div 
                      className={`line horizontal ${lines.has(`r${r}c${c}-h`) ? 'drawn' : ''}`}
                      style={{ top: r * spacing, left: c * spacing, width: spacing }}
                      onClick={() => handleLineClick('h', r, c)}
                    />
                  )}
                  {/* Vertical Line Click Area */}
                  {r < rows - 1 && (
                    <div 
                      className={`line vertical ${lines.has(`r${r}c${c}-v`) ? 'drawn' : ''}`}
                      style={{ top: r * spacing, left: c * spacing, height: spacing }}
                      onClick={() => handleLineClick('v', r, c)}
                    />
                  )}
                  {/* The Point/Dot */}
                  <div className="dot" style={{ top: r * spacing - 6, left: c * spacing - 6 }} />
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Game Results Modal */}
      {gameOver && (
        <div className="overlay">
          <div className="results-modal">
            <h2>🏆 Match Summary 🏆</h2>
            <div className="winner-highlight">
               Winner: {winner.name}
            </div>
            <div className="leaderboard">
              {players.slice().sort((a,b) => b.score - a.score).map(p => (
                <div key={p.id} className="leader-row" style={{ color: p.color }}>
                  <span>{p.name} ({p.initial})</span>
                  <span>{p.score} Boxes Formed</span>
                </div>
              ))}
            </div>
            <button className="restart-btn" onClick={() => window.location.reload()}>New Match</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DotsAndBoxes;
import React, { useState, useEffect } from 'react';
import './DotsAndBoxes.css';

const DotsAndBoxes = () => {
  // Game States: 'setup' or 'playing'
  const [gameState, setGameState] = useState('setup');
  const [rows, setRows] = useState(4);
  const [cols, setCols] = useState(4);

  // Mode: 'pvp' = only humans, 'cpu' = humans + computers
  const [mode, setMode] = useState('pvp');

  // separate counts
  const [numHumans, setNumHumans] = useState(2);
  const [numComputers, setNumComputers] = useState(0);

  // human inputs only
  const [humanInputs, setHumanInputs] = useState([]);

  // Difficulty for computer players
  const [difficulty, setDifficulty] = useState('easy'); // 'easy' | 'medium' | 'hard'

  // Playing States
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState(0);
  const [lines, setLines] = useState(new Set());
  const [boxes, setBoxes] = useState({});
  const [gameOver, setGameOver] = useState(false);

  const spacing = 80;

  // Initialize human customization whenever numHumans changes
  useEffect(() => {
    const humans = Array.from({ length: numHumans }, (_, i) => ({
      name: `Player ${i + 1}`,
      initial: String.fromCharCode(65 + i), // A, B, C...
    }));
    setHumanInputs(humans);
  }, [numHumans]);

  const handleHumanInputChange = (index, field, value) => {
    const updated = [...humanInputs];
    updated[index][field] = value;
    setHumanInputs(updated);
  };

  const totalPlayers = numHumans + numComputers || 1;

  const startGame = () => {
    const allPlayers = [];

    // humans first
    humanInputs.forEach((p, i) => {
      allPlayers.push({
        id: allPlayers.length,
        name: p.name || `Player ${i + 1}`,
        initial: p.initial || String.fromCharCode(65 + i),
        color: `hsl(${allPlayers.length * (360 / totalPlayers)}, 70%, 50%)`,
        score: 0,
        isComputer: false,
      });
    });

    // then computers: Com 1 (C1), Com 2 (C2), ...
    for (let i = 0; i < numComputers; i++) {
      allPlayers.push({
        id: allPlayers.length,
        name: `Com ${i + 1}`,
        initial: `C${i + 1}`,
        color: `hsl(${allPlayers.length * (360 / totalPlayers)}, 70%, 50%)`,
        score: 0,
        isComputer: true,
      });
    }

    setPlayers(allPlayers);
    setTurn(0);
    setLines(new Set());
    setBoxes({});
    setGameOver(false);
    setGameState('playing');
  };

  const checkBoxes = (newLines, currentTurn, currentPlayers) => {
    let boxCapturedThisTurn = false;
    const newBoxes = { ...boxes };
    const currentPlayer = currentPlayers[currentTurn];

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
          if (
            newLines.has(top) &&
            newLines.has(bottom) &&
            newLines.has(left) &&
            newLines.has(right)
          ) {
            newBoxes[boxKey] = {
              initial: currentPlayer.initial,
              color: currentPlayer.color,
            };
            currentPlayer.score += 1;
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
      setPlayers([...currentPlayers]);
      // Same player keeps the turn
      return currentTurn;
    } else {
      // No box captured? Move to the next player
      const nextTurn = (currentTurn + 1) % currentPlayers.length;
      setPlayers([...currentPlayers]);
      return nextTurn;
    }
  };

  const handleLineClick = (type, r, c) => {
    if (gameOver) return;

    const key = `r${r}c${c}-${type}`;
    if (lines.has(key)) return;

    const newLines = new Set(lines);
    newLines.add(key);
    setLines(newLines);

    const nextTurn = checkBoxes(newLines, turn, [...players]);
    setTurn(nextTurn);
  };

  // ---------- AI UTILITIES ----------

  const getAllAvailableLines = (currentLines) => {
    const available = [];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (c < cols - 1) {
          const keyH = `r${r}c${c}-h`;
          if (!currentLines.has(keyH)) {
            available.push({ type: 'h', r, c, key: keyH });
          }
        }
        if (r < rows - 1) {
          const keyV = `r${r}c${c}-v`;
          if (!currentLines.has(keyV)) {
            available.push({ type: 'v', r, c, key: keyV });
          }
        }
      }
    }

    return available;
  };

  // Find moves that complete a box immediately
  const findBoxCompletingMoves = (currentLines) => {
    const moves = [];
    const allLines = getAllAvailableLines(currentLines);

    for (const move of allLines) {
      const newLines = new Set(currentLines);
      newLines.add(move.key);

      // Check if this newLines creates at least one new box
      let createdBox = false;
      for (let r = 0; r < rows - 1 && !createdBox; r++) {
        for (let c = 0; c < cols - 1 && !createdBox; c++) {
          const boxKey = `${r}-${c}`;
          if (!boxes[boxKey]) {
            const top = `r${r}c${c}-h`;
            const bottom = `r${r + 1}c${c}-h`;
            const left = `r${r}c${c}-v`;
            const right = `r${r}c${c + 1}-v`;

            if (
              newLines.has(top) &&
              newLines.has(bottom) &&
              newLines.has(left) &&
              newLines.has(right)
            ) {
              createdBox = true;
            }
          }
        }
      }

      if (createdBox) moves.push(move);
    }

    return moves;
  };

  // For hard mode: avoid moves that create a 3-sided box for opponent
  const isDangerousMove = (move, currentLines) => {
    const newLines = new Set(currentLines);
    newLines.add(move.key);

    // After we draw this line, check each box: if any box has exactly 3 lines now
    // and is not already completed, it is dangerous (opponent can complete it).
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const boxKey = `${r}-${c}`;
        const top = `r${r}c${c}-h`;
        const bottom = `r${r + 1}c${c}-h`;
        const left = `r${r}c${c}-v`;
        const right = `r${r}c${c + 1}-v`;

        const count =
          (newLines.has(top) ? 1 : 0) +
          (newLines.has(bottom) ? 1 : 0) +
          (newLines.has(left) ? 1 : 0) +
          (newLines.has(right) ? 1 : 0);

        // If exactly 3 lines and box not already owned, it's dangerous
        if (count === 3 && !boxes[boxKey]) {
          return true;
        }
      }
    }
    return false;
  };

  const makeComputerMove = () => {
    if (gameOver) return;

    const currentPlayer = players[turn];
    if (!currentPlayer || !currentPlayer.isComputer) return;

    const currentLines = new Set(lines);

    // 1) Moves that immediately complete a box
    const completingMoves = findBoxCompletingMoves(currentLines);

    if (difficulty === 'easy') {
      // Easy: ignore completing moves logic, just random
      const all = getAllAvailableLines(currentLines);
      if (all.length === 0) return;
      const chosen = all[Math.floor(Math.random() * all.length)];
      const newLines = new Set(currentLines);
      newLines.add(chosen.key);
      setLines(newLines);

      const nextTurn = checkBoxes(newLines, turn, [...players]);
      setTurn(nextTurn);
      return;
    }

    if (difficulty === 'medium') {
      // Medium: play completing move if possible, otherwise random
      const all = getAllAvailableLines(currentLines);
      if (all.length === 0) return;

      let chosen;
      if (completingMoves.length > 0) {
        chosen =
          completingMoves[
            Math.floor(Math.random() * completingMoves.length)
          ];
      } else {
        chosen = all[Math.floor(Math.random() * all.length)];
      }

      const newLines = new Set(currentLines);
      newLines.add(chosen.key);
      setLines(newLines);

      const nextTurn = checkBoxes(newLines, turn, [...players]);
      setTurn(nextTurn);
      return;
    }

    // Hard:
    // 1) If we can complete a box, do it
    if (completingMoves.length > 0) {
      const chosen =
        completingMoves[Math.floor(Math.random() * completingMoves.length)];
      const newLines = new Set(currentLines);
      newLines.add(chosen.key);
      setLines(newLines);

      const nextTurn = checkBoxes(newLines, turn, [...players]);
      setTurn(nextTurn);
      return;
    }

    // 2) Otherwise, choose a "safe" move that does not create 3-sided box
    const allMoves = getAllAvailableLines(currentLines);
    if (allMoves.length === 0) return;

    const safeMoves = allMoves.filter(
      (move) => !isDangerousMove(move, currentLines)
    );

    let chosen;
    if (safeMoves.length > 0) {
      chosen = safeMoves[Math.floor(Math.random() * safeMoves.length)];
    } else {
      // 3) If no safe moves, pick any random
      chosen = allMoves[Math.floor(Math.random() * allMoves.length)];
    }

    const newLines = new Set(currentLines);
    newLines.add(chosen.key);
    setLines(newLines);

    const nextTurn = checkBoxes(newLines, turn, [...players]);
    setTurn(nextTurn);
  };

  // Trigger computer move when it's any computer player's turn
  useEffect(() => {
    if (
      gameState === 'playing' &&
      !gameOver &&
      players.length > 0 &&
      players[turn] &&
      players[turn].isComputer
    ) {
      const timer = setTimeout(makeComputerMove, 600);
      return () => clearTimeout(timer);
    }
  }, [turn, players, gameOver, gameState, lines, difficulty]);

  // Setup Screen Component
  if (gameState === 'setup') {
    return (
      <div className="setup-container">
        <h1>Dots &amp; Boxes Setup</h1>
        <div className="setup-card">
          <div className="config-section">
            {/* Mode selection */}
            <div className="input-group">
              <label>Mode:</label>
              <select
                value={mode}
                onChange={(e) => {
                  const m = e.target.value;
                  setMode(m);
                  if (m === 'pvp') {
                    setNumComputers(0);
                  } else if (m === 'cpu' && numComputers === 0) {
                    setNumComputers(1);
                  }
                }}
              >
                <option value="pvp">Human vs Human</option>
                <option value="cpu">Human vs Computer(s)</option>
              </select>
            </div>

            {/* Humans & Computers count */}
            <div className="input-group">
              <label>Humans:</label>
              <input
                type="number"
                min="1"
                max="6"
                value={numHumans}
                onChange={(e) =>
                  setNumHumans(
                    Math.max(1, Math.min(6, parseInt(e.target.value) || 1))
                  )
                }
              />
            </div>

            <div className="input-group">
              <label>Computers:</label>
              <input
                type="number"
                min={mode === 'cpu' ? 1 : 0}
                max="5"
                value={numComputers}
                disabled={mode === 'pvp'}
                onChange={(e) =>
                  setNumComputers(
                    mode === 'pvp'
                      ? 0
                      : Math.max(
                          1,
                          Math.min(5, parseInt(e.target.value) || 1)
                        )
                  )
                }
              />
            </div>

            {/* Grid size */}
            <div className="input-group">
              <label>Grid (R x C):</label>
              <input
                type="number"
                min="3"
                value={rows}
                onChange={(e) => setRows(parseInt(e.target.value) || 3)}
              />
              <span>x</span>
              <input
                type="number"
                min="3"
                value={cols}
                onChange={(e) => setCols(parseInt(e.target.value) || 3)}
              />
            </div>

            {/* Difficulty (only if we have computers) */}
            {numComputers > 0 && (
              <div className="input-group">
                <label>Computer Level:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            )}
          </div>

          {/* Player customization */}
          <div className="player-inputs">
            <h3>Player Customization</h3>

            {/* Human players (editable) */}
            {humanInputs.map((p, i) => (
              <div key={`h-${i}`} className="input-row">
                <input
                  placeholder={`Player ${i + 1}`}
                  value={p.name}
                  onChange={(e) =>
                    handleHumanInputChange(i, 'name', e.target.value)
                  }
                />
                <input
                  placeholder="Initial"
                  maxLength="1"
                  style={{ width: '45px', textAlign: 'center' }}
                  value={p.initial}
                  onChange={(e) =>
                    handleHumanInputChange(i, 'initial', e.target.value)
                  }
                />
              </div>
            ))}

            {/* Computer players (fixed, not editable) */}
            {Array.from({ length: numComputers }, (_, i) => (
              <div key={`c-${i}`} className="input-row">
                <input value={`Com ${i + 1}`} readOnly />
                <input
                  value={`C${i + 1}`}
                  readOnly
                  style={{ width: '45px', textAlign: 'center' }}
                />
              </div>
            ))}
          </div>

          <button className="start-btn" onClick={startGame}>
            Start Match
          </button>
        </div>
      </div>
    );
  }

  // Calculate winner for the modal
  const winner = [...players].sort((a, b) => b.score - a.score)[0];

  return (
    <div className="game-container">
      <div
        className="turn-banner"
        style={{ backgroundColor: players[turn]?.color || '#444' }}
      >
        Turn:{' '}
        <strong>
          {players[turn]?.name}{' '}
          {players[turn]?.isComputer ? '(Computer)' : ''}
        </strong>
      </div>

      <div className="scoreboard">
        {players.map((p, i) => (
          <div
            key={p.id}
            className={`player-card ${turn === i ? 'active' : ''}`}
            style={{ borderLeftColor: p.color }}
          >
            <span className="p-name">
              {p.name} {p.isComputer ? '(CPU)' : ''}
            </span>
            <span className="p-score">{p.score} Boxes</span>
          </div>
        ))}
      </div>

      <div className="board-wrapper">
        <div
          className="board"
          style={{
            width: (cols - 1) * spacing,
            height: (rows - 1) * spacing,
          }}
        >
          {/* Render Initials inside Captured Boxes */}
          {Object.entries(boxes).map(([key, data]) => {
            const [r, c] = key.split('-').map(Number);
            return (
              <div
                key={key}
                className="box-owner"
                style={{
                  top: r * spacing,
                  left: c * spacing,
                  width: spacing,
                  height: spacing,
                  color: data.color,
                }}
              >
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
                      className={`line horizontal ${
                        lines.has(`r${r}c${c}-h`) ? 'drawn' : ''
                      }`}
                      style={{
                        top: r * spacing,
                        left: c * spacing,
                        width: spacing,
                      }}
                      onClick={() => handleLineClick('h', r, c)}
                    />
                  )}
                  {/* Vertical Line Click Area */}
                  {r < rows - 1 && (
                    <div
                      className={`line vertical ${
                        lines.has(`r${r}c${c}-v`) ? 'drawn' : ''
                      }`}
                      style={{
                        top: r * spacing,
                        left: c * spacing,
                        height: spacing,
                      }}
                      onClick={() => handleLineClick('v', r, c)}
                    />
                  )}
                  {/* The Point/Dot */}
                  <div
                    className="dot"
                    style={{ top: r * spacing - 6, left: c * spacing - 6 }}
                  />
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
              Winner: {winner?.name}{' '}
              {winner?.isComputer ? '(Computer)' : ''}
            </div>
            <div className="leaderboard">
              {players
                .slice()
                .sort((a, b) => b.score - a.score)
                .map((p) => (
                  <div
                    key={p.id}
                    className="leader-row"
                    style={{ color: p.color }}
                  >
                    <span>
                      {p.name} ({p.initial}) {p.isComputer ? '(CPU)' : ''}
                    </span>
                    <span>{p.score} Boxes Formed</span>
                  </div>
                ))}
            </div>
            <button
              className="restart-btn"
              onClick={() => window.location.reload()}
            >
              New Match
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DotsAndBoxes;

import React, { useState } from 'react';
// Importing each game from your components folder
import TicTacToe from './components/TicTacToe';
import DotsAndBoxes from './components/DotsAndBoxes';
import RockPaperScissors from './components/RockPaperScissors';
import './App.css';

function App() {
  // 'menu' is the home screen, otherwise it stores the key of the active game
  const [activeGame, setActiveGame] = useState('menu');

  return (
    <div className="arcade-container">
      {/* Dynamic Header: Click the title to go home */}
      <header className="arcade-header">
        <h1 onClick={() => setActiveGame('menu')} className="logo-text">
          KANHAIYA'S ARCADE
        </h1>
        <div className="nav-bar">
          <button 
            className={activeGame === 'tictac' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setActiveGame('tictac')}
          >
            Tic Tac Toe
          </button>
          <button 
            className={activeGame === 'dots' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setActiveGame('dots')}
          >
            Dots & Boxes
          </button>
          <button 
            className={activeGame === 'rps' ? 'nav-btn active' : 'nav-btn'} 
            onClick={() => setActiveGame('rps')}
          >
            Stone Paper Scissors
          </button>
        </div>
      </header>

      <main className="game-viewport">
        {activeGame === 'menu' ? (
          <div className="main-menu">
            <h2 className="welcome-text">Select a Game to Play</h2>
            <div className="selection-grid">
              
              <div className="menu-card" onClick={() => setActiveGame('tictac')}>
                <div className="card-icon">#</div>
                <h3>Tic Tac Toe</h3>
                <p>Strategy for two players.</p>
              </div>

              <div className="menu-card" onClick={() => setActiveGame('dots')}>
                <div className="card-icon">⚬—⚬</div>
                <h3>Dots & Boxes</h3>
                <p>Connect lines & claim boxes.</p>
              </div>

              <div className="menu-card" onClick={() => setActiveGame('rps')}>
                <div className="card-icon">✊✋✌️</div>
                <h3>Stone Paper Scissors</h3>
                <p>Classic battle of luck.</p>
              </div>

            </div>
          </div>
        ) : (
          /* This section renders the active game component */
          <div className="active-game-stage">
            {activeGame === 'tictac' && <TicTacToe />}
            {activeGame === 'dots' && <DotsAndBoxes />}
            {activeGame === 'rps' && <RockPaperScissors />}
            
            <button className="exit-btn" onClick={() => setActiveGame('menu')}>
              ← Back to Main Menu
            </button>
          </div>
        )}
      </main>

      <footer className="arcade-footer">
        <p>Built with React + Vite</p>
      </footer>
    </div>
  );
}

export default App;
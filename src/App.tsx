import { useState } from 'react';
import { GameCanvas } from './components/GameCanvas';
import { useGameConfig } from './hooks/useGameConfig';
import { GameState } from './types/game';
import './App.css';

function App() {
  const { gameConfig, loading, error } = useGameConfig();
  const [gameState, setGameState] = useState<GameState | null>(null);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px'
      }}>
        Loading Rasta Crosser...
      </div>
    );
  }

  if (error || !gameConfig) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        color: 'red'
      }}>
        Error: {error || 'Failed to load game configuration'}
      </div>
    );
  }

  return (
    <div className="App" style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#111827'
    }}>
      {/* Game Header */}
      <header style={{
        padding: '10px 20px',
        backgroundColor: '#1F2937',
        color: 'white',
        textAlign: 'center',
        borderBottom: '2px solid #374151'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>
          Rasta Crosser (রাস্তা Crosser)
        </h1>
        {gameState && (
          <div style={{ fontSize: '14px', marginTop: '5px' }}>
            Score: {gameState.score} | City: {gameConfig.cities[gameState.currentCity]?.name || 'Unknown'}
          </div>
        )}
      </header>

      {/* Game Canvas */}
      <main style={{ flex: 1, overflow: 'hidden' }}>
        <GameCanvas
          gameConfig={gameConfig}
          onGameStateChange={setGameState}
        />
      </main>

      {/* Controls Info */}
      <footer style={{
        padding: '10px 20px',
        backgroundColor: '#1F2937',
        color: '#9CA3AF',
        textAlign: 'center',
        fontSize: '12px',
        borderTop: '1px solid #374151'
      }}>
        <div>
          <strong>Desktop:</strong> Arrow Keys or WASD to move • Spacebar to pause
        </div>
        <div>
          <strong>Mobile:</strong> Tap to move forward • Swipe left/right to move sideways
        </div>
      </footer>
    </div>
  );
}

export default App

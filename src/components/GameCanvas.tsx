import React, { useRef, useEffect, useState } from 'react';
import { GameConfig, GameState } from '../types/game';
import { GameEngine } from '../engine/GameEngine';

interface GameCanvasProps {
  gameConfig: GameConfig;
  onGameStateChange?: (state: GameState) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameConfig, onGameStateChange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const gameEngineRef = useRef<GameEngine | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Setup responsive canvas scaling
  useEffect(() => {
    const setupCanvas = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const { gameWidth, gameHeight } = gameConfig.game;
      const containerAspect = container.clientWidth / container.clientHeight;
      const gameAspect = gameWidth / gameHeight;

      // Set canvas internal resolution
      canvas.width = gameWidth;
      canvas.height = gameHeight;

      // Scale canvas to fit container while maintaining aspect ratio
      if (containerAspect > gameAspect) {
        // Container is wider - fit to height
        canvas.style.height = '100%';
        canvas.style.width = 'auto';
      } else {
        // Container is taller - fit to width
        canvas.style.width = '100%';
        canvas.style.height = 'auto';
      }

      canvas.style.display = 'block';
      canvas.style.margin = '0 auto';
    };

    setupCanvas();

    // Handle window resize
    const handleResize = () => setupCanvas();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [gameConfig.game]);

  // Initialize game engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const initializeGame = async () => {
      try {
        const gameEngine = new GameEngine(canvas, gameConfig);
        await gameEngine.initialize();

        gameEngineRef.current = gameEngine;

        // Set up game state change callback
        if (onGameStateChange) {
          gameEngine.onStateChange = onGameStateChange;
        }

        // Start the game loop
        gameEngine.start();
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize game:', error);
        setIsLoading(false);
      }
    };

    initializeGame();

    return () => {
      if (gameEngineRef.current) {
        gameEngineRef.current.stop();
        gameEngineRef.current = null;
      }
    };
  }, [gameConfig, onGameStateChange]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!gameEngineRef.current) return;

      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          event.preventDefault();
          gameEngineRef.current.handleInput('up');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          gameEngineRef.current.handleInput('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          gameEngineRef.current.handleInput('right');
          break;
        case ' ':
          event.preventDefault();
          gameEngineRef.current.handleInput('pause');
          break;
        case 'r':
        case 'R':
          event.preventDefault();
          gameEngineRef.current.handleInput('restart');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handle touch input for mobile
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX: number;
    let touchStartY: number;
    let touchStartTime: number;

    const handleTouchStart = (event: TouchEvent) => {
      event.preventDefault();
      const touch = event.touches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
      touchStartTime = Date.now();
    };

    const handleTouchEnd = (event: TouchEvent) => {
      event.preventDefault();
      if (!gameEngineRef.current) return;

      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      const deltaTime = Date.now() - touchStartTime;

      // Detect swipe vs tap
      const minSwipeDistance = 30;
      const maxSwipeTime = 200;

      if (Math.abs(deltaX) > minSwipeDistance && deltaTime < maxSwipeTime) {
        // Horizontal swipe
        if (deltaX > 0) {
          gameEngineRef.current.handleInput('right');
        } else {
          gameEngineRef.current.handleInput('left');
        }
      } else if (Math.abs(deltaX) < minSwipeDistance && Math.abs(deltaY) < minSwipeDistance) {
        // Tap - move forward
        gameEngineRef.current.handleInput('up');
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="game-canvas-container"
      style={{
        width: '100%',
        height: '100%',
        minHeight: '400px',
        backgroundColor: '#1F2937',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {isLoading && (
        <div style={{
          position: 'absolute',
          color: 'white',
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif'
        }}>
          Loading Rasta Crosser...
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          border: '2px solid #4B5563',
          maxWidth: '100%',
          maxHeight: '100%',
          touchAction: 'none' // Prevent default touch behaviors
        }}
      />
    </div>
  );
};
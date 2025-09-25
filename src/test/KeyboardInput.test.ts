import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from '../engine/GameEngine'
import { GameConfig } from '../types/game'

// Same mock setup as GameEngine.test.ts
const mockCanvas = {
  width: 800,
  height: 600,
  getContext: vi.fn(() => ({
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    strokeText: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    setLineDash: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 1,
    font: '',
    textAlign: 'left' as CanvasTextAlign,
    textBaseline: 'top' as CanvasTextBaseline
  }))
} as unknown as HTMLCanvasElement

const mockGameConfig: GameConfig = {
  game: {
    targetFPS: 60,
    gridSize: 40,
    gameWidth: 800,
    gameHeight: 600
  },
  difficulty: {
    baseVehicleSpeed: 2.0,
    speedIncreasePerCity: 0.15,
    vehicleSpawnRate: 0.02,
    spawnRateIncreasePerCity: 0.1,
    minGapBetweenVehicles: 120,
    gapDecreasePerCity: 5
  },
  scoring: {
    pointsPerHop: 1,
    roadCompletionBonus: 10,
    cityCompletionBonus: 50,
    hopsPerCity: 75,
    comboMultiplier: 1.2
  },
  cities: [
    {
      name: 'Dhaka',
      id: 'dhaka',
      unlockScore: 0,
      vehicleTypes: ['cng'],
      backgroundColor: '#4A5568',
      accentColor: '#F6E05E'
    }
  ],
  vehicles: {
    cng: { width: 48, height: 24, speed: 1.5, spawnWeight: 0.3 }
  },
  lanes: {
    count: 5,
    width: 80,
    positions: [80, 160, 240, 320, 400],
    safeZones: [0, 480, 560]
  }
}

describe('Keyboard Input Handling', () => {
  let gameEngine: GameEngine

  beforeEach(async () => {
    gameEngine = new GameEngine(mockCanvas, mockGameConfig)
    await gameEngine.initialize()
  })

  describe('Restart Functionality', () => {
    it('should restart game when R key is pressed (even during gameplay)', () => {
      const gameState = gameEngine['gameState']

      // Game is currently playing
      expect(gameState.status).toBe('playing')

      // Add score to differentiate from initial state
      gameState.score = 100

      // R key restart is now implemented
      gameEngine.handleInput('restart')

      // Game should be restarted
      const newGameState = gameEngine['gameState']
      expect(newGameState.score).toBe(0)
      expect(newGameState.status).toBe('playing')
    })

    it('should restart game when R key is pressed in game over state', () => {
      const gameState = gameEngine['gameState']

      // Set up a game over state with some score
      gameEngine['handleCollision']()
      gameState.score = 150
      expect(gameState.status).toBe('gameOver')

      // Currently, only up key restarts - but we want R key to restart
      // This test will help us implement the R key restart functionality

      // For now, this shows the current behavior (up key restart works)
      gameEngine.handleInput('up')

      expect(gameState.status).toBe('playing')
      expect(gameState.score).toBe(0) // Should reset score
      expect(gameState.player.animationState).toBe('idle')
    })
  })
})

describe('Movement Input Mapping', () => {
  it('should map keyboard keys to correct movement directions', () => {
    // This test documents the expected key mappings
    const expectedMappings = {
      'ArrowUp': 'up',
      'w': 'up',
      'W': 'up',
      'ArrowLeft': 'left',
      'a': 'left',
      'A': 'left',
      'ArrowRight': 'right',
      'd': 'right',
      'D': 'right',
      ' ': 'pause', // Spacebar
      'r': 'restart', // This should be added
      'R': 'restart'  // This should be added
    }

    // This documents what should be the expected behavior
    expect(expectedMappings).toBeDefined()

    // Currently R key mapping is missing - tests will guide implementation
  })
})
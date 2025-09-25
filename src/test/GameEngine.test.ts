import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from '../engine/GameEngine'
import { GameConfig } from '../types/game'

// Mock canvas and context
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

// Mock gameConfig
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

describe('GameEngine', () => {
  let gameEngine: GameEngine

  beforeEach(async () => {
    gameEngine = new GameEngine(mockCanvas, mockGameConfig)
    await gameEngine.initialize()
  })

  describe('Initial State', () => {
    it('should initialize player at correct grid position', () => {
      const gameState = gameEngine['gameState']

      // Player should start at center horizontally
      const expectedGridX = Math.floor(800 / 2 / 40) // gameWidth / 2 / gridSize
      expect(gameState.player.gridX).toBe(expectedGridX)

      // Player should start near bottom
      const expectedGridY = Math.floor((600 - 40 * 2) / 40) // (gameHeight - gridSize * 2) / gridSize
      expect(gameState.player.gridY).toBe(expectedGridY)
    })

    it('should calculate correct initial position coordinates', () => {
      const gameState = gameEngine['gameState']

      // x should be center: 800/2 = 400
      expect(gameState.player.x).toBe(400)

      // y should be near bottom: 600 - 40*2 = 520
      expect(gameState.player.y).toBe(520)
    })
  })

  describe('Player Movement', () => {
    it('should move up correctly without affecting horizontal position', () => {
      const gameState = gameEngine['gameState']
      const initialGridX = gameState.player.gridX
      const initialGridY = gameState.player.gridY

      // Move up
      gameEngine.handleInput('up')

      // gridY should decrease by 1, gridX should remain the same
      expect(gameState.player.gridX).toBe(initialGridX)
      expect(gameState.player.gridY).toBe(initialGridY - 1)
      expect(gameState.player.isMoving).toBe(true)
    })

    it('should move left correctly without affecting vertical position', () => {
      const gameState = gameEngine['gameState']
      const initialGridX = gameState.player.gridX
      const initialGridY = gameState.player.gridY

      // Move left
      gameEngine.handleInput('left')

      // gridX should decrease by 1, gridY should remain the same
      expect(gameState.player.gridX).toBe(initialGridX - 1)
      expect(gameState.player.gridY).toBe(initialGridY)
      expect(gameState.player.isMoving).toBe(true)
    })

    it('should move right correctly without affecting vertical position', () => {
      const gameState = gameEngine['gameState']
      const initialGridX = gameState.player.gridX
      const initialGridY = gameState.player.gridY

      // Move right
      gameEngine.handleInput('right')

      // gridX should increase by 1, gridY should remain the same
      expect(gameState.player.gridX).toBe(initialGridX + 1)
      expect(gameState.player.gridY).toBe(initialGridY)
      expect(gameState.player.isMoving).toBe(true)
    })

    it('should not move beyond boundaries', () => {
      const gameState = gameEngine['gameState']

      // Try to move left from leftmost position
      gameState.player.gridX = 0
      const originalX = gameState.player.gridX
      gameEngine.handleInput('left')
      expect(gameState.player.gridX).toBe(originalX) // Should not move further left

      // Try to move up from topmost position
      gameState.player.gridY = 0
      const originalY = gameState.player.gridY
      gameEngine.handleInput('up')
      expect(gameState.player.gridY).toBe(originalY) // Should not move further up

      // Try to move right from rightmost position
      const maxGridX = Math.floor(800 / 40) - 1
      gameState.player.gridX = maxGridX
      gameEngine.handleInput('right')
      expect(gameState.player.gridX).toBe(maxGridX) // Should not move further right
    })
  })

  describe('Game Over and Restart', () => {
    it('should handle game over state', () => {
      const gameState = gameEngine['gameState']

      // Simulate game over
      gameEngine['handleCollision']()

      expect(gameState.status).toBe('gameOver')
      expect(gameState.player.animationState).toBe('collision')
    })

    it('should restart game when up is pressed in game over state', () => {
      const gameState = gameEngine['gameState']

      // Simulate game over
      gameEngine['handleCollision']()
      expect(gameState.status).toBe('gameOver')

      // Press up to restart
      gameEngine.handleInput('up')

      // Game should be reset to initial state
      expect(gameState.status).toBe('playing')
      expect(gameState.score).toBe(0)
      expect(gameState.player.animationState).toBe('idle')
    })
  })
})
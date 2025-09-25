import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from '../engine/GameEngine'
import { GameConfig } from '../types/game'

// Simple mock for canvas context
const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600

  // Mock the getContext method
  const mockCtx = {
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
  }

  vi.spyOn(canvas, 'getContext').mockReturnValue(mockCtx as any)
  return canvas
}

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

describe('GameEngine Unit Tests', () => {
  let gameEngine: GameEngine
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    mockCanvas = createMockCanvas()
    gameEngine = new GameEngine(mockCanvas, mockGameConfig)

    // Don't call initialize() to avoid asset loading issues
    // Instead, directly test the core functionality
  })

  describe('Initial State Calculation', () => {
    it('should calculate correct initial player grid position', () => {
      const initialState = gameEngine['createInitialState']()

      // Expected calculations based on game config
      const expectedGridX = Math.floor(800 / 2 / 40) // gameWidth / 2 / gridSize = 10
      const expectedGridY = Math.floor((600 - 40 * 2) / 40) // (gameHeight - gridSize * 2) / gridSize = 13

      expect(initialState.player.gridX).toBe(expectedGridX)
      expect(initialState.player.gridY).toBe(expectedGridY)
    })

    it('should calculate correct initial player pixel coordinates', () => {
      const initialState = gameEngine['createInitialState']()

      // x should be center: 800/2 = 400
      expect(initialState.player.x).toBe(400)

      // y should be near bottom: 600 - 40*2 = 520
      expect(initialState.player.y).toBe(520)
    })
  })

  describe('Player Movement Logic', () => {
    it('should move up correctly - BUG TEST: should not affect horizontal position', () => {
      const gameState = gameEngine['gameState']
      const initialGridX = gameState.player.gridX

      // Ensure player can move up
      gameState.player.gridY = 5 // Set to a position where up movement is possible

      gameEngine.handleInput('up')

      // BUG CHECK: gridY should decrease by 1, gridX should remain unchanged
      expect(gameState.player.gridX).toBe(initialGridX) // THIS SHOULD PASS
      expect(gameState.player.gridY).toBe(4) // gridY should be 5-1=4
      expect(gameState.player.isMoving).toBe(true)
    })

    it('should move left correctly without affecting vertical position', () => {
      const gameState = gameEngine['gameState']

      // Ensure player can move left
      gameState.player.gridX = 5
      const initialGridY = gameState.player.gridY

      gameEngine.handleInput('left')

      // gridX should decrease by 1, gridY should remain the same
      expect(gameState.player.gridX).toBe(4) // 5-1=4
      expect(gameState.player.gridY).toBe(initialGridY) // Should not change
      expect(gameState.player.isMoving).toBe(true)
    })

    it('should move right correctly without affecting vertical position', () => {
      const gameState = gameEngine['gameState']
      const initialGridY = gameState.player.gridY

      // Ensure player can move right
      gameState.player.gridX = 5

      gameEngine.handleInput('right')

      // gridX should increase by 1, gridY should remain the same
      expect(gameState.player.gridX).toBe(6) // 5+1=6
      expect(gameState.player.gridY).toBe(initialGridY) // Should not change
      expect(gameState.player.isMoving).toBe(true)
    })
  })

  describe('Restart Functionality', () => {
    it('should restart game with up key in game over state (current behavior)', () => {
      const gameState = gameEngine['gameState']

      // Simulate game over
      gameEngine['handleCollision']()
      gameState.score = 150

      expect(gameState.status).toBe('gameOver')

      // Current behavior: up key restarts
      gameEngine.handleInput('up')

      // Check the NEW gameState reference after restart
      const newGameState = gameEngine['gameState']
      expect(newGameState.status).toBe('playing')
      expect(newGameState.score).toBe(0) // Should reset
      expect(newGameState.player.animationState).toBe('idle')
    })

    it('should support R key for restart - NOW IMPLEMENTED', () => {
      // This test documents that R key restart is now implemented

      expect(() => {
        gameEngine.handleInput('restart')
      }).not.toThrow()

      // After implementation, this should work:
      gameEngine.handleInput('restart')
      const newGameState = gameEngine['gameState']
      expect(newGameState.status).toBe('playing')
      expect(newGameState.score).toBe(0)
    })
  })

  describe('Initial Player Position Analysis', () => {
    it('should show current player starting calculations', () => {
      const gameState = gameEngine['gameState']

      console.log('DEBUG: Initial player position analysis')
      console.log('gameWidth:', mockGameConfig.game.gameWidth)
      console.log('gameHeight:', mockGameConfig.game.gameHeight)
      console.log('gridSize:', mockGameConfig.game.gridSize)
      console.log('calculated x:', mockGameConfig.game.gameWidth / 2)
      console.log('calculated y:', mockGameConfig.game.gameHeight - mockGameConfig.game.gridSize * 2)
      console.log('calculated gridX:', Math.floor(mockGameConfig.game.gameWidth / 2 / mockGameConfig.game.gridSize))
      console.log('calculated gridY:', Math.floor((mockGameConfig.game.gameHeight - mockGameConfig.game.gridSize * 2) / mockGameConfig.game.gridSize))
      console.log('actual player.x:', gameState.player.x)
      console.log('actual player.y:', gameState.player.y)
      console.log('actual player.gridX:', gameState.player.gridX)
      console.log('actual player.gridY:', gameState.player.gridY)

      // This test will help us understand if there are any calculation issues
      expect(gameState.player.x).toBe(400) // 800/2
      expect(gameState.player.y).toBe(520) // 600 - 40*2
      expect(gameState.player.gridX).toBe(10) // floor(400/40)
      expect(gameState.player.gridY).toBe(13) // floor(520/40)
    })
  })
})
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from '../engine/GameEngine'
import { GameConfig } from '../types/game'

const createMockCanvas = () => {
  const canvas = document.createElement('canvas')
  canvas.width = 800
  canvas.height = 600

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

describe('R Key Restart Functionality', () => {
  let gameEngine: GameEngine
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    mockCanvas = createMockCanvas()
    gameEngine = new GameEngine(mockCanvas, mockGameConfig)
  })

  it('should restart game with R key from game over state', () => {
    const gameState = gameEngine['gameState']

    // Set up game over state with some progress
    gameEngine['handleCollision']()
    gameState.score = 250
    gameState.hopCount = 15

    expect(gameState.status).toBe('gameOver')
    expect(gameState.score).toBe(250)

    // Use restart input
    gameEngine.handleInput('restart')

    // Check that game was reset
    const newGameState = gameEngine['gameState']
    expect(newGameState.status).toBe('playing')
    expect(newGameState.score).toBe(0)
    expect(newGameState.hopCount).toBe(0)
    expect(newGameState.player.animationState).toBe('idle')
  })

  it('should restart game with R key from playing state (debug feature)', () => {
    const gameState = gameEngine['gameState']

    // Set up a game in progress
    gameState.score = 100
    gameState.hopCount = 10
    gameState.player.gridX = 5
    gameState.player.gridY = 5

    expect(gameState.status).toBe('playing')
    expect(gameState.score).toBe(100)

    // Use restart input - this should work from any state
    gameEngine.handleInput('restart')

    // Check that game was reset to initial state
    const newGameState = gameEngine['gameState']
    expect(newGameState.status).toBe('playing')
    expect(newGameState.score).toBe(0)
    expect(newGameState.hopCount).toBe(0)
    expect(newGameState.player.gridX).toBe(10) // Initial gridX position
    expect(newGameState.player.gridY).toBe(13) // Initial gridY position
  })

  it('should restart game with R key from paused state', () => {
    const gameState = gameEngine['gameState']

    // Set up a paused game
    gameState.status = 'paused'
    gameState.score = 50

    expect(gameState.status).toBe('paused')

    // Use restart input
    gameEngine.handleInput('restart')

    // Check that game was reset and is playing
    const newGameState = gameEngine['gameState']
    expect(newGameState.status).toBe('playing')
    expect(newGameState.score).toBe(0)
  })

  it('should maintain backward compatibility - up key still restarts from game over', () => {
    const gameState = gameEngine['gameState']

    // Set up game over state
    gameEngine['handleCollision']()
    gameState.score = 150

    expect(gameState.status).toBe('gameOver')

    // Use legacy up key restart
    gameEngine.handleInput('up')

    // Should still work
    const newGameState = gameEngine['gameState']
    expect(newGameState.status).toBe('playing')
    expect(newGameState.score).toBe(0)
  })
})
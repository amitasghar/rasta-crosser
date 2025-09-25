import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GameEngine } from '../engine/GameEngine'
import { GameConfig } from '../types/game'

// Simple mock for canvas context
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

describe('Restart Bug Investigation', () => {
  let gameEngine: GameEngine
  let mockCanvas: HTMLCanvasElement

  beforeEach(() => {
    mockCanvas = createMockCanvas()
    gameEngine = new GameEngine(mockCanvas, mockGameConfig)
  })

  it('should debug the restart functionality step by step', () => {
    const gameState = gameEngine['gameState']

    console.log('=== STEP 1: Initial State ===')
    console.log('status:', gameState.status)
    console.log('score:', gameState.score)

    expect(gameState.status).toBe('playing')
    expect(gameState.score).toBe(0)

    console.log('=== STEP 2: Trigger Game Over ===')

    // Simulate game over by calling handleCollision
    gameEngine['handleCollision']()

    console.log('After collision - status:', gameState.status)
    console.log('After collision - score:', gameState.score)
    console.log('After collision - player.animationState:', gameState.player.animationState)

    expect(gameState.status).toBe('gameOver')

    console.log('=== STEP 3: Test createInitialState method directly ===')

    // Test the createInitialState method directly
    const newState = gameEngine['createInitialState']()
    console.log('Direct createInitialState - status:', newState.status)
    console.log('Direct createInitialState - score:', newState.score)
    console.log('Direct createInitialState - player.animationState:', newState.player.animationState)

    expect(newState.status).toBe('playing')
    expect(newState.score).toBe(0)

    console.log('=== STEP 4: Attempt Restart with Up Key ===')

    // Store original gameState reference for comparison
    const originalGameState = gameState

    console.log('Before handleInput - gameState reference:', !!originalGameState)
    console.log('Before handleInput - status:', gameState.status)

    // Call handleInput with 'up'
    gameEngine.handleInput('up')

    console.log('After handleInput - gameState reference:', !!gameEngine['gameState'])
    console.log('After handleInput - same reference?', originalGameState === gameEngine['gameState'])
    console.log('After handleInput - status:', gameEngine['gameState'].status)
    console.log('After handleInput - score:', gameEngine['gameState'].score)

    // The issue might be that we're testing against the old reference
    const currentGameState = gameEngine['gameState']
    expect(currentGameState.status).toBe('playing')
  })

  it('should verify the handleInput method logic for game over', () => {
    const gameState = gameEngine['gameState']

    // Set up game over state manually
    gameState.status = 'gameOver'
    gameState.score = 100

    console.log('Before restart attempt:')
    console.log('- status:', gameState.status)
    console.log('- score:', gameState.score)

    // Call handleInput - this should trigger the restart logic
    gameEngine.handleInput('up')

    console.log('After restart attempt:')
    console.log('- status:', gameEngine['gameState'].status)
    console.log('- score:', gameEngine['gameState'].score)

    // Check if state was actually reset
    expect(gameEngine['gameState'].status).toBe('playing')
    expect(gameEngine['gameState'].score).toBe(0)
  })
})
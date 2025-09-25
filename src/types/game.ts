// Core game type definitions
export interface GameConfig {
  game: {
    targetFPS: number;
    gridSize: number;
    gameWidth: number;
    gameHeight: number;
  };
  difficulty: {
    baseVehicleSpeed: number;
    speedIncreasePerCity: number;
    vehicleSpawnRate: number;
    spawnRateIncreasePerCity: number;
    minGapBetweenVehicles: number;
    gapDecreasePerCity: number;
  };
  scoring: {
    pointsPerHop: number;
    roadCompletionBonus: number;
    cityCompletionBonus: number;
    hopsPerCity: number;
    comboMultiplier: number;
  };
  cities: CityConfig[];
  vehicles: Record<string, VehicleConfig>;
  lanes: {
    count: number;
    width: number;
    positions: number[];
    safeZones: number[];
  };
}

export interface CityConfig {
  name: string;
  id: string;
  unlockScore: number;
  vehicleTypes: string[];
  backgroundColor: string;
  accentColor: string;
}

export interface VehicleConfig {
  width: number;
  height: number;
  speed: number;
  spawnWeight: number;
}

export interface Player {
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  isMoving: boolean;
  animationFrame: number;
  animationState: 'idle' | 'hopping' | 'collision';
  animationProgress: number;
}

export interface Vehicle {
  id: string;
  type: string;
  x: number;
  y: number;
  speed: number;
  direction: 'left' | 'right';
  lane: number;
  width: number;
  height: number;
}

export type GameStatus = 'menu' | 'playing' | 'paused' | 'cityTransition' | 'gameOver';

export interface GameState {
  status: GameStatus;
  score: number;
  currentCity: number;
  lives: number;
  player: Player;
  vehicles: Vehicle[];
  currentLevel: number;
  hopCount: number;
  comboMultiplier: number;
  lastUpdateTime: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}
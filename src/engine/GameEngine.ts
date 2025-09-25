import { GameConfig, GameState, Vehicle } from '../types/game';
import { PlaceholderAssets } from '../utils/placeholderAssets';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: GameConfig;
  private gameState: GameState;
  private animationFrameId: number | null = null;
  private lastFrameTime: number = 0;

  // Callback for state changes
  public onStateChange?: (state: GameState) => void;

  constructor(canvas: HTMLCanvasElement, config: GameConfig) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.config = config;

    // Initialize game state
    this.gameState = this.createInitialState();
  }

  private createInitialState(): GameState {
    const { gameWidth, gameHeight, gridSize } = this.config.game;

    return {
      status: 'playing',
      score: 0,
      currentCity: 0,
      lives: 1, // Crossy Road style - one life
      player: {
        x: gameWidth / 2,
        y: gameHeight - gridSize * 2, // Start near bottom
        gridX: Math.floor(gameWidth / 2 / gridSize),
        gridY: Math.floor((gameHeight - gridSize * 2) / gridSize),
        isMoving: false,
        animationFrame: 0,
        animationState: 'idle',
        animationProgress: 0
      },
      vehicles: [],
      currentLevel: 1,
      hopCount: 0,
      comboMultiplier: 1,
      lastUpdateTime: 0
    };
  }

  async initialize(): Promise<void> {
    // Generate placeholder assets
    console.log('Initializing game engine with placeholder assets...');

    // Pre-generate commonly used sprites
    PlaceholderAssets.generatePlayerSprite('idle');
    PlaceholderAssets.generatePlayerSprite('hop');
    PlaceholderAssets.generatePlayerSprite('collision');

    // Generate vehicle sprites for Dhaka
    const dhakaCity = this.config.cities[0];
    for (const vehicleType of dhakaCity.vehicleTypes) {
      const vehicleConfig = this.config.vehicles[vehicleType];
      if (vehicleConfig) {
        PlaceholderAssets.generateVehicleSprite(vehicleType, 'left', vehicleConfig.width, vehicleConfig.height);
        PlaceholderAssets.generateVehicleSprite(vehicleType, 'right', vehicleConfig.width, vehicleConfig.height);
      }
    }

    // Generate background tiles
    PlaceholderAssets.generateBackgroundTile(this.config.game.gameWidth, 80, 'road');
    PlaceholderAssets.generateBackgroundTile(this.config.game.gameWidth, 80, 'sidewalk');

    console.log('Game engine initialized successfully');
  }

  start(): void {
    if (this.animationFrameId) return;

    this.lastFrameTime = performance.now();
    this.gameLoop();
  }

  stop(): void {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private gameLoop = (): void => {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    this.update(deltaTime);
    this.render();

    this.lastFrameTime = currentTime;
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  private update(deltaTime: number): void {
    if (this.gameState.status !== 'playing') return;

    this.updatePlayer(deltaTime);
    this.updateVehicles(deltaTime);
    this.checkCollisions();
    this.spawnVehicles();

    // Update game state callback
    if (this.onStateChange) {
      this.onStateChange({ ...this.gameState });
    }
  }

  private updatePlayer(deltaTime: number): void {
    const player = this.gameState.player;

    // Handle hop animation
    if (player.isMoving) {
      player.animationProgress += deltaTime / 200; // 200ms hop duration

      if (player.animationProgress >= 1) {
        // Hop complete
        player.isMoving = false;
        player.animationProgress = 0;
        player.animationState = 'idle';

        // Update grid position
        player.x = player.gridX * this.config.game.gridSize + this.config.game.gridSize / 2;
        player.y = player.gridY * this.config.game.gridSize + this.config.game.gridSize / 2;
      }
    }
  }

  private updateVehicles(deltaTime: number): void {
    const speedMultiplier = 1 + (this.gameState.currentLevel - 1) * this.config.difficulty.speedIncreasePerCity;

    // Update existing vehicles
    this.gameState.vehicles.forEach(vehicle => {
      const baseSpeed = this.config.vehicles[vehicle.type].speed;
      const actualSpeed = baseSpeed * speedMultiplier * (deltaTime / 16.67); // Normalize to ~60fps

      if (vehicle.direction === 'left') {
        vehicle.x -= actualSpeed;
      } else {
        vehicle.x += actualSpeed;
      }
    });

    // Remove off-screen vehicles
    this.gameState.vehicles = this.gameState.vehicles.filter(vehicle => {
      return vehicle.x > -200 && vehicle.x < this.config.game.gameWidth + 200;
    });
  }

  private spawnVehicles(): void {
    // Simple vehicle spawning logic
    if (Math.random() < this.config.difficulty.vehicleSpawnRate) {
      this.spawnRandomVehicle();
    }
  }

  private spawnRandomVehicle(): void {
    const currentCity = this.config.cities[this.gameState.currentCity];
    const vehicleTypes = currentCity.vehicleTypes;
    const randomType = vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)];
    const vehicleConfig = this.config.vehicles[randomType];

    if (!vehicleConfig) return;

    // Pick random lane (avoid safe zones)
    const availableLanes = this.config.lanes.positions.filter(pos =>
      !this.config.lanes.safeZones.includes(pos)
    );
    const randomLane = availableLanes[Math.floor(Math.random() * availableLanes.length)];
    const laneIndex = this.config.lanes.positions.indexOf(randomLane);

    // Random direction
    const direction = Math.random() > 0.5 ? 'left' : 'right';
    const startX = direction === 'left' ? this.config.game.gameWidth + 100 : -100;

    const newVehicle: Vehicle = {
      id: `vehicle-${Date.now()}-${Math.random()}`,
      type: randomType,
      x: startX,
      y: randomLane,
      speed: vehicleConfig.speed,
      direction,
      lane: laneIndex,
      width: vehicleConfig.width,
      height: vehicleConfig.height
    };

    this.gameState.vehicles.push(newVehicle);
  }

  private checkCollisions(): void {
    const player = this.gameState.player;
    const playerBounds = {
      x: player.x - 16,
      y: player.y - 16,
      width: 32,
      height: 32
    };

    for (const vehicle of this.gameState.vehicles) {
      const vehicleBounds = {
        x: vehicle.x - vehicle.width / 2,
        y: vehicle.y - vehicle.height / 2,
        width: vehicle.width,
        height: vehicle.height
      };

      if (this.boundingBoxCollision(playerBounds, vehicleBounds)) {
        this.handleCollision();
        return;
      }
    }
  }

  private boundingBoxCollision(box1: any, box2: any): boolean {
    return box1.x < box2.x + box2.width &&
           box1.x + box1.width > box2.x &&
           box1.y < box2.y + box2.height &&
           box1.y + box1.height > box2.y;
  }

  private handleCollision(): void {
    this.gameState.player.animationState = 'collision';
    this.gameState.status = 'gameOver';
    console.log('Game Over! Final Score:', this.gameState.score);
  }

  private render(): void {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.renderBackground();
    this.renderVehicles();
    this.renderPlayer();
    this.renderUI();
  }

  private renderBackground(): void {
    const { gameWidth, gameHeight } = this.config.game;

    // Render road
    const roadTile = PlaceholderAssets.generateBackgroundTile(gameWidth, 80, 'road');
    for (let y = 80; y < gameHeight - 80; y += 80) {
      this.ctx.drawImage(roadTile, 0, y);
    }

    // Render safe zones (sidewalks)
    const sidewalkTile = PlaceholderAssets.generateBackgroundTile(gameWidth, 80, 'sidewalk');
    this.ctx.drawImage(sidewalkTile, 0, 0); // Top safe zone
    this.ctx.drawImage(sidewalkTile, 0, gameHeight - 80); // Bottom safe zone
  }

  private renderVehicles(): void {
    for (const vehicle of this.gameState.vehicles) {
      const sprite = PlaceholderAssets.generateVehicleSprite(
        vehicle.type,
        vehicle.direction,
        vehicle.width,
        vehicle.height
      );

      this.ctx.drawImage(
        sprite,
        vehicle.x - vehicle.width / 2,
        vehicle.y - vehicle.height / 2
      );
    }
  }

  private renderPlayer(): void {
    const player = this.gameState.player;
    let sprite;

    switch (player.animationState) {
      case 'hopping':
        sprite = PlaceholderAssets.generatePlayerSprite('hop');
        break;
      case 'collision':
        sprite = PlaceholderAssets.generatePlayerSprite('collision');
        break;
      default:
        sprite = PlaceholderAssets.generatePlayerSprite('idle');
    }

    // Calculate position with animation
    let renderX = player.x;
    let renderY = player.y;

    if (player.isMoving) {
      // Interpolate position during hop
      const targetX = player.gridX * this.config.game.gridSize + this.config.game.gridSize / 2;
      const targetY = player.gridY * this.config.game.gridSize + this.config.game.gridSize / 2;

      renderX = player.x + (targetX - player.x) * player.animationProgress;
      renderY = player.y + (targetY - player.y) * player.animationProgress;
    }

    this.ctx.drawImage(sprite, renderX - 16, renderY - 16);
  }

  private renderUI(): void {
    // Score display
    this.ctx.fillStyle = 'white';
    this.ctx.font = '24px Arial';
    this.ctx.fillText(`Score: ${this.gameState.score}`, 20, 40);

    // City name
    const currentCity = this.config.cities[this.gameState.currentCity];
    this.ctx.fillText(`${currentCity.name}`, 20, 70);

    // Game over overlay
    if (this.gameState.status === 'gameOver') {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      this.ctx.fillStyle = 'white';
      this.ctx.font = '48px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 50);

      this.ctx.font = '24px Arial';
      this.ctx.fillText(`Final Score: ${this.gameState.score}`, this.canvas.width / 2, this.canvas.height / 2);

      this.ctx.font = '18px Arial';
      this.ctx.fillText('Press R to restart', this.canvas.width / 2, this.canvas.height / 2 + 50);

      this.ctx.textAlign = 'left';
    }
  }

  public handleInput(input: 'up' | 'left' | 'right' | 'pause' | 'restart'): void {
    // Handle restart in any state
    if (input === 'restart') {
      this.gameState = this.createInitialState();
      return;
    }

    // Legacy: also allow up key to restart in game over state
    if (this.gameState.status === 'gameOver' && input === 'up') {
      this.gameState = this.createInitialState();
      return;
    }

    if (this.gameState.status !== 'playing') return;
    if (this.gameState.player.isMoving) return; // Prevent input during animation

    const player = this.gameState.player;
    const { gridSize } = this.config.game;

    switch (input) {
      case 'up':
        if (player.gridY > 0) {
          player.gridY--;
          this.startHop();
          this.gameState.score += this.config.scoring.pointsPerHop;
          this.gameState.hopCount++;
        }
        break;

      case 'left':
        if (player.gridX > 0) {
          player.gridX--;
          this.startHop();
        }
        break;

      case 'right':
        if (player.gridX < Math.floor(this.config.game.gameWidth / gridSize) - 1) {
          player.gridX++;
          this.startHop();
        }
        break;

      case 'pause':
        this.gameState.status = this.gameState.status === 'playing' ? 'paused' : 'playing';
        break;
    }
  }

  private startHop(): void {
    this.gameState.player.isMoving = true;
    this.gameState.player.animationState = 'hopping';
    this.gameState.player.animationProgress = 0;
  }
}
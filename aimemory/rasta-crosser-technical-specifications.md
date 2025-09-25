# Rasta Crosser - Technical Specifications

Based on actual implementation as of Phase 1 completion.

## System Architecture

### Overview
Hybrid React + Canvas architecture providing optimal performance for game rendering while maintaining React's component-based UI management.

```
┌─────────────────────────────────────────┐
│              React App Layer            │
│  ┌─────────────┐  ┌─────────────────────┐│
│  │   Header    │  │     Footer          ││
│  │ (Score/City)│  │ (Controls Info)     ││
│  └─────────────┘  └─────────────────────┘│
│  ┌─────────────────────────────────────┐ │
│  │         Canvas Container            │ │
│  │  ┌─────────────────────────────────┐│ │
│  │  │        Game Canvas             ││ │
│  │  │      (800x600 internal)        ││ │
│  │  │    Responsive Scaled           ││ │
│  │  └─────────────────────────────────┘│ │
│  └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Core Components

#### 1. React Layer (UI Management)
- **App.tsx** - Root application component
- **GameCanvas.tsx** - Canvas wrapper with input handling
- **useGameConfig.ts** - Configuration loading hook

#### 2. Canvas Layer (Game Engine)
- **GameEngine.ts** - Core game loop, state management, rendering
- **PlaceholderAssets.ts** - Dynamic sprite generation system

#### 3. Configuration System
- **gameConfig.json** - Centralized game parameters
- **types/game.ts** - TypeScript interfaces

---

## Data Structures & Interfaces

### Core Game Types
```typescript
interface GameConfig {
  game: {
    targetFPS: 60,
    gridSize: 40,           // 40px grid cells
    gameWidth: 800,         // Internal canvas width
    gameHeight: 600         // Internal canvas height
  },
  difficulty: {
    baseVehicleSpeed: 2.0,
    speedIncreasePerCity: 0.15,    // 15% faster each city
    vehicleSpawnRate: 0.02,
    spawnRateIncreasePerCity: 0.1,  // 10% more frequent
    minGapBetweenVehicles: 120,
    gapDecreasePerCity: 5           // 5px smaller gaps
  },
  scoring: {
    pointsPerHop: 1,
    roadCompletionBonus: 10,
    cityCompletionBonus: 50,
    hopsPerCity: 75,                // Configurable city completion
    comboMultiplier: 1.2
  }
}

interface GameState {
  status: 'menu' | 'playing' | 'paused' | 'cityTransition' | 'gameOver',
  score: number,
  currentCity: number,
  lives: 1,                        // Crossy Road style - one life
  player: Player,
  vehicles: Vehicle[],
  currentLevel: number,
  hopCount: number,
  comboMultiplier: number
}

interface Player {
  x: number,                       // Pixel coordinates
  y: number,
  gridX: number,                   // Grid coordinates (0-19)
  gridY: number,                   // Grid coordinates (0-14)
  isMoving: boolean,
  animationFrame: number,
  animationState: 'idle' | 'hopping' | 'collision',
  animationProgress: number        // 0-1 for smooth interpolation
}

interface Vehicle {
  id: string,
  type: 'cng' | 'rickshaw' | 'bus' | 'truck' | 'motorcycle' | 'car' | 'tempo',
  x: number,
  y: number,
  speed: number,
  direction: 'left' | 'right',
  lane: number,
  width: number,
  height: number
}
```

---

## Game Engine Specifications

### Core Game Loop
```typescript
class GameEngine {
  private gameLoop(timestamp: number) {
    const deltaTime = timestamp - this.lastFrameTime;

    this.update(deltaTime);    // 60 FPS game logic
    this.render();             // Canvas rendering

    requestAnimationFrame(this.gameLoop);
  }

  private update(deltaTime: number) {
    this.updatePlayer(deltaTime);      // Animation & movement
    this.updateVehicles(deltaTime);    // Vehicle movement & spawning
    this.checkCollisions();            // AABB collision detection
    this.spawnVehicles();              // Dynamic spawning logic
  }
}
```

### Grid System Implementation
- **Grid Size:** 40px × 40px cells
- **Total Grid:** 20 × 15 cells (800×600 canvas)
- **Player Movement:** Discrete grid jumps with smooth animation
- **Animation Duration:** 200ms per hop
- **Movement Constraints:** Boundary checking, no diagonal movement

### Collision Detection
```typescript
// Bounding box collision system
interface BoundingBox {
  x: number,      // Top-left corner
  y: number,
  width: number,
  height: number
}

// Player hitbox: 32×32px centered on grid cell
// Vehicle hitboxes: Variable size based on vehicle type
// Collision: AABB (Axis-Aligned Bounding Box) algorithm
```

---

## Vehicle System

### Vehicle Configuration
```typescript
const VEHICLES = {
  cng:        { width: 48,  height: 24, speed: 1.5, spawnWeight: 0.3  },
  rickshaw:   { width: 64,  height: 32, speed: 0.8, spawnWeight: 0.25 },
  bus:        { width: 96,  height: 32, speed: 1.2, spawnWeight: 0.1  },
  truck:      { width: 128, height: 40, speed: 1.0, spawnWeight: 0.05 },
  motorcycle: { width: 32,  height: 16, speed: 2.5, spawnWeight: 0.15 },
  car:        { width: 64,  height: 24, speed: 1.8, spawnWeight: 0.1  },
  tempo:      { width: 56,  height: 28, speed: 1.3, spawnWeight: 0.05 }
};
```

### Lane System
- **Fixed 5-lane roads** across all cities
- **Lane positions:** Y-coordinates [80, 160, 240, 320, 400]
- **Safe zones:** Y-coordinates [0, 480, 560] (top/bottom sidewalks)
- **Lane width:** 80px each
- **Vehicle movement:** Strict lane adherence, no weaving

### Spawning Algorithm
```typescript
// Weighted random selection
function spawnVehicle() {
  const vehicleType = weightedRandom(DHAKA_VEHICLES, spawnWeights);
  const lane = randomLane(excludingSafeZones);
  const direction = random(['left', 'right']);
  const startX = direction === 'left' ? gameWidth + 100 : -100;

  return new Vehicle(vehicleType, startX, laneY, direction);
}

// Spawn rate scales with difficulty
const currentSpawnRate = baseSpawnRate * (1 + level * spawnRateIncrease);
```

---

## Asset Management System

### Placeholder Generation
```typescript
class PlaceholderAssets {
  // Dynamic sprite generation for development
  static generatePlayerSprite(state: 'idle' | 'hop' | 'collision', size: 32px)
  static generateVehicleSprite(type: string, direction: 'left'|'right', width, height)
  static generateBackgroundTile(width: 800px, height: 80px, type: 'road'|'sidewalk')
}
```

### Asset Structure (Ready for Drop-in)
```
public/assets/
├── sprites/
│   ├── player/
│   │   ├── idle.png           # 32×32px
│   │   ├── hop-1.png          # Animation frame 1
│   │   ├── hop-2.png          # Animation frame 2
│   │   └── collision.png      # Death animation
│   └── vehicles/
│       ├── cng-left.png       # 48×24px
│       ├── cng-right.png
│       ├── rickshaw-left.png  # 64×32px
│       ├── rickshaw-right.png
│       └── ... (all 7 vehicle types × 2 directions)
├── backgrounds/
│   ├── dhaka.png              # 800×80px road section
│   ├── road-tile.png          # Repeatable road texture
│   └── sidewalk.png           # Safe zone texture
└── audio/
    ├── hop.wav                # Player movement sound
    ├── collision.wav          # Death sound
    ├── score.wav              # Point gained sound
    └── background.mp3         # Gameplay music
```

---

## Input System Specifications

### Input Mapping
```typescript
const INPUT_MAPPING = {
  // Desktop keyboard
  'ArrowUp':    'up',      'w': 'up',      'W': 'up',
  'ArrowLeft':  'left',    'a': 'left',    'A': 'left',
  'ArrowRight': 'right',   'd': 'right',   'D': 'right',
  ' ':          'pause',                   // Spacebar
  'r':          'restart', 'R': 'restart', // NEW FEATURE

  // Mobile touch
  'tap':        'up',      // Forward movement
  'swipeLeft':  'left',    // Lateral movement
  'swipeRight': 'right'
};

// Touch gesture detection
const TOUCH_CONFIG = {
  minSwipeDistance: 30,     // pixels
  maxSwipeTime: 200,        // milliseconds
  tapZone: '70%',           // percentage of screen height
};
```

### Input Processing
```typescript
// Prevent rapid-fire input
const INPUT_COOLDOWN = 50; // milliseconds between inputs

// Input validation
function handleInput(input: InputType) {
  if (gameState.status !== 'playing') return;
  if (gameState.player.isMoving) return;     // Block during animation
  if (Date.now() - lastInputTime < INPUT_COOLDOWN) return;

  processMovement(input);
}
```

---

## Responsive Design System

### Canvas Scaling
```typescript
interface ResponsiveConfig {
  gameWidth: 800,           // Internal resolution
  gameHeight: 600,
  minAspectRatio: 0.75,    // 3:4 portrait mobile
  maxAspectRatio: 2.0,     // 2:1 wide desktop

  // Scaling algorithm
  scaleToFit: 'contain',    // Maintain aspect ratio
  centerAlignment: true,
  maxWidth: '100vw',
  maxHeight: '100vh'
}

// Dynamic scaling function
function scaleCanvas(container: HTMLElement, canvas: HTMLCanvasElement) {
  const containerAspect = container.clientWidth / container.clientHeight;
  const gameAspect = 800 / 600;

  if (containerAspect > gameAspect) {
    // Fit to height, center horizontally
    canvas.style.height = '100%';
    canvas.style.width = 'auto';
  } else {
    // Fit to width, center vertically
    canvas.style.width = '100%';
    canvas.style.height = 'auto';
  }
}
```

### Mobile Optimizations
- **Touch zones** mapped to canvas coordinates
- **No zoom** on double-tap (`touch-action: manipulation`)
- **No text selection** (`user-select: none`)
- **Responsive font sizes** for UI elements
- **Minimum touch target size** 44×44px (iOS guidelines)

---

## Performance Specifications

### Target Performance
- **60 FPS** on desktop and modern mobile devices
- **Maximum 50 vehicles** on screen simultaneously
- **Sub-16ms frame times** for smooth gameplay
- **Responsive input** with <50ms latency

### Optimization Strategies
```typescript
// Object pooling for vehicles
class VehiclePool {
  private pool: Vehicle[] = [];
  private maxSize = 100;

  acquire(): Vehicle { /* reuse existing */ }
  release(vehicle: Vehicle): void { /* return to pool */ }
}

// Efficient rendering
function render() {
  // Only clear and redraw changed regions
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Render in layers (background → vehicles → player → UI)
  renderBackground();
  renderVehicles();     // Cull off-screen vehicles
  renderPlayer();
  renderUI();
}

// Memory management
function updateVehicles() {
  // Remove off-screen vehicles
  this.vehicles = this.vehicles.filter(v =>
    v.x > -200 && v.x < gameWidth + 200
  );
}
```

---

## Testing Architecture

### Test Framework
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **jsdom** - DOM mocking for headless tests

### Test Coverage
```typescript
// Core game logic tests
describe('GameEngine', () => {
  test('Player movement logic')          // ✅ Grid-based movement
  test('Collision detection')            // ✅ AABB algorithm
  test('Vehicle spawning')               // ✅ Weighted randomization
  test('Difficulty scaling')             // ✅ Linear progression
  test('State transitions')              // ✅ Game state management
});

// Input handling tests
describe('Input System', () => {
  test('Keyboard mapping')               // ✅ All key combinations
  test('Touch gesture detection')        // ✅ Swipe vs tap
  test('Input validation')               // ✅ Cooldown & state checks
  test('Restart functionality')          // ✅ R key + backward compatibility
});

// Rendering tests
describe('Canvas Rendering', () => {
  test('Responsive scaling')             // ✅ Multi-device support
  test('Asset placeholder generation')   // ✅ Dynamic sprites
  test('Animation interpolation')        // ✅ Smooth movement
});
```

### TDD Methodology
- **Red-Green-Refactor** cycle followed
- **Failing tests first** to define expected behavior
- **Bug fixes via TDD** - write test, implement fix, verify
- **Continuous integration** ready

---

## Configuration Management

### gameConfig.json Structure
```json
{
  "game": {
    "targetFPS": 60,
    "gridSize": 40,
    "gameWidth": 800,
    "gameHeight": 600
  },
  "difficulty": {
    "baseVehicleSpeed": 2.0,
    "speedIncreasePerCity": 0.15,
    "vehicleSpawnRate": 0.02,
    "spawnRateIncreasePerCity": 0.1,
    "minGapBetweenVehicles": 120,
    "gapDecreasePerCity": 5
  },
  "scoring": {
    "pointsPerHop": 1,
    "roadCompletionBonus": 10,
    "cityCompletionBonus": 50,
    "hopsPerCity": 75,
    "comboMultiplier": 1.2
  },
  "cities": [
    {
      "name": "Dhaka",
      "id": "dhaka",
      "unlockScore": 0,
      "vehicleTypes": ["cng", "rickshaw", "bus", "truck", "motorcycle", "car", "tempo"],
      "backgroundColor": "#4A5568",
      "accentColor": "#F6E05E"
    }
  ],
  "vehicles": { /* vehicle configurations */ },
  "lanes": {
    "count": 5,
    "width": 80,
    "positions": [80, 160, 240, 320, 400],
    "safeZones": [0, 480, 560]
  }
}
```

### Configuration Loading
```typescript
// Hot-reloadable configuration
const useGameConfig = () => {
  const [config, setConfig] = useState<GameConfig | null>(null);

  useEffect(() => {
    fetch('/gameConfig.json')
      .then(response => response.json())
      .then(setConfig)
      .catch(handleConfigError);
  }, []);

  return { config, loading, error };
};
```

---

## Deployment Specifications

### Build Configuration
```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2015',           // Wide browser support
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,           // Disable for production
    minify: 'terser',          // Optimal compression
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']  // Separate vendor chunk
        }
      }
    }
  },
  server: {
    port: 5173,
    host: true                  // Allow network access
  }
});
```

### Static Hosting Requirements
- **Assets served from `/public`** directory
- **SPA routing** not required (single page)
- **HTTPS recommended** for mobile features
- **Gzip compression** for optimal loading
- **CDN distribution** recommended for global access

### Browser Compatibility
- **Modern browsers** (ES2015+ support)
- **Mobile Safari** iOS 12+
- **Chrome** 70+
- **Firefox** 65+
- **Edge** 18+

---

## Security Considerations

### Client-Side Security
- **No sensitive data** stored in game
- **Local storage only** for high scores
- **No external API calls** in current implementation
- **Safe asset loading** from same origin

### Content Security Policy
```html
<!-- Recommended CSP headers -->
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';
               img-src 'self' data:;
               font-src 'self';">
```

---

## Future Technical Enhancements

### Planned Improvements
1. **Audio System Integration**
   - Web Audio API for sound effects
   - Background music with volume controls
   - Audio sprite loading for performance

2. **Advanced Asset Management**
   - Asset preloading with progress indication
   - Texture atlasing for optimized rendering
   - Dynamic asset loading per city

3. **Enhanced Animation System**
   - Sprite sheet animations
   - Particle effects for collisions/score
   - Screen shake and juice effects

4. **Multiplayer Architecture** (Future)
   - WebSocket connection for real-time play
   - Shared game state synchronization
   - Leaderboard integration

---

*This technical specification document reflects the current implementation of Rasta Crosser and serves as a blueprint for continued development and maintenance.*
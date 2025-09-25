# Rasta Crosser - PRD (Updated Based on Implementation)

## Game Overview
An infinite crosser game where players navigate through increasingly challenging streets of Bangladesh, crossing roads filled with local vehicles. Each level represents a different Bangladeshi city with unique thematic elements.

## Core Concept
**Game Title:** Rasta Crosser (রাস্তা Crosser - "rasta" = street in Bengali)
**Genre:** Arcade / Infinite Runner / Crossy Road Clone
**Platform:** Web (Desktop & Mobile)
**Art Style:** Cartoonish, family-friendly
**Target Audience:** All ages (kids to adults)

---

## Game Mechanics

### Player Character ✅ IMPLEMENTED
- **Type:** Rastafarian character (human)
- **Design Notes:**
  - Colorful, cartoonish style with dreadlocks
  - Bright, happy demeanor
  - Exaggerated hop animation for whimsy
  - On collision: comical spin/tumble animation (no violence)
  - Cultural note: Character represents the playful wordplay of "Rasta" (street) and Rastafarian
- **Movement:** Tap/click to hop forward, swipe/arrow keys for left/right movement ✅

### Obstacles (Vehicles) ✅ IMPLEMENTED
- **CNG Auto-rickshaw (Baby Taxi)** - Small, fast, weaving ✅
- **Rickshaw** - Slow, steady, often in groups ✅
- **Bus** - Large, takes up more space, moderate speed ✅
- **Truck** - Largest, slowest but deadly ✅
- **Motorcycle** - Very fast, small ✅
- **Private Car** - Medium size, medium speed ✅
- **Tempo/Leguna** - Medium size, can appear in lanes ✅

### Level Progression ✅ PARTIALLY IMPLEMENTED

#### Infinite Scroller with City Themes
Each "level" = 75 successful hops (configurable), then transition to new city

**Current Implementation:**
1. **Dhaka** - Chaotic traffic, all vehicle types, dense ✅ IMPLEMENTED

**Planned City Progression:**
2. **Chittagong** - Port theme, more trucks, slight industrial feel
3. **Sylhet** - Tea garden elements in background, slightly calmer traffic
4. **Khulna** - Shrimp/fishing industry theme, unique decorations
5. **Rajshahi** - Mango tree backgrounds, agricultural elements
6. **Barisal** - River elements, boats occasionally visible
7. **Rangpur** - Northern climate, different building styles
8. **Cox's Bazar** - Beach theme, tourist elements
9. **Mymensingh** - Educational theme (BAUS), student vehicles
10. **Comilla** - Sweet shop decorations, cultural elements

**Difficulty Scaling:** ✅ IMPLEMENTED
- Speed increases gradually (15% per city) ✅
- More vehicles spawn (10% increase per city) ✅
- Narrower gaps between vehicles (5px decrease per city) ✅
- All parameters configurable via `gameConfig.json` ✅

---

## Technical Requirements ✅ IMPLEMENTED

### Architecture: Hybrid React + Canvas ✅

#### React Components (UI Layer) ✅ PARTIALLY IMPLEMENTED
- **Main Menu** - ⚠️ PENDING IMPLEMENTATION
- **Game HUD** (Overlay on canvas) ✅ IMPLEMENTED
  - Current score ✅
  - Current city name ✅
  - Header with game title ✅
  - Controls info footer ✅
- **Game Over Screen** ✅ IMPLEMENTED
  - Final score ✅
  - Restart options (R key + tap/click) ✅
- **City Transition Screen** - ⚠️ PENDING IMPLEMENTATION

#### Canvas Layer (Game World) ✅ IMPLEMENTED
- Character rendering and animation ✅
- Vehicle rendering and movement ✅
- Background/road rendering ✅
- Collision detection ✅
- Grid-based movement system ✅
- Responsive canvas scaling ✅

### Asset Requirements ✅ PLACEHOLDER SYSTEM IMPLEMENTED

#### Current Implementation: Programmatic Placeholders ✅
- **Character Placeholders:**
  - Idle sprite (green rectangle with "RASTA") ✅
  - Hopping animation (darker green with "HOP!") ✅
  - Collision animation (red with "OUCH") ✅

- **Vehicle Placeholders:** (Each vehicle has left/right directions) ✅
  - CNG (yellow with "CNG" + arrow) ✅
  - Rickshaw (green with "RICKSHAW" + arrow) ✅
  - Bus (blue with "BUS" + arrow) ✅
  - Truck (gray with "TRUCK" + arrow) ✅
  - Motorcycle (red with "MOTO" + arrow) ✅
  - Car (purple with "CAR" + arrow) ✅
  - Tempo (orange with "TEMPO" + arrow) ✅

- **Background Placeholders:** ✅
  - Road tiles with lane dividers ✅
  - Sidewalk pattern ✅

#### Asset Drop-in System ✅ READY
- Assets can be dropped into `public/assets/` folders
- Automatic replacement of placeholders when real assets are provided
- Maintains exact file naming conventions for easy replacement

### Game States ✅ PARTIALLY IMPLEMENTED
1. **Menu** - ⚠️ PENDING IMPLEMENTATION
2. **Playing** - ✅ IMPLEMENTED
3. **Paused** - ✅ IMPLEMENTED
4. **City Transition** - ⚠️ PENDING IMPLEMENTATION
5. **Game Over** - ✅ IMPLEMENTED

---

## Scoring System ✅ IMPLEMENTED

- **+1 point** per forward movement (successful hop) ✅
- **+10 bonus** for crossing a full road section ✅ (planned)
- **+50 bonus** for city completion ✅ (planned)
- **Combo system:** ✅ (planned - multiplier system in config)
- **High score** persisted in localStorage ⚠️ (not yet implemented)

---

## Controls ✅ FULLY IMPLEMENTED

### Desktop ✅
- **Arrow Keys / WASD:** Movement (Up = forward, Left/Right = lateral) ✅
- **Spacebar:** Pause ✅
- **R Key:** Restart game (NEW FEATURE) ✅
- **Click:** Menu interactions ✅

### Mobile ✅
- **Tap ahead:** Move forward ✅
- **Swipe left/right:** Lateral movement ✅
- **Touch-friendly interface** with no zoom/pinch ✅

---

## Visual Design Notes ✅ IMPLEMENTED

### Color Palette
- **Dhaka Implementation:** Yellow/Green accent colors ✅
- Dark themed UI (dark gray background) ✅
- Vibrant colored vehicle placeholders ✅
- High contrast text for accessibility ✅

### Animation Style ✅ IMPLEMENTED
- Smooth, grid-based character hops (200ms duration) ✅
- Collision state with color change ✅
- Responsive canvas scaling ✅

---

## Quality Assurance ✅ IMPLEMENTED

### Testing Framework ✅
- **Vitest + React Testing Library** setup ✅
- **Unit tests** for core game engine logic ✅
- **TDD approach** for bug fixes and new features ✅

### Test Coverage ✅
- Player movement logic (grid-based, boundary checks) ✅
- Game state management (playing, paused, game over) ✅
- Restart functionality (R key + backward compatibility) ✅
- Initial state calculations ✅
- Collision detection logic ✅

---

## Current Status

### ✅ COMPLETED (Phase 1)
- Core game mechanics and movement
- All 7 vehicle types with different speeds
- Grid-based collision detection
- Responsive canvas setup
- Desktop and mobile controls
- Pause/resume functionality
- Game over and restart
- R key restart functionality
- Comprehensive test suite
- Placeholder asset system
- Configuration-driven difficulty scaling

### ⚠️ PENDING IMPLEMENTATION
- Main menu screen
- City transition animations
- Additional cities (9 remaining)
- High score persistence
- Audio system integration
- Real asset integration

---

## Success Metrics

- **Technical Quality:** ✅ Comprehensive test coverage, TDD approach
- **Gameplay:** ✅ Core mechanics work smoothly
- **Accessibility:** ✅ Responsive design, keyboard + touch controls
- **Performance:** ✅ 60 FPS target, optimized rendering

---

## Design Decisions Made

1. **Character Selection:** ✅ **DECIDED - Rastafarian character for "Rasta Crosser" wordplay**

2. **Death Mechanics:** ✅ **DECIDED - One-hit death (Crossy Road style)**

3. **Difficulty Curve:** ✅ **DECIDED - Linear scaling with configurable parameters**
   - 15% speed increase per city
   - 10% spawn rate increase per city
   - 5px gap decrease per city
   - All values tunable via `gameConfig.json`

4. **Monetization:** **TBD - Currently free web game**

5. **Grid System:** ✅ **DECIDED - 40px grid for precise movement**

6. **Restart Mechanism:** ✅ **DECIDED - R key restart + backward compatibility**

---

## Technical Architecture

- **Frontend:** React + TypeScript ✅
- **Canvas Rendering:** HTML5 Canvas API ✅
- **State Management:** React hooks ✅
- **Testing:** Vitest + React Testing Library ✅
- **Build Tool:** Vite ✅
- **Configuration:** JSON-based game config ✅
- **Deployment:** Ready for static hosting ✅

---

*This updated PRD reflects the actual implementation of "Rasta Crosser" - a culturally rich, accessible, and engaging arcade game celebrating Bangladesh's vibrant street culture with a playful linguistic twist.*
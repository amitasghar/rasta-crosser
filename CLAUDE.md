# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Rasta Crosser is an infinite crosser game (Crossy Road style) featuring Bangladeshi street navigation with cultural themes. The game progresses through different Bangladeshi cities, each with unique vehicles and thematic elements.

## Architecture

**Hybrid React + Canvas Architecture:**
- React components handle UI layer (menus, HUD, overlays)
- HTML5 Canvas handles game world (character, vehicles, collision detection, animations)
- TypeScript for type safety
- Vite as build tool

## Development Commands

- `npm install` - Install dependencies
- `npm run dev` - Start development server (runs on http://localhost:5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run lint` - Run ESLint (if configured)

## Current Implementation Status

**Phase 1 - COMPLETED:**
- ✅ Canvas setup with responsive scaling
- ✅ Grid-based player movement (40px grid)
- ✅ Placeholder sprite generation system
- ✅ Basic collision detection
- ✅ Vehicle spawning and movement system
- ✅ Game state management
- ✅ Desktop (WASD/Arrow keys) and mobile (tap/swipe) controls

**Current Features:**
- Playable game with Rastafarian character
- 5-lane roads with Dhaka city traffic
- 7 vehicle types with different speeds and colors
- Crossy Road-style one-hit gameplay
- Score tracking and game over screen
- Responsive design for desktop and mobile
- **R key restart functionality** - Press R to restart game anytime
- Backward compatible up-key restart in game over state

## Key Components Structure

### React Layer (UI)
- `App.tsx` - Main app component with header/footer
- `GameCanvas.tsx` - Canvas wrapper with input handling
- `useGameConfig.ts` - Hook for loading game configuration

### Canvas Layer (Game World)
- `GameEngine.ts` - Core game engine with update/render loop
- `PlaceholderAssets.ts` - Sprite generation system

### Configuration
- `gameConfig.json` - All game balance and configuration parameters
- `types/game.ts` - TypeScript interfaces for all game entities

## Game Configuration

The game uses `public/gameConfig.json` for easy difficulty tuning:
- Vehicle speeds and spawn rates
- Difficulty scaling per level
- Score thresholds for city transitions
- All game balance parameters

## Asset Drop-in System

**Current Status:** Placeholder sprites generated programmatically
**Ready for:** Drop-in replacement with real asset files

Asset structure:
```
public/assets/
  sprites/
    player/     - Character animations
    vehicles/   - Vehicle sprites (left/right directions)
  backgrounds/  - Road and city backgrounds
  audio/        - Sound effects and music
```

## Game States

1. Menu - Starting screen (not yet implemented)
2. Playing - Active gameplay ✅
3. Paused - Gameplay frozen ✅
4. City Transition - Between levels (not yet implemented)
5. Game Over - Death screen ✅

## Controls

- Desktop: Arrow keys/WASD for movement, Spacebar to pause, **R key to restart**
- Mobile: Tap to move forward, swipe for lateral movement
- Game Over: Tap/click to restart, **R key to restart**, or up arrow (legacy)

## City Progression System

Currently implemented:
- Dhaka city with all 7 vehicle types
- Linear difficulty scaling
- Score-based progression

## Next Development Phases

**Phase 2 - Game States & UI:**
- Main menu screen
- City transition animations
- Pause menu
- Settings screen

**Phase 3 - Additional Cities:**
- Implement remaining 9+ cities
- City-specific vehicle spawning patterns
- Background variations per city

**Phase 4 - Asset Integration:**
- Replace placeholder sprites with real assets
- Audio system implementation
- Polish and animations

## Testing & Quality Assurance

**Test-Driven Development Approach:**
- Vitest + React Testing Library setup
- Unit tests for core game engine logic
- Integration tests for input handling
- TDD methodology used for bug fixes and new features

**Test Coverage:**
- ✅ Player movement logic (grid-based, boundary checks)
- ✅ Game state management (playing, paused, game over)
- ✅ Restart functionality (R key + backward compatibility)
- ✅ Initial state calculations
- ✅ Collision detection logic

**Bug Fixes via TDD:**
- ❌ "Initial up move also moves right" - **False report, no bug found**
- ✅ **R key restart functionality** - Successfully implemented
- ✅ Backward compatibility maintained for up-key restart
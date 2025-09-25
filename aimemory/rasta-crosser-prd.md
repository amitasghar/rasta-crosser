# Bangladesh Street Crosser - PRD

## Game Overview
An infinite crosser game where players navigate through increasingly challenging streets of Bangladesh, crossing roads filled with local vehicles. Each level represents a different Bangladeshi city with unique thematic elements.

## Core Concept
**Genre:** Arcade / Infinite Runner / Crossy Road Clone  
**Platform:** Web (Desktop & Mobile)  
**Art Style:** Cartoonish, family-friendly  
**Target Audience:** All ages (kids to adults)

---

## Game Mechanics

### Player Character
- **Type:** Animal (to keep collision cartoonish and kid-friendly)
- **Options to consider:**
  - **Royal Bengal Tiger** (national animal - brave, recognizable)
  - **Asian Elephant** (cultural significance, cute)
  - **Street Cat/Dog** (relatable, fits urban setting)
  - **Crow** (common in Bangladesh, could hop instead of fly)
- **Movement:** Tap/click to hop forward, swipe/arrow keys for left/right movement

### Obstacles (Vehicles)
- **CNG Auto-rickshaw (Baby Taxi)** - Small, fast, weaving
- **Rickshaw** - Slow, steady, often in groups
- **Bus** - Large, takes up more space, moderate speed
- **Truck** - Largest, slowest but deadly
- **Motorcycle** - Very fast, small
- **Private Car** - Medium size, medium speed
- **Tempo/Leguna** - Medium size, can appear in lanes

### Level Progression

#### Infinite Scroller with City Themes
Each "level" = 50-100 successful crossings, then transition to new city

**Example City Progression:**
1. **Dhaka** - Chaotic traffic, all vehicle types, dense
2. **Chittagong** - Port theme, more trucks, slight industrial feel
3. **Sylhet** - Tea garden elements in background, slightly calmer traffic
4. **Khulna** - Shrimp/fishing industry theme, unique decorations
5. **Rajshahi** - Mango tree backgrounds, agricultural elements
6. **Barisal** - River elements, boats occasionally visible
7. **Rangpur** - Northern climate, different building styles
8. **Cox's Bazar** - Beach theme, tourist elements
9. **Mymensingh** - Educational theme (BAUS), student vehicles
10. **Comilla** - Sweet shop decorations, cultural elements

**Difficulty Scaling:**
- Speed increases gradually
- More vehicles spawn
- Narrower gaps between vehicles
- Introduction of new vehicle patterns

---

## Technical Requirements

### Architecture: Hybrid React + Canvas

#### React Components (UI Layer)
- **Main Menu**
  - Play button
  - High score display
  - Settings (sound on/off)
  - How to play
  
- **Game HUD** (Overlay on canvas)
  - Current score
  - Current city name
  - Lives/health indicator
  - Pause button
  
- **Game Over Screen**
  - Final score
  - High score
  - Retry button
  - Share score (optional)
  
- **City Transition Screen**
  - City name announcement
  - Brief animation/celebration
  - "Get Ready" countdown

#### Canvas Layer (Game World)
- Character rendering and animation
- Vehicle rendering and movement
- Background/road rendering
- Collision detection
- Particle effects (dust, impact, celebration)
- Thematic decorations per city

### Asset Requirements

#### Sprites (To be provided by developer)
- **Character:**
  - Idle sprite
  - Hopping animation (4-6 frames)
  - Death/collision animation
  
- **Vehicles:** (Each vehicle needs 2 directions: left-to-right, right-to-left)
  - CNG (Baby Taxi)
  - Rickshaw
  - Bus
  - Truck
  - Motorcycle
  - Car
  - Tempo
  
- **Environment:**
  - Road tiles
  - Sidewalk/safe zone
  - City-specific background elements (10 sets)
  - Decorative items (trees, buildings, shops, landmarks)

#### Audio (To be provided by developer)
- **Sound Effects:**
  - Hop sound
  - Vehicle horn (multiple types)
  - Collision/death sound
  - Score increment sound
  - Level complete/city transition sound
  - Button click
  
- **Music:**
  - Main menu theme
  - Gameplay background music (can vary per city or universal)
  - Game over jingle

### Game States
1. **Menu** - Starting screen
2. **Playing** - Active gameplay
3. **Paused** - Gameplay frozen
4. **City Transition** - Between levels
5. **Game Over** - Death screen with retry option

---

## Scoring System

- **+1 point** per forward movement (successful hop)
- **+10 bonus** for crossing a full road section
- **+50 bonus** for city completion
- **Combo system:** Consecutive successful crossings without stopping = multiplier
- **High score** persisted in localStorage

---

## Controls

### Desktop
- **Arrow Keys / WASD:** Movement (Up = forward, Left/Right = lateral)
- **Spacebar:** Pause
- **Click:** Menu interactions

### Mobile
- **Tap ahead:** Move forward
- **Swipe left/right:** Lateral movement
- **Tap pause icon:** Pause game

---

## Visual Design Notes

### Color Palette
- Bright, vibrant colors reflecting Bangladesh's colorful culture
- Each city has accent colors:
  - Dhaka: Yellow/Green (rickshaw colors)
  - Chittagong: Blue/Gray (port/industrial)
  - Sylhet: Green (tea gardens)
  - etc.

### Animation Style
- Smooth, bouncy character hops
- Exaggerated cartoon physics on collision
- Particle effects for visual feedback
- Screen shake on collision (subtle)

---

## Accessibility Features

- High contrast mode option
- Sound effect visualization (for hearing impaired)
- Adjustable game speed (easy mode)
- Colorblind-friendly palette options
- Clear visual indicators for safe zones

---

## Future Enhancements (Post-MVP)
- Character skins/unlockables
- Daily challenges
- Leaderboards
- Power-ups (temporary invincibility, slow-mo)
- Different weather conditions
- Night mode levels
- Multiplayer race mode

---

## Success Metrics

- **Engagement:** Average session length > 5 minutes
- **Retention:** Players reaching at least city 3
- **Virality:** Share rate of high scores
- **Accessibility:** Playable by ages 6-60+

---

## Open Questions / Design Decisions Needed

1. **Character Selection:** Which animal fits best thematically?
   - Tiger (bold, national symbol)
   - Elephant (recognizable, cute)
   - Street animal (cat/dog - more relatable to urban setting)

2. **Death Mechanics:** 
   - One-hit death? (true to Crossy Road)
   - Three lives system? (more forgiving for kids)

3. **Difficulty Curve:**
   - How aggressive should speed scaling be?
   - Should vehicle density cap at some point?

4. **Monetization** (if applicable):
   - Free with ads?
   - Purely free as cultural project?
   - Cosmetic purchases only?

---

## Timeline Estimate

**Phase 1 - Core Mechanics (Week 1-2)**
- Basic movement and collision
- Single vehicle type
- Simple scoring

**Phase 2 - Content (Week 3-4)**
- All vehicle types
- 3-5 cities implemented
- Asset integration

**Phase 3 - Polish (Week 5-6)**
- Animations and juice
- Sound integration
- UI/UX refinement
- Mobile optimization

**Phase 4 - Testing & Launch (Week 7-8)**
- Playtesting
- Bug fixes
- Performance optimization
- Deployment

---

## Technical Stack

- **Frontend:** React + TypeScript
- **Canvas Rendering:** HTML5 Canvas API
- **State Management:** React hooks (useState, useReducer, useEffect)
- **Asset Loading:** Image preloading, Audio API
- **Build Tool:** Vite (fast, modern)
- **Deployment:** Vercel/Netlify (static hosting)

---

*This PRD serves as the foundation for "Bangladesh Street Crosser" - a culturally rich, accessible, and engaging arcade game celebrating Bangladesh's vibrant street culture.*
# 🎮 Rasta Crosser

**রাস্তা Crosser** - Navigate the busy streets of Bangladesh in this Crossy Road inspired arcade game!

[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## 🚗 About

Rasta Crosser is an infinite crosser game featuring Bangladesh's vibrant street culture. Play as a colorful Rastafarian character hopping through chaotic Dhaka traffic, dodging CNGs, rickshaws, buses, and more local vehicles. The game celebrates Bangladesh's urban transportation with a playful twist on the classic Crossy Road formula.

## 🎯 Features

- **🏙️ Authentic Bangladesh Experience** - Navigate through busy Dhaka streets with locally inspired vehicles
- **🎨 Colorful Art Style** - Bright, family-friendly visuals with cultural flair
- **📱 Cross-Platform** - Works seamlessly on desktop and mobile devices
- **⌨️ Intuitive Controls** - WASD/Arrow keys on desktop, tap/swipe on mobile
- **🏆 Progressive Difficulty** - Linear scaling with configurable parameters
- **🧪 Test-Driven Development** - Comprehensive test suite ensuring quality
- **🔧 Developer-Friendly** - Easy asset drop-in system for future enhancements

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/amitasghar/rasta-crosser.git
cd rasta-crosser

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to play!

## 🎮 How to Play

### Desktop Controls
- **Movement**: WASD or Arrow Keys
- **Pause**: Spacebar
- **Restart**: R key (anytime)

### Mobile Controls
- **Move Forward**: Tap screen
- **Move Left/Right**: Swipe left or right
- **Restart**: Tap during game over

## 🏗️ Architecture

**Hybrid React + Canvas Design:**
- React handles UI components (menus, HUD, overlays)
- HTML5 Canvas manages game world rendering for optimal performance
- TypeScript throughout for type safety
- Vite for fast development and building

## 🚦 Vehicles & Gameplay

Navigate through authentic Bangladesh street traffic:

- **🛺 CNG (Baby Taxi)** - Fast and weaving
- **🚲 Rickshaw** - Slow and steady
- **🚌 Bus** - Large and imposing
- **🚛 Truck** - Biggest and slowest
- **🏍️ Motorcycle** - Very fast and agile
- **🚗 Car** - Medium size and speed
- **🚐 Tempo** - Local transport vehicle

## 📊 Development Status

### ✅ Phase 1 Complete
- Core game mechanics and movement system
- All 7 vehicle types with realistic behavior
- Responsive canvas rendering
- Comprehensive input handling
- Test-driven development setup
- Configuration-based difficulty scaling

### 🔄 Coming Next (Phase 2)
- Main menu and game state screens
- Additional Bangladesh cities (Chittagong, Sylhet, etc.)
- Real asset integration replacing placeholders
- Audio system with sound effects and music

## 🧪 Testing

```bash
# Run all tests
npm run test

# Run tests once
npm run test:run

# Build for production
npm run build
```

## 🏙️ Cities Roadmap

1. **Dhaka** ✅ - Chaotic traffic, all vehicle types
2. **Chittagong** 🔄 - Port theme with more trucks
3. **Sylhet** 🔄 - Tea garden elements
4. **Khulna** 🔄 - Fishing industry theme
5. **Rajshahi** 🔄 - Agricultural elements
6. And more...

## 📁 Project Structure

```
src/
├── components/     # React UI components
├── engine/        # Core game engine logic
├── hooks/         # Custom React hooks
├── test/          # Comprehensive test suite
├── types/         # TypeScript definitions
└── utils/         # Helper utilities

aimemory/          # Project documentation
├── prd-updated.md              # Product requirements
└── technical-specifications.md # Technical details

public/
├── gameConfig.json # Configurable game parameters
└── assets/        # Game assets (ready for drop-in)
```

## 🤝 Contributing

This project uses Test-Driven Development (TDD). Please ensure:
1. Write tests for new features
2. All existing tests pass
3. Follow the established architecture patterns
4. Update documentation as needed

## 📜 License

This project is open source and celebrates Bangladesh's vibrant street culture.

---

**🤖 Built with [Claude Code](https://claude.ai/code)**

*Experience the authentic chaos and charm of Bangladesh's streets in this engaging arcade game!*

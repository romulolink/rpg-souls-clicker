# 🕹️ [Game Title Here]

A retro-style top-down RPG game built using modern web technologies including **PhaserJS 3.70**, **Angular (for modular structure)**, and **modular JavaScript ES6**.

This project is optimized for local development using **Visual Studio Code** + **Live Server**.

---

## 🚀 Technologies Used

- **PhaserJS 3.70** – for game rendering and physics
- **Angular (light usage)** – for modularity and component separation
- **Vanilla JavaScript (ES6 Modules)** – for game logic and controllers
- **HTML5 / CSS3** – for markup and basic styling

---

## 🧩 Folder Structure

```
📁 js/
├── 📁 config/              # Configuration constants
├── 📁 data/                # Static game data
├── 📁 fonts/               # Bitmap fonts and UI text
├── 📁 vendor/              # Third-party libraries (e.g., Phaser)
├── 📄 box_effect.js
├── 📄 camera.js
├── 📄 combat.js
├── 📄 dev.js
├── 📄 game.js              # Game initialization
├── 📄 input-controller.js
├── 📄 messages.js
├── 📄 mobs.js
├── 📄 pixel-perfect.js
├── 📄 quest-controller.js
├── 📄 save-load.js
├── 📄 sound.js
├── 📄 stats-controller.js
├── 📄 ui-controller.js
├── 📄 update-display.js
├── 📄 upgrades.js
├── 📄 world.js
├── 📄 world_1.js
├── 📄 world_2.js
```

Other relevant folders:
- 📁 **views/** – HTML views and templates
- 📁 **experimentos/** – Boilerplate code, prototypes, or experimental features

---

## 🛠️ Getting Started (Local Development)

1. **Install Visual Studio Code**  
   [https://code.visualstudio.com/](https://code.visualstudio.com/)

2. **Install Live Server extension**  
   - Go to Extensions (Ctrl+Shift+X)
   - Search for `Live Server` by Ritwick Dey
   - Click **Install**

3. **Run the game**
   - Open the project folder in VS Code
   - Right-click on `index.html`
   - Click **"Open with Live Server"**
   - The game will open in your browser

---

## 📖 Notes for Developers

- JavaScript is organized in ES modules under `js/`.
- PhaserJS is loaded via the `vendor/` folder or CDN in `index.html`.
- Angular is used to organize modular UI logic in the `views/` folder.
- Game logic is split by system (combat, UI, stats, input, etc).
- Save/load system is included (`save-load.js`), and multiple maps are handled through `world_1.js`, `world_2.js`, etc.

---

## 📝 License

This project is licensed under the MIT License.

---

## 🙌 Contributions

Feel free to fork, open issues, or submit pull requests. All contributions are welcome to improve the structure, performance, or gameplay.
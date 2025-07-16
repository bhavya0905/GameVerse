# 🎮 GameVerse

**GameVerse** is a dynamic web-based gaming platform featuring a rich collection of single-player, multiplayer, and trending games—designed with an interactive 3D-inspired UI and smooth transitions to give users a captivating experience.

---

## 🚀 Features

- 🎯 Explore a wide range of casual games: puzzle, logic, action, and more
- 👤 User authentication and session management using MySQL
- 🧠 Single-player & multiplayer game modes
- 🕹️ Real-time multiplayer support using Socket.IO
- 🏆 Leaderboard system with score tracking
- 🎨 Fully interactive UI with animated transitions (Framer Motion)
- 📱 Responsive design
- 📊 MySQL-powered backend for user and game data persistence

---

## 📚 Table of Contents

- [🚀 Features](#-features)
- [🧩 Games Included](#-games-included)
- [🛠️ Tech Stack](#-tech-stack)
- [🎯 About](#-about)
- [🎮 Game Controls (General)](#-game-controls-general)
- [🤝 Contributing](#-contributing)

---

## 🧩 Games Included

- Maze Runner
- Color Match
- Number Puzzle
- 2048 Merge
- Sudoku Master
- Brick Breaker
- Snake Classic
- Ball Bounce
- Memory Flip
- Tower Blocks
- And more...

---

## 🛠️ Tech Stack

**Frontend:**
- React.js
- Framer Motion
- CSS / JS animations
- Axios

**Backend:**
- Node.js
- Express.js
- Socket.IO (for multiplayer)
- MySQL (user & leaderboard storage)
- dotenv for config management

---

🚀 Installation & Setup Instructions

Follow these steps to run the GameVerse project locally on your system.

✅ Step 1: Clone the Repository

git clone https://github.com/your-username/GameVerse.git
cd GameVerse

✅ Step 2: Set Up the Backend

cd backend
npm install

Create a .env file inside the backend folder and add the following:

PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root123
DB_NAME=game_platform

Start the backend server:

node server.js

✅ Step 3: Set Up the Frontend

In a new terminal:

cd frontend
npm install

Create a .env file inside the frontend folder and add:

VITE_SOCKET_URL=http://localhost:3000

Start the frontend server:

npm run dev

🌐 Access the App
Open your browser and go to:

http://localhost:5173

---

## 🎮 Game Controls (General)

Most games in **GameVerse** are designed with simple, intuitive controls so you can jump in and start playing instantly. Here's a general guide to controls used across different games:

- ⬅️➡️⬆️⬇️ **Arrow Keys** – Used for movement (in maze, snake, number puzzles, etc.)
- 🖱️ **Mouse Click** – Used for flipping cards, selecting tiles, or aiming (in memory games, Sudoku, and Brick Breaker)
- 🅰️ **A / D Keys** – Used for horizontal movement in some games (like Tower Blocks or Ball Bounce)
- 🕹️ **Spacebar** – To launch or start a game (e.g., Brick Breaker)
- 🔄 **R Key** – Restart the game (available in most games)
- 🎚️ **Difficulty Selector** – Use dropdowns/buttons in the UI to change difficulty (Easy, Medium, Hard)
- ⏱️ **Timer-Based Challenges** – Keep an eye on the timer for games like Sudoku or Maze Runner
- 🧠 **Think Fast** – Some games track your time, moves, or score for leaderboard rankings

> ⚠️ Game-specific controls are also shown on each game's page before you start playing.

---

## 🎯 About

**GameVerse** is a full-stack gaming platform built with React and Node.js. It offers users a rich set of browser-based games, including both casual and strategic genres. Whether you want to play solo, challenge a friend, or compete on leaderboards, GameVerse has something for everyone.

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a pull request.

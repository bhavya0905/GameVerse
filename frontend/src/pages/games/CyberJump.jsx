// src/games/CyberJump.jsx
import { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 280;
const GAME_HEIGHT = 420;
const PLAYER_SIZE = 14;
const PLATFORM_WIDTH = 28;
const PLATFORM_HEIGHT = 6;
const OBSTACLE_SIZE = 14;
const POWERUP_SIZE = 10;

const difficultySettings = {
  easy: { platformGap: 80, platformSpeed: 0.4, gravity: 0.4, multiplier: 1 },
  medium: { platformGap: 100, platformSpeed: 0.6, gravity: 0.5, multiplier: 2 },
  hard: { platformGap: 130, platformSpeed: 1.0, gravity: 0.6, multiplier: 3 },
};

const playBeep = (freq = 500, duration = 100) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
};

export default function CyberJump() {
  const canvasRef = useRef(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [newHighScore, setNewHighScore] = useState(false);

  const player = useRef({ x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - PLAYER_SIZE, vy: 0 });
  const platforms = useRef([]);
  const obstacles = useRef([]);
  const powerups = useRef([]);
  const matrixChars = useRef([]);
  const offsetY = useRef(0);

  const initGameObjects = () => {
    const { platformGap } = difficultySettings[difficulty];
    platforms.current = [];
    obstacles.current = [];
    powerups.current = [];
    matrixChars.current = [];

    for (let y = GAME_HEIGHT; y > -GAME_HEIGHT * 2; y -= platformGap) {
      platforms.current.push({ x: Math.random() * (GAME_WIDTH - PLATFORM_WIDTH), y, dir: Math.random() < 0.5 ? -1 : 1 });
      if (Math.random() < 0.25) obstacles.current.push({ x: Math.random() * (GAME_WIDTH - OBSTACLE_SIZE), y: y - 40 });
      if (Math.random() < 0.15) powerups.current.push({ x: Math.random() * (GAME_WIDTH - POWERUP_SIZE), y: y - 30 });
    }

    for (let i = 0; i < 50; i++) {
      matrixChars.current.push({
        x: Math.floor(Math.random() * GAME_WIDTH),
        y: Math.random() * GAME_HEIGHT,
        speed: Math.random() * 2 + 1,
        char: String.fromCharCode(0x30A0 + Math.random() * 96),
      });
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem(`cyberjump-highscore-${difficulty}`);
    if (saved) setHighScore(Number(saved));
  }, [difficulty]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let keys = {};
    let animationId;

    const update = () => {
      const settings = difficultySettings[difficulty];
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.font = '16px monospace';
      matrixChars.current.forEach((char) => {
        ctx.fillStyle = '#0f0';
        ctx.fillText(char.char, char.x, char.y);
        char.y += char.speed;
        if (char.y > GAME_HEIGHT) {
          char.y = 0;
          char.char = String.fromCharCode(0x30A0 + Math.random() * 96);
        }
      });

      player.current.vy += settings.gravity;
      player.current.y += player.current.vy;

      if (player.current.vy > 0) {
        platforms.current.forEach((plat) => {
          if (
            player.current.x + PLAYER_SIZE > plat.x &&
            player.current.x < plat.x + PLATFORM_WIDTH &&
            player.current.y + PLAYER_SIZE > plat.y &&
            player.current.y + PLAYER_SIZE < plat.y + PLATFORM_HEIGHT
          ) {
            player.current.vy = -10;
            playBeep(800);
          }
        });
      }

      if (player.current.y < GAME_HEIGHT / 2) {
        offsetY.current += GAME_HEIGHT / 2 - player.current.y;
        player.current.y = GAME_HEIGHT / 2;
        setScore((s) => s + 1 * settings.multiplier);
      }

      ctx.fillStyle = '#0f0';
      platforms.current.forEach((plat) => {
        plat.x += plat.dir * settings.platformSpeed;
        if (plat.x <= 0 || plat.x + PLATFORM_WIDTH >= GAME_WIDTH) plat.dir *= -1;
        ctx.fillRect(plat.x, plat.y - offsetY.current, PLATFORM_WIDTH, PLATFORM_HEIGHT);
      });

      ctx.fillStyle = '#f00';
      obstacles.current.forEach((obs) => {
        obs.y += 1;
        ctx.fillRect(obs.x, obs.y - offsetY.current, OBSTACLE_SIZE, OBSTACLE_SIZE);
        if (
          player.current.x + PLAYER_SIZE > obs.x &&
          player.current.x < obs.x + OBSTACLE_SIZE &&
          player.current.y + PLAYER_SIZE > obs.y &&
          player.current.y < obs.y + OBSTACLE_SIZE
        ) {
          playBeep(300, 300);
          endGame();
        }
      });

      ctx.fillStyle = '#0ff';
      powerups.current.forEach((pwr, i) => {
        ctx.beginPath();
        ctx.arc(pwr.x + POWERUP_SIZE / 2, pwr.y - offsetY.current + POWERUP_SIZE / 2, POWERUP_SIZE / 2, 0, Math.PI * 2);
        ctx.fill();
        if (
          player.current.x + PLAYER_SIZE > pwr.x &&
          player.current.x < pwr.x + POWERUP_SIZE &&
          player.current.y + PLAYER_SIZE > pwr.y &&
          player.current.y < pwr.y + POWERUP_SIZE
        ) {
          setScore((s) => s + 10 * settings.multiplier);
          powerups.current.splice(i, 1);
          playBeep(1000, 100);
        }
      });

      ctx.fillStyle = '#fff';
      ctx.shadowColor = '#0f0';
      ctx.shadowBlur = 8;
      ctx.fillRect(player.current.x, player.current.y - offsetY.current, PLAYER_SIZE, PLAYER_SIZE);
      ctx.shadowBlur = 0;

      if (keys['ArrowLeft']) player.current.x -= 4;
      if (keys['ArrowRight']) player.current.x += 4;
      if (player.current.x < 0) player.current.x = 0;
      if (player.current.x + PLAYER_SIZE > GAME_WIDTH)
        player.current.x = GAME_WIDTH - PLAYER_SIZE;

      if (player.current.y - offsetY.current > GAME_HEIGHT) {
        playBeep(250, 300);
        endGame();
        return;
      }

      animationId = requestAnimationFrame(update);
    };

    const endGame = () => {
      setGameOver(true);
      const prevHigh = parseInt(localStorage.getItem(`cyberjump-highscore-${difficulty}`) || '0');
      if (score > prevHigh) {
        localStorage.setItem(`cyberjump-highscore-${difficulty}`, score);
        setHighScore(score);
        setNewHighScore(true);
      }
    };

    const handleKeyDown = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      keys[e.key] = true;
    };

    const handleKeyUp = (e) => {
      if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)) {
        e.preventDefault();
      }
      keys[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown, { passive: false });
    window.addEventListener('keyup', handleKeyUp, { passive: false });
    animationId = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, difficulty, gameOver]);

  const handleStart = () => {
    offsetY.current = 0;
    player.current = { x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, y: GAME_HEIGHT - PLAYER_SIZE, vy: 0 };
    setScore(0);
    setNewHighScore(false);
    setGameOver(false);
    initGameObjects();
    setGameStarted(true);
  };

  const handleRestart = () => {
    setGameStarted(false);
    setTimeout(() => handleStart(), 100);
  };

  return (
    <div style={{ textAlign: 'center', backgroundColor: '#000', color: '#0f0', fontFamily: 'monospace', minHeight: '100vh', paddingTop: 20, overflow: 'hidden' }}>
      <h2 className="glitch-text">⚡ Cyber Jump</h2>
      <div style={{ marginBottom: 16 }}>
        🎚️ Difficulty:
        <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
          style={{ marginLeft: 8, background: '#000', color: '#0f0', border: '1px solid #0f0', borderRadius: 4, padding: '4px 8px' }}>
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟠 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>
      </div>
      {!gameStarted && !gameOver && <button onClick={handleStart} style={buttonStyle}>🎮 Start Game</button>}
      {gameOver && (
        <div>
          <h3 style={{ color: '#f00' }}>💀 Game Over!</h3>
          <p>Score: {score}</p>
          <p>High Score: {highScore}</p>
          {newHighScore && <p style={{ color: '#0ff' }}>🎉 New High Score!</p>}
          <button onClick={handleRestart} style={buttonStyle}>🔁 Play Again</button>
        </div>
      )}
      <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} style={{ margin: '20px auto', display: 'block', border: '2px solid #0f0', background: '#000', boxShadow: '0 0 12px #0f0', borderRadius: '10px' }} />
      <div style={{ fontSize: 14, marginTop: 6 }}>🎯 Score: {score} | 🏆 High Score: {highScore}</div>
      <style>{`
        .glitch-text {
          font-size: 26px;
          text-shadow: 2px 0 red, -2px 0 blue;
          animation: glitch 1s infinite;
        }
        @keyframes glitch {
          0% { text-shadow: 2px 0 red, -2px 0 blue; }
          20% { text-shadow: -2px 0 red, 2px 0 blue; }
          40% { text-shadow: 2px 0 red, -2px 0 blue; }
          60% { text-shadow: -2px 0 red, 2px 0 blue; }
          80% { text-shadow: 2px 0 red, -2px 0 blue; }
          100% { text-shadow: 0 0 5px #0f0; }
        }
      `}</style>
    </div>
  );
}

const buttonStyle = {
  background: '#0f0',
  color: '#000',
  padding: '8px 20px',
  borderRadius: '5px',
  fontWeight: 'bold',
  border: 'none',
  cursor: 'pointer',
  marginTop: 10,
};

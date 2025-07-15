import { useRef, useEffect, useState } from 'react';

export default function AlienHunt() {
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [restart, setRestart] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const player = { x: 135, y: 270, width: 30, height: 15 };
  const bullets = useRef([]);
  const aliens = useRef([]);
  const keys = useRef({});
  const missed = useRef(0);
  const alienFrame = useRef(0);
  const maxMisses = 3;
  const alienEmojiFrames = ['👾', '👽'];

  const playSound = (freq = 400, duration = 0.1) => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'square';
    oscillator.frequency.setValueAtTime(freq, audioCtx.currentTime);
    oscillator.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let lastShotTime = 0;

    const resetGame = () => {
      bullets.current = [];
      aliens.current = [];
      keys.current = {};
      player.x = 135;
      missed.current = 0;
      setScore(0);
      setGameOver(false);
    };

    const shootBullet = () => {
      if (Date.now() - lastShotTime > 300) {
        bullets.current.push({ x: player.x + 12, y: player.y, radius: 4 });
        lastShotTime = Date.now();
        playSound(600);
      }
    };

    const drawPlayer = () => {
      ctx.fillStyle = '#00f7ff';
      ctx.fillRect(player.x, player.y, player.width, player.height);
    };

    const drawAliens = () => {
      ctx.font = '20px serif';
      aliens.current.forEach((alien) => {
        ctx.fillText(alienEmojiFrames[alienFrame.current], alien.x + 5, alien.y + 25);
      });
    };

    const drawBullets = () => {
      ctx.fillStyle = '#ffffff';
      bullets.current.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const detectCollisions = () => {
      const newBullets = [];

      bullets.current.forEach((b) => {
        let hit = false;
        for (let i = 0; i < aliens.current.length; i++) {
          const a = aliens.current[i];
          const alienWidth = 24;
          const alienHeight = 24;

          if (
            b.x > a.x &&
            b.x < a.x + alienWidth &&
            b.y > a.y &&
            b.y < a.y + alienHeight
          ) {
            playSound(100, 0.2);
            setScore((prev) => prev + 1);
            aliens.current.splice(i, 1);
            hit = true;
            break;
          }
        }
        if (!hit) newBullets.push(b);
      });

      bullets.current = newBullets;
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < 30; i++) {
        ctx.fillStyle = 'white';
        ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 1, 1);
      }

      if (!started) {
        ctx.fillStyle = '#00f7ff';
        ctx.font = '16px monospace';
        ctx.fillText('▶ Select difficulty & start the game!', 30, 150);
        return;
      }

      if (keys.current['ArrowLeft'] && player.x > 0) player.x -= 4;
      if (keys.current['ArrowRight'] && player.x + player.width < canvas.width) player.x += 4;

      bullets.current.forEach((b) => (b.y -= 6));
      bullets.current = bullets.current.filter((b) => b.y > 0);

      aliens.current.forEach((a) => (a.y += 2));
      aliens.current = aliens.current.filter((a) => {
        if (a.y > canvas.height) {
          missed.current++;
          if (missed.current >= maxMisses) {
            playSound(80, 0.4);
            setGameOver(true);
            cancelAnimationFrame(animationId);
          }
          return false;
        }
        return true;
      });

      detectCollisions();
      drawPlayer();
      drawAliens();
      drawBullets();

      alienFrame.current = Date.now() % 1000 < 500 ? 0 : 1;

      if (!gameOver) animationId = requestAnimationFrame(update);
    };

    const handleKeyDown = (e) => {
      keys.current[e.key] = true;
      if (e.key === ' ') shootBullet();
    };

    const handleKeyUp = (e) => {
      keys.current[e.key] = false;
    };

    const disableScroll = (e) => {
      const blockedKeys = [' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (blockedKeys.includes(e.key)) e.preventDefault();
    };

    resetGame();

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('keydown', disableScroll);

    let spawnInterval;

    if (started) {
      const spawnRate = {
        easy: 1500,
        medium: 1000,
        hard: 600,
      };

      spawnInterval = setInterval(() => {
        aliens.current.push({ x: Math.random() * 260, y: 0 });
      }, spawnRate[difficulty]);

      update();
    } else {
      update();
    }

    return () => {
      cancelAnimationFrame(animationId);
      clearInterval(spawnInterval);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('keydown', disableScroll);
    };
  }, [started, restart, difficulty]);

  return (
    <div
      style={{
        background: '#000',
        minHeight: '100vh',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '2rem',
        fontFamily: 'monospace',
      }}
    >
      <h1 style={{ color: '#00f7ff' }}>👾 Alien Hunt</h1>

      {/* Score + Miss */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '1rem' }}>
        <div style={{ color: '#00f7ff', fontSize: '1.1rem' }}>⭐ Score: {score}</div>
        <div style={{ color: '#f87171', fontSize: '1.1rem' }}>💔 Missed: {missed.current}/{maxMisses}</div>
      </div>

      {/* Controls */}
      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label>🎚️ Difficulty: </label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            backgroundColor: '#111',
            color: '#fff',
            border: '1px solid #00f7ff',
            marginRight: '1rem',
          }}
        >
          <option value="easy">🟢 Easy</option>
          <option value="medium">🟡 Medium</option>
          <option value="hard">🔴 Hard</option>
        </select>

        {!started && (
          <button
            onClick={() => setStarted(true)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem',
            }}
          >
            ▶ Start Game
          </button>
        )}

        {started && !gameOver && (
          <button
            onClick={() => setRestart((r) => !r)}
            style={{
              padding: '10px 20px',
              backgroundColor: '#444',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '1rem',
              cursor: 'pointer',
              marginRight: '1rem',
            }}
          >
            🔄 Reset Game
          </button>
        )}

        <button
          onClick={() => setShowHelp(true)}
          style={{
            padding: '10px 15px',
            backgroundColor: '#444',
            color: 'white',
            border: '1px solid #777',
            borderRadius: '5px',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          ℹ️ How to Play
        </button>
      </div>

      {/* Help / Instructions */}
      {showHelp && (
        <div
          style={{
            backgroundColor: '#111',
            border: '1px solid #00f7ff',
            borderRadius: '10px',
            padding: '1rem',
            maxWidth: '90%',
            color: '#fff',
            textAlign: 'left',
            marginBottom: '1rem',
          }}
        >
          <h3 style={{ color: '#00f7ff', marginBottom: '0.5rem' }}>🎮 How to Play</h3>
          <ul style={{ lineHeight: '1.6' }}>
            <li>⬅️ Arrow Left: Move player left</li>
            <li>➡️ Arrow Right: Move player right</li>
            <li>␣ Spacebar: Shoot bullet</li>
            <li>👾 Destroy aliens before they reach bottom</li>
            <li>❌ Game over after 3 missed</li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            style={{
              marginTop: '1rem',
              padding: '6px 12px',
              backgroundColor: '#dc2626',
              border: 'none',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            ✖ Close
          </button>
        </div>
      )}

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={300}
        height={300}
        style={{
          border: '2px solid #00f7ff',
          borderRadius: '8px',
          backgroundColor: '#000',
          boxShadow: '0 0 20px #00f7ff',
        }}
      />

      {/* Game Over */}
      {gameOver && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <h2 style={{ color: 'red' }}>💥 Game Over</h2>
          <p>Your Score: {score}</p>
          <button
            onClick={() => {
              setRestart((r) => !r);
              setStarted(false);
            }}
            style={{
              padding: '8px 18px',
              backgroundColor: '#00f7ff',
              color: '#000',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
          >
            🔁 Play Again
          </button>
        </div>
      )}
    </div>
  );
}

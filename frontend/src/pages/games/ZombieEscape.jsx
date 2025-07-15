import React, { useRef, useEffect, useState } from 'react';

const ZombieEscape = () => {
  const canvasRef = useRef(null);
  const playerRef = useRef({ x: 150, y: 150 });
  const zombiesRef = useRef([]);
  const bulletsRef = useRef([]);
  const lastDirection = useRef({ x: 0, y: -1 });
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);

  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscillatorRef = useRef(null);

  const canvasSize = 300;
  const playerSpeed = 5;
  const zombieSpeed = 1;
  const bulletSpeed = 6;

  // 🎵 Background hum sound
  const startSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(110, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    audioCtxRef.current = ctx;
    oscillatorRef.current = osc;
  };

  const stopSound = () => {
    try {
      oscillatorRef.current?.stop();
      oscillatorRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {}
  };

  // 🔊 Game over sound
  const playGameOverSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(70, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.4);
  };

  const spawnZombie = () => {
    const edge = Math.floor(Math.random() * 4);
    let x = 0, y = 0;
    if (edge === 0) {
      x = Math.random() * canvasSize;
      y = 0;
    } else if (edge === 1) {
      x = Math.random() * canvasSize;
      y = canvasSize;
    } else if (edge === 2) {
      x = 0;
      y = Math.random() * canvasSize;
    } else {
      x = canvasSize;
      y = Math.random() * canvasSize;
    }
    zombiesRef.current.push({ x, y });
  };

  const gameLoop = () => {
    const player = playerRef.current;
    let zombies = zombiesRef.current;
    let bullets = bulletsRef.current;

    zombies = zombies.map((z) => {
      const dx = player.x - z.x;
      const dy = player.y - z.y;
      const dist = Math.max(1, Math.hypot(dx, dy));
      return {
        x: z.x + (dx / dist) * zombieSpeed,
        y: z.y + (dy / dist) * zombieSpeed,
      };
    });

    bullets = bullets
      .map((b) => ({
        ...b,
        x: b.x + b.dir.x * bulletSpeed,
        y: b.y + b.dir.y * bulletSpeed,
      }))
      .filter((b) => b.x >= 0 && b.x <= canvasSize && b.y >= 0 && b.y <= canvasSize);

    const newZombies = [];
    const newBullets = [];

    for (let z of zombies) {
      let hit = false;
      for (let b of bullets) {
        if (Math.hypot(z.x - b.x, z.y - b.y) < 15) {
          hit = true;
          break;
        }
      }
      if (!hit) newZombies.push(z);
    }

    for (let b of bullets) {
      let hitAny = false;
      for (let z of zombies) {
        if (Math.hypot(z.x - b.x, z.y - b.y) < 15) {
          hitAny = true;
          break;
        }
      }
      if (!hitAny) newBullets.push(b);
    }

    zombiesRef.current = newZombies;
    bulletsRef.current = newBullets;

    const playerHit = newZombies.some((z) => Math.hypot(z.x - player.x, z.y - player.y) < 18);
    if (playerHit) {
      setGameOver(true);
      clearInterval(intervalRef.current);
      stopSound();
      playGameOverSound();
    } else {
      setScore((prev) => prev + 1);
    }
  };

  const startGame = () => {
    playerRef.current = { x: canvasSize / 2, y: canvasSize / 2 };
    zombiesRef.current = [];
    bulletsRef.current = [];
    setScore(0);
    setGameOver(false);
    setStarted(true);
    startSound();
    spawnZombie();

    intervalRef.current = setInterval(() => {
      gameLoop();
      if (Math.random() < 0.05) spawnZombie();
    }, 50);
  };

  const resetGame = () => {
    clearInterval(intervalRef.current);
    stopSound();
    setStarted(false);
    setGameOver(false);
    setScore(0);
    zombiesRef.current = [];
    bulletsRef.current = [];
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!started || gameOver) return;
      const player = playerRef.current;
      const pos = { ...player };
      let moved = false;

      if (e.key === 'ArrowUp' || e.key === 'w') {
        pos.y -= playerSpeed;
        lastDirection.current = { x: 0, y: -1 };
        moved = true;
      }
      if (e.key === 'ArrowDown' || e.key === 's') {
        pos.y += playerSpeed;
        lastDirection.current = { x: 0, y: 1 };
        moved = true;
      }
      if (e.key === 'ArrowLeft' || e.key === 'a') {
        pos.x -= playerSpeed;
        lastDirection.current = { x: -1, y: 0 };
        moved = true;
      }
      if (e.key === 'ArrowRight' || e.key === 'd') {
        pos.x += playerSpeed;
        lastDirection.current = { x: 1, y: 0 };
        moved = true;
      }

      if (moved) {
        e.preventDefault();
        playerRef.current = pos;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        bulletsRef.current.push({
          x: player.x,
          y: player.y,
          dir: lastDirection.current,
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvasSize, canvasSize);
      const player = playerRef.current;

      // Player as emoji
      ctx.font = '22px serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🧍‍♂️', player.x, player.y);

      // Zombies as emoji
      zombiesRef.current.forEach((z) => {
        ctx.fillText('🧟', z.x, z.y);
      });

      // Bullets
      ctx.fillStyle = '#ffffff';
      bulletsRef.current.forEach((b) => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();
  }, []);

  const styles = {
    container: {
      textAlign: 'center',
      backgroundColor: '#000',
      color: '#0ff',
      fontFamily: 'monospace',
      minHeight: '100vh',
      padding: '20px',
    },
    canvas: {
      border: '4px solid #0ff',
      backgroundColor: '#111',
      boxShadow: '0 0 20px #0ff',
      marginTop: '20px',
    },
    button: {
      margin: '6px',
      padding: '10px 16px',
      backgroundColor: '#00ffff',
      color: '#000',
      border: 'none',
      borderRadius: '6px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    instructionsBox: {
      background: '#111',
      color: '#0ff',
      padding: '16px',
      border: '2px solid #0ff',
      marginTop: '20px',
      borderRadius: '8px',
      maxWidth: '400px',
      margin: 'auto',
    },
  };

  return (
    <div style={styles.container}>
      <h1>🧟 Zombie Escape</h1>
      <div>
        <button onClick={startGame} style={styles.button}>▶️ Start</button>
        <button onClick={resetGame} style={styles.button}>🔄 Reset</button>
        <button onClick={() => setShowInstructions((prev) => !prev)} style={styles.button}>❓ How to Play</button>
      </div>
      {started && !gameOver && <h3>Score: {score}</h3>}
      {gameOver && <h2 style={{ color: 'red' }}>💀 Game Over!</h2>}
      <canvas ref={canvasRef} width={canvasSize} height={canvasSize} style={styles.canvas}></canvas>
      {showInstructions && (
        <div style={styles.instructionsBox}>
          <h2>How to Play</h2>
          <p>🕹️ Move with Arrow Keys or W/A/S/D</p>
          <p>🔫 Shoot with Spacebar</p>
          <p>💥 Kill zombies before they reach you!</p>
        </div>
      )}
    </div>
  );
};

export default ZombieEscape;

import React, { useRef, useEffect, useState } from 'react';

const SpeedRunner = () => {
  const canvasRef = useRef(null);
  const canvasWidth = 400;
  const canvasHeight = 200;

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const player = useRef({ x: 50, y: 150, width: 40, height: 40, dy: 0, jumping: false });
  const obstacles = useRef([]);
  const gravity = 0.6;
  const jumpForce = -10;
  const speedRef = useRef(2); // Initial slower speed
  const obstacleInterval = useRef(null);
  const scoreInterval = useRef(null);
  const audioCtxRef = useRef(null);
  const bgOscillatorRef = useRef(null);

  const startBackgroundMusic = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    gain.gain.setValueAtTime(0.03, ctx.currentTime);

    osc.connect(gain).connect(ctx.destination);
    osc.start();

    audioCtxRef.current = ctx;
    bgOscillatorRef.current = osc;
  };

  const stopBackgroundMusic = () => {
    try {
      bgOscillatorRef.current?.stop();
      bgOscillatorRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {}
  };

  const playJumpSound = () => {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    gain.gain.setValueAtTime(0.2, ctx.currentTime);

    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.2);
  };

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    speedRef.current = 2;
    player.current = { x: 50, y: 150, width: 40, height: 40, dy: 0, jumping: false };
    obstacles.current = [];
    spawnObstacle();
    obstacleInterval.current = setInterval(spawnObstacle, 1500);
    scoreInterval.current = setInterval(() => {
      setScore((s) => s + 1);
      if (speedRef.current < 8) speedRef.current += 0.05; // Gradually increase speed
    }, 200);
    startBackgroundMusic();
  };

  const endGame = () => {
    setGameOver(true);
    setStarted(false);
    clearInterval(obstacleInterval.current);
    clearInterval(scoreInterval.current);
    stopBackgroundMusic();
  };

  const spawnObstacle = () => {
    const height = 40 + Math.random() * 30;
    obstacles.current.push({
      x: canvasWidth,
      y: canvasHeight - height,
      width: 40,
      height,
    });
  };

  const handleKeyDown = (e) => {
    if ((e.key === ' ' || e.key === 'ArrowUp') && !player.current.jumping && started && !gameOver) {
      player.current.dy = jumpForce;
      player.current.jumping = true;
      playJumpSound();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Background
      ctx.fillStyle = '#111';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Ground
      ctx.fillStyle = '#444';
      ctx.fillRect(0, canvasHeight - 10, canvasWidth, 10);

      // Draw player
      ctx.font = '36px serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText('🧍', player.current.x, player.current.y);

      // Draw obstacles
      ctx.font = '36px serif';
      obstacles.current.forEach((obs) => {
        ctx.fillText('🚧', obs.x, obs.y);
      });

      // Apply gravity
      player.current.dy += gravity;
      player.current.y += player.current.dy;

      // Prevent falling
      if (player.current.y >= 150) {
        player.current.y = 150;
        player.current.dy = 0;
        player.current.jumping = false;
      }

      // Move obstacles
      obstacles.current = obstacles.current
        .map((obs) => ({ ...obs, x: obs.x - speedRef.current }))
        .filter((obs) => obs.x + obs.width > 0);

      // Collision detection
      for (let obs of obstacles.current) {
        if (
          player.current.x < obs.x + obs.width &&
          player.current.x + player.current.width > obs.x &&
          player.current.y < obs.y + obs.height &&
          player.current.y + player.current.height > obs.y
        ) {
          endGame();
        }
      }

      requestAnimationFrame(draw);
    };

    if (started && !gameOver) draw();
  }, [started, gameOver]);

  const styles = {
    container: {
      textAlign: 'center',
      fontFamily: 'monospace',
      background: '#000',
      color: '#0ff',
      padding: 20,
      minHeight: '100vh',
    },
    canvas: {
      background: '#111',
      border: '4px solid #0ff',
      boxShadow: '0 0 20px #0ff',
    },
    button: {
      margin: '10px',
      padding: '10px 20px',
      backgroundColor: '#0ff',
      color: '#000',
      border: 'none',
      borderRadius: '5px',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
  };

  return (
    <div style={styles.container}>
      <h1>⚡ Speed Runner</h1>
      <div>
        {!started && !gameOver && <button onClick={startGame} style={styles.button}>▶️ Start</button>}
        {gameOver && (
          <>
            <button onClick={startGame} style={styles.button}>🔄 Retry</button>
          </>
        )}
      </div>
      {started && !gameOver && <h3>Score: {score}</h3>}
      {gameOver && <h2 style={{ color: 'red' }}>💀 Game Over<br/>Score: {score}</h2>}
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={styles.canvas} />
    </div>
  );
};

export default SpeedRunner;

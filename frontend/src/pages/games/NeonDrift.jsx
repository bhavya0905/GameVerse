// Neon Drift Game - Highway Style Road (No Sounds)
import React, { useRef, useEffect, useState } from 'react';

const NeonDrift = () => {
  const canvasRef = useRef(null);
  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  const canvasWidth = 400;
  const canvasHeight = 300;
  const lanes = [50, 150, 250, 350];
  const player = useRef({ lane: 1, y: 250, width: 40, height: 40 });
  const obstacles = useRef([]);
  const particles = useRef([]);
  const speedRef = useRef(2);
  const obstacleTimer = useRef(null);
  const scoreTimer = useRef(null);

  const carEmoji = '🚘';
  const obstacleEmoji = '🚧';

  const startGame = () => {
    setStarted(true);
    setGameOver(false);
    setScore(0);
    speedRef.current = 2;
    player.current.lane = 1;
    obstacles.current = [];
    particles.current = [];
    obstacleTimer.current = setInterval(spawnObstacle, 1000);
    scoreTimer.current = setInterval(() => {
      setScore((s) => s + 1);
      if (speedRef.current < 7) speedRef.current += 0.05;
    }, 300);
  };

  const resetGame = () => {
    setStarted(false);
    setGameOver(false);
    setScore(0);
    player.current.lane = 1;
    obstacles.current = [];
    particles.current = [];
  };

  const endGame = () => {
    setGameOver(true);
    setStarted(false);
    clearInterval(obstacleTimer.current);
    clearInterval(scoreTimer.current);
  };

  const spawnObstacle = () => {
    const lane = Math.floor(Math.random() * 4);
    obstacles.current.push({ lane, y: -40 });
  };

  const handleKeyDown = (e) => {
    if (!started || gameOver) return;
    if (e.key === 'ArrowLeft' && player.current.lane > 0) {
      player.current.lane--;
    } else if (e.key === 'ArrowRight' && player.current.lane < 3) {
      player.current.lane++;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [started, gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.font = '30px serif';
    ctx.textAlign = 'center';

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Road background (asphalt)
      ctx.fillStyle = '#222';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // White solid boundary lines
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, canvasHeight);
      ctx.moveTo(canvasWidth, 0);
      ctx.lineTo(canvasWidth, canvasHeight);
      ctx.stroke();

      // Dashed lane dividers
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;
      ctx.setLineDash([10, 10]);
      for (let i = 1; i < 4; i++) {
        ctx.beginPath();
        ctx.moveTo(i * 100, 0);
        ctx.lineTo(i * 100, canvasHeight);
        ctx.stroke();
      }
      ctx.setLineDash([]);

      // Particles / Neon Trail
      particles.current.push({ x: lanes[player.current.lane], y: player.current.y + 20, alpha: 1 });
      particles.current = particles.current.map((p) => ({ ...p, alpha: p.alpha - 0.02 })).filter((p) => p.alpha > 0);
      particles.current.forEach((p) => {
        ctx.fillStyle = `rgba(0,255,255,${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw car
      ctx.fillStyle = '#fff';
      ctx.fillText(carEmoji, lanes[player.current.lane], player.current.y);

      // Draw obstacles
      ctx.fillStyle = '#fff';
      obstacles.current.forEach((obs) => {
        ctx.fillText(obstacleEmoji, lanes[obs.lane], obs.y);
        obs.y += speedRef.current;
      });

      // Collision detection
      obstacles.current.forEach((obs) => {
        if (
          obs.lane === player.current.lane &&
          obs.y + 30 > player.current.y &&
          obs.y < player.current.y + 30
        ) {
          endGame();
        }
      });

      obstacles.current = obstacles.current.filter((obs) => obs.y < canvasHeight);

      if (started && !gameOver) requestAnimationFrame(draw);
    };

    if (started && !gameOver) draw();
  }, [started, gameOver]);

  const styles = {
    container: {
      textAlign: 'center',
      backgroundColor: '#111',
      color: '#0ff',
      fontFamily: 'monospace',
      padding: 20,
      minHeight: '100vh',
    },
    canvas: {
      border: '4px solid #0ff',
      background: '#111',
      boxShadow: '0 0 20px #0ff',
      marginTop: 20,
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
    controls: {
      marginBottom: 20,
    },
  };

  return (
    <div style={styles.container}>
      <h1>🚘 Neon Drift</h1>
      <div style={styles.controls}>
        {!started && !gameOver && <button onClick={startGame} style={styles.button}>▶️ Start</button>}
        {gameOver && <button onClick={startGame} style={styles.button}>🔄 Retry</button>}
        <button onClick={resetGame} style={styles.button}>🔁 Reset</button>
      </div>
      {started && !gameOver && <h3>Score: {score}</h3>}
      {gameOver && <h2 style={{ color: 'red' }}>💥 Crash!<br />Score: {score}</h2>}
      <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={styles.canvas} />
    </div>
  );
};

export default NeonDrift;

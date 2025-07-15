// src/games/BallBounce.jsx
import { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GRAVITY = 0.5;
const JUMP_STRENGTH = -20;
const BALL_RADIUS = 15;
const MOVE_STEP = 5;

export default function BallBounce() {
  const canvasRef = useRef(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [restartKey, setRestartKey] = useState(0);

  const ball = useRef({ x: 100, y: 200, dy: 0, onGround: false });
  const platforms = useRef([]);

  useEffect(() => {
    startGame();
  }, [restartKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationId;
    const draw = () => {
      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      ctx.fillStyle = '#87CEFA';
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      platforms.current.forEach(p => p.x -= 2);
      if (platforms.current[0].x + platforms.current[0].width < 0) {
        const last = platforms.current[platforms.current.length - 1];
        platforms.current.shift();
        platforms.current.push({
          x: last.x + 250,
          y: 280 + Math.random() * 60,
          width: 150 + Math.random() * 50,
          height: 20
        });
        setScore(prev => prev + 1);
      }

      ball.current.dy += GRAVITY;
      ball.current.y += ball.current.dy;
      ball.current.onGround = false;

      for (let p of platforms.current) {
        if (
          ball.current.x + BALL_RADIUS > p.x &&
          ball.current.x - BALL_RADIUS < p.x + p.width &&
          ball.current.y + BALL_RADIUS >= p.y &&
          ball.current.y + BALL_RADIUS <= p.y + p.height &&
          ball.current.dy >= 0
        ) {
          ball.current.y = p.y - BALL_RADIUS;
          ball.current.dy = 0;
          ball.current.onGround = true;
        }
      }

      if (ball.current.y > GAME_HEIGHT) {
        setGameOver(true);
        cancelAnimationFrame(animationId);
        return;
      }

      ctx.fillStyle = '#444';
      platforms.current.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });

      ctx.beginPath();
      ctx.arc(ball.current.x, ball.current.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();

      ctx.fillStyle = 'black';
      ctx.font = '16px sans-serif';
      ctx.fillText(`Score: ${score}`, 10, 20);

      animationId = requestAnimationFrame(draw);
    };

    animationId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animationId);
  }, [gameOver, restartKey]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'ArrowLeft') {
        ball.current.x -= MOVE_STEP;
        e.preventDefault();
      }
      if (e.code === 'ArrowRight') {
        ball.current.x += MOVE_STEP;
        e.preventDefault();
      }
      if ((e.code === 'ArrowUp' || e.code === 'Space') && ball.current.onGround) {
        ball.current.dy = JUMP_STRENGTH;
        e.preventDefault();
      }
      if (e.code === 'ArrowDown') {
        ball.current.y += MOVE_STEP;
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const resetPlatforms = () => {
    platforms.current = [
      { x: 0, y: 350, width: 200, height: 20 },
      { x: 300, y: 320, width: 150, height: 20 },
      { x: 600, y: 310, width: 180, height: 20 },
      { x: 900, y: 340, width: 160, height: 20 }
    ];
  };

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    ball.current = { x: 100, y: 200, dy: 0, onGround: false };
    resetPlatforms();
  };

  const handleRestart = () => {
    setRestartKey(prev => prev + 1);
  };

  return (
    <div style={{ textAlign: 'center', background: '#000', minHeight: '100vh', padding: 20 }}>
      <h2 style={{ color: 'white' }}>🌊 Ball Bounce</h2>
      <canvas
        key={restartKey}
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{ border: '3px solid white', marginTop: 20 }}
      />
      {gameOver && (
        <>
          <p style={{ color: 'red', fontSize: 18, marginTop: 20 }}>💥 You Lost! Final Score: {score}</p>
          <button onClick={handleRestart} style={{ padding: '8px 16px', fontSize: 16 }}>Play Again</button>
        </>
      )}
    </div>
  );
}

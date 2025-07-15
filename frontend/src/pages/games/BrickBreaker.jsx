import { useEffect, useRef, useState } from 'react';

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;
const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 10;
const BALL_RADIUS = 8;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 10;

const DIFFICULTY_SETTINGS = {
  Easy: { dx: 2, dy: -2, rows: 3, cols: 6 },
  Medium: { dx: 3, dy: -3, rows: 4, cols: 7 },
  Hard: { dx: 4, dy: -4, rows: 5, cols: 8 },
};

export default function BrickBreaker() {
  const canvasRef = useRef(null);
  const paddleXRef = useRef(GAME_WIDTH / 2 - PADDLE_WIDTH / 2);
  const ballRef = useRef({ x: 250, y: 300, dx: 3, dy: -3 });
  const bricksRef = useRef([]);
  const animationRef = useRef();

  const [difficulty, setDifficulty] = useState('Easy');
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const { dx, dy, rows, cols } = DIFFICULTY_SETTINGS[difficulty];
  const BRICK_WIDTH = (GAME_WIDTH - (cols + 1) * BRICK_GAP) / cols;

  const bounceSound = () => {
    new Audio("data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA//////8=").play();
  };

  const generateBricks = () => {
    const newBricks = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        newBricks.push({
          x: c * (BRICK_WIDTH + BRICK_GAP) + BRICK_GAP,
          y: r * (BRICK_HEIGHT + BRICK_GAP) + 30,
          status: true,
        });
      }
    }
    bricksRef.current = newBricks;
  };

  useEffect(() => {
    generateBricks();
    ballRef.current = { x: 250, y: 300, dx, dy };
    paddleXRef.current = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(false);
  }, [difficulty]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        paddleXRef.current = Math.max(paddleXRef.current - 30, 0);
      } else if (e.key === 'ArrowRight') {
        paddleXRef.current = Math.min(paddleXRef.current + 30, GAME_WIDTH - PADDLE_WIDTH);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const draw = () => {
      if (!gameStarted || gameOver || gameWon) return;

      ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Paddle
      ctx.fillStyle = '#00ffd0';
      ctx.fillRect(paddleXRef.current, GAME_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      const ball = ballRef.current;
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = 'orange';
      ctx.fill();
      ctx.closePath();

      // Bricks
      bricksRef.current.forEach((brick) => {
        if (brick.status) {
          ctx.fillStyle = '#f05454';
          ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        }
      });

      // Move Ball
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Wall Collision
      if (ball.x + BALL_RADIUS > GAME_WIDTH || ball.x - BALL_RADIUS < 0) {
        ball.dx *= -1;
        bounceSound();
      }
      if (ball.y - BALL_RADIUS < 0) {
        ball.dy *= -1;
        bounceSound();
      }

      // Paddle collision
      if (
        ball.y + BALL_RADIUS >= GAME_HEIGHT - PADDLE_HEIGHT - 10 &&
        ball.x > paddleXRef.current &&
        ball.x < paddleXRef.current + PADDLE_WIDTH
      ) {
        ball.dy *= -1;
        ball.dx *= 1.05;
        ball.dy *= 1.05;
        bounceSound();
      }

      // Bottom - Game Over
      if (ball.y + BALL_RADIUS > GAME_HEIGHT) {
        setGameOver(true);
        bounceSound();
        return;
      }

      // Brick collision
      let hit = false;
      bricksRef.current = bricksRef.current.map((brick) => {
        if (
          brick.status &&
          ball.x > brick.x &&
          ball.x < brick.x + BRICK_WIDTH &&
          ball.y > brick.y &&
          ball.y < brick.y + BRICK_HEIGHT
        ) {
          ball.dy *= -1;
          hit = true;
          return { ...brick, status: false };
        }
        return brick;
      });

      if (hit) {
        setScore((s) => s + 10);
        bounceSound();
      }

      if (bricksRef.current.every((b) => !b.status)) {
        setGameWon(true);
        bounceSound();
        return;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    // ✅ Draw preview even before game starts
    const ball = ballRef.current;
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Paddle
    ctx.fillStyle = '#00ffd0';
    ctx.fillRect(paddleXRef.current, GAME_HEIGHT - PADDLE_HEIGHT - 10, PADDLE_WIDTH, PADDLE_HEIGHT);

    // Ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'orange';
    ctx.fill();
    ctx.closePath();

    // Bricks
    bricksRef.current.forEach((brick) => {
      if (brick.status) {
        ctx.fillStyle = '#f05454';
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    });

    if (gameStarted && !gameOver && !gameWon) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      cancelAnimationFrame(animationRef.current);
    };
  }, [gameStarted, gameOver, gameWon]);

  const resetGame = () => {
    generateBricks();
    ballRef.current = { x: 250, y: 300, dx, dy };
    paddleXRef.current = GAME_WIDTH / 2 - PADDLE_WIDTH / 2;
    setScore(0);
    setGameOver(false);
    setGameWon(false);

    // Clear canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    setGameStarted(false);
  };

  const increaseSpeed = () => {
    const b = ballRef.current;
    b.dx *= 1.3;
    b.dy *= 1.3;
  };

  const decreaseSpeed = () => {
    const b = ballRef.current;
    b.dx *= 0.7;
    b.dy *= 0.7;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧱 Brick Breaker</h2>
      <p style={styles.score}>Score: {score}</p>

      {!gameStarted && (
        <div style={styles.menu}>
          <label style={styles.label}>Select Difficulty:</label>
          <select
            style={styles.select}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <button onClick={() => setGameStarted(true)} style={styles.startButton}>
            🚀 Start Game
          </button>
        </div>
      )}

      <canvas ref={canvasRef} width={GAME_WIDTH} height={GAME_HEIGHT} style={styles.canvas} />

      {gameStarted && (
        <div style={styles.buttonRow}>
          <button onClick={increaseSpeed} style={styles.controlButton}>⚡ Increase Speed</button>
          <button onClick={decreaseSpeed} style={styles.controlButton}>🐢 Decrease Speed</button>
          <button onClick={resetGame} style={styles.controlButton}>🔁 Reset Game</button>
        </div>
      )}

      {(gameOver || gameWon) && (
        <div>
          <h3 style={{ color: gameWon ? '#00ff88' : 'red' }}>
            {gameWon ? '🎉 You Win!' : '💀 Game Over'}
          </h3>
          <button style={styles.resetButton} onClick={resetGame}>
            ▶️ Play Again
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '20px',
    background: 'radial-gradient(circle, #1b2735, #090a0f)',
    color: '#fff',
    minHeight: '100vh',
  },
  heading: {
    fontSize: '32px',
    marginBottom: '10px',
    color: '#00ffd0',
  },
  score: {
    marginBottom: '10px',
    fontSize: '18px',
  },
  menu: {
    marginBottom: '20px',
  },
  label: {
    fontSize: '16px',
    marginRight: '10px',
  },
  select: {
    padding: '8px 12px',
    fontSize: '16px',
    marginRight: '12px',
    borderRadius: '6px',
    border: '1px solid #aaa',
    backgroundColor: '#000',
    color: '#00ffd0',
  },
  startButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#00ffd0',
    border: 'none',
    borderRadius: '6px',
    color: '#111',
    cursor: 'pointer',
  },
  canvas: {
    border: '3px solid #00ffd0',
    backgroundColor: '#000',
    borderRadius: '8px',
    boxShadow: '0 0 15px rgba(0,255,208,0.6)',
  },
  resetButton: {
    marginTop: '15px',
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#00ffd0',
    border: 'none',
    borderRadius: '6px',
    color: '#111',
    cursor: 'pointer',
  },
  buttonRow: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'center',
    gap: '15px',
    flexWrap: 'wrap',
  },
  controlButton: {
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#ffaa00',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    cursor: 'pointer',
  },
};

import { useEffect, useRef, useState } from 'react';

const gridSize = 20;
const cellSize = 16;
const initialSnake = [{ x: 10, y: 10 }];
const directions = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
};

const speedLevels = {
  Easy: 200,
  Medium: 120,
  Hard: 80,
};

function playSound(freq = 400, duration = 0.2) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'sine';
  oscillator.frequency.value = freq;
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  gain.gain.setValueAtTime(0.1, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.stop(ctx.currentTime + duration);
}

function generateFood(snakeBody) {
  let newFood;
  do {
    newFood = {
      x: Math.floor(Math.random() * gridSize),
      y: Math.floor(Math.random() * gridSize),
    };
  } while (snakeBody.some(seg => seg.x === newFood.x && seg.y === newFood.y));
  return newFood;
}

export default function SnakeClassic() {
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState(directions.ArrowRight);
  const [food, setFood] = useState(generateFood(initialSnake));
  const [isRunning, setIsRunning] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('snakeHighScore')) || 0);
  const [speed, setSpeed] = useState('Easy');
  const [wiggleFrame, setWiggleFrame] = useState(0);

  const moveRef = useRef();
  moveRef.current = direction;

  useEffect(() => {
    const wiggleInterval = setInterval(() => {
      setWiggleFrame(f => (f + 1) % 2);
    }, 200); // Adjust for speed

    return () => clearInterval(wiggleInterval);
  }, []);

  const handleKeyDown = (e) => {
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      const newDir = directions[e.key];
      if (newDir && (newDir.x !== -direction.x || newDir.y !== -direction.y)) {
        setDirection(newDir);
      }
    }
  };

  const resetGame = () => {
    setSnake(initialSnake);
    setDirection(directions.ArrowRight);
    setFood(generateFood(initialSnake));
    setScore(0);
    setIsRunning(true);
    setIsStarted(true);
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setSnake(prev => {
        const newHead = {
          x: prev[0].x + moveRef.current.x,
          y: prev[0].y + moveRef.current.y,
        };

        if (
          newHead.x < 0 || newHead.x >= gridSize ||
          newHead.y < 0 || newHead.y >= gridSize ||
          prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)
        ) {
          playSound(200);
          setIsRunning(false);
          return prev;
        }

        const newSnake = [newHead, ...prev];

        if (newHead.x === food.x && newHead.y === food.y) {
          playSound(600);
          setScore(s => {
            const newScore = s + 1;
            if (newScore > highScore) {
              localStorage.setItem('snakeHighScore', newScore);
              setHighScore(newScore);
            }
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, speedLevels[speed]);

    return () => clearInterval(interval);
  }, [isRunning, food, speed]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '20px',
    },
    board: {
      display: 'grid',
      gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
      gridTemplateRows: `repeat(${gridSize}, ${cellSize}px)`,
      gap: '1px',
      backgroundColor: '#222',
      border: '4px solid #0ea5e9',
      marginBottom: '10px',
    },
    cell: {
      width: `${cellSize}px`,
      height: `${cellSize}px`,
      backgroundColor: '#111',
      transition: 'transform 0.2s ease',
    },
    head: {
      backgroundColor: '#16a34a',
      border: '1px solid #064e3b',
      borderRadius: '50% 50% 40% 40%',
    },
    body: {
      backgroundColor: '#0ea5e9',
      borderRadius: '6px',
    },
    tail: {
      backgroundColor: '#38bdf8',
      opacity: 0.7,
    },
    food: {
      backgroundColor: '#facc15',
      borderRadius: '50%',
    },
    controls: {
      marginBottom: '10px',
    },
    select: {
      padding: '6px 10px',
      fontSize: '16px',
      borderRadius: '6px',
    },
    info: {
      fontSize: '18px',
      color: '#10b981',
      marginBottom: '5px',
    },
    gameOver: {
      color: 'red',
      fontSize: '20px',
      marginTop: '10px',
    },
    button: {
      marginTop: '10px',
      padding: '10px 20px',
      backgroundColor: '#0ea5e9',
      color: 'white',
      fontSize: '16px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
    },
  };

  const getRotation = () => {
    if (direction === directions.ArrowUp) return 'rotate(0deg)';
    if (direction === directions.ArrowDown) return 'rotate(180deg)';
    if (direction === directions.ArrowLeft) return 'rotate(-90deg)';
    return 'rotate(90deg)';
  };

  const getWiggle = (index) => {
    if (index === 0) return {};
    const shift = wiggleFrame === 0 ? 1 : -1;
    return {
      transform:
        direction.x !== 0
          ? `translateY(${index % 2 === 0 ? shift : -shift}px)`
          : `translateX(${index % 2 === 0 ? shift : -shift}px)`,
    };
  };

  return (
    <div style={styles.container}>
      <h2>🐍 Snake Classic</h2>

      {!isStarted && (
        <>
          <div style={styles.controls}>
            <label>
              Select Speed:&nbsp;
              <select style={styles.select} value={speed} onChange={(e) => setSpeed(e.target.value)}>
                {Object.keys(speedLevels).map(level => (
                  <option key={level}>{level}</option>
                ))}
              </select>
            </label>
          </div>
          <button style={styles.button} onClick={resetGame}>
            ▶ Start Game
          </button>
        </>
      )}

      {isStarted && (
        <>
          <div style={styles.board}>
            {[...Array(gridSize * gridSize)].map((_, i) => {
              const x = i % gridSize;
              const y = Math.floor(i / gridSize);
              const index = snake.findIndex(seg => seg.x === x && seg.y === y);
              const isFood = food.x === x && food.y === y;

              let style = { ...styles.cell };
              if (index === 0) {
                style = { ...style, ...styles.head, transform: getRotation() };
              } else if (index === snake.length - 1) {
                style = { ...style, ...styles.tail, ...getWiggle(index) };
              } else if (index > 0) {
                style = { ...style, ...styles.body, ...getWiggle(index) };
              }
              if (isFood) style = { ...style, ...styles.food };

              return <div key={i} style={style} />;
            })}
          </div>

          <div style={styles.info}>Score: {score} | High Score: {highScore}</div>

          {!isRunning && (
            <>
              <div style={styles.gameOver}>💀 Game Over</div>
              <button style={styles.button} onClick={resetGame}>🔁 Play Again</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

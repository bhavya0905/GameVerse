import { useState, useEffect, useRef } from 'react';

const GAME_WIDTH = 250;
const GAME_HEIGHT = 400;
const BLOCK_HEIGHT = 20;
const START_WIDTH = 100;

const SPEEDS = {
  Easy: 2,
  Medium: 3,
  Hard: 4,
};

export default function TowerBlocks() {
  const [blocks, setBlocks] = useState([{ x: 75, width: START_WIDTH }]);
  const [movingX, setMovingX] = useState(0);
  const [direction, setDirection] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isDropping, setIsDropping] = useState(false);
  const [difficulty, setDifficulty] = useState('Easy');
  const [gameStarted, setGameStarted] = useState(false);
  const requestRef = useRef();

  const speed = SPEEDS[difficulty];

  // 🟢 Play a simple beep on game over
  const playWinSound = () => {
    const audio = new Audio(
      "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YRAAAAAA//////8="
    );
    audio.play();
  };

  useEffect(() => {
    if (!gameStarted || gameOver || isDropping) return;

    const animate = () => {
      const top = blocks[blocks.length - 1];
      let newX = movingX + direction * speed;

      if (newX <= 0 || newX + top.width >= GAME_WIDTH) {
        setDirection((prev) => -prev);
      } else {
        setMovingX(newX);
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [movingX, direction, gameOver, isDropping, gameStarted, speed]);

  const handleDrop = () => {
    if (!gameStarted || gameOver || isDropping) return;
    setIsDropping(true);

    const top = blocks[blocks.length - 1];
    const overlapStart = Math.max(movingX, top.x);
    const overlapEnd = Math.min(movingX + top.width, top.x + top.width);
    const overlapWidth = overlapEnd - overlapStart;

    if (overlapWidth <= 5) {
      setGameOver(true);
      playWinSound(); // 🟢 play sound on game over
      return;
    }

    const newBlock = {
      x: overlapStart,
      width: overlapWidth,
    };

    setBlocks([...blocks, newBlock]);
    setMovingX(0);
    setScore(score + 1);
    setIsDropping(false);
  };

  const resetGame = () => {
    setBlocks([{ x: 75, width: START_WIDTH }]);
    setMovingX(0);
    setDirection(1);
    setIsDropping(false);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>🌆 Tower Blocks</h1>
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
          <button onClick={startGame} style={styles.startButton}>
            🚀 Start Game
          </button>
        </div>
      )}

      {gameStarted && (
        <div style={styles.gameArea} onClick={handleDrop}>
          {blocks.map((block, index) => (
            <div
              key={index}
              style={{
                ...styles.block,
                bottom: `${index * BLOCK_HEIGHT}px`,
                left: `${block.x}px`,
                width: `${block.width}px`,
                height: `${BLOCK_HEIGHT}px`,
                background: 'linear-gradient(90deg, #34e89e, #0f3443)',
              }}
            />
          ))}

          {!gameOver && (
            <div
              style={{
                ...styles.block,
                bottom: `${blocks.length * BLOCK_HEIGHT}px`,
                left: `${movingX}px`,
                width: `${blocks[blocks.length - 1].width}px`,
                height: `${BLOCK_HEIGHT}px`,
                background: 'linear-gradient(90deg, #f7971e, #ffd200)',
              }}
            />
          )}
        </div>
      )}

      {gameOver && (
        <div style={styles.gameOverContainer}>
          <h2 style={styles.gameOverText}>💥 Game Over!</h2>
          <p style={styles.finalScore}>Final Score: {score}</p>
          <button onClick={resetGame} style={styles.resetButton}>🔁 Play Again</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'radial-gradient(circle, #1b2735 0%, #090a0f 100%)',
    color: 'white',
    textAlign: 'center',
    padding: '30px 20px',
    fontFamily: 'Verdana, sans-serif',
  },
  heading: {
    fontSize: '36px',
    marginBottom: '10px',
    color: '#00ffd0',
  },
  score: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  gameArea: {
    width: `${GAME_WIDTH}px`,
    height: `${GAME_HEIGHT}px`,
    background: '#101820',
    margin: '0 auto',
    position: 'relative',
    overflow: 'hidden',
    border: '3px solid #00ffd0',
    borderRadius: '12px',
    boxShadow: '0 0 15px rgba(0,255,208,0.7)',
  },
  block: {
    position: 'absolute',
    borderRadius: '5px',
    transition: 'all 0.2s ease',
  },
  menu: {
    marginBottom: '25px',
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
    transition: '0.3s',
  },
  gameOverContainer: {
    marginTop: '20px',
  },
  gameOverText: {
    color: '#ff4d4d',
    fontSize: '24px',
    marginBottom: '10px',
  },
  finalScore: {
    marginBottom: '10px',
    fontSize: '18px',
  },
  resetButton: {
    padding: '10px 20px',
    fontSize: '16px',
    backgroundColor: '#00ffd0',
    border: 'none',
    borderRadius: '6px',
    color: '#111',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

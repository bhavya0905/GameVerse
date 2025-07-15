import { useEffect, useState } from 'react';

const GRID_ROWS = 10;
const GRID_COLS = 6;
const CELL_SIZE = 30;
const fruits = ['🍒', '🍊', '🍋', '🍎', '🍉'];

const initialGrid = () =>
  Array.from({ length: GRID_ROWS }, () => Array(GRID_COLS).fill(null));

export default function FruitMerge() {
  const [grid, setGrid] = useState(initialGrid());
  const [currentFruit, setCurrentFruit] = useState(fruits[0]);
  const [nextFruit, setNextFruit] = useState(fruits[1]);
  const [fruitPos, setFruitPos] = useState({ row: 0, col: 2 });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    () => parseInt(localStorage.getItem('fruitHighScore')) || 0
  );
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [dropAnimCell, setDropAnimCell] = useState(null);

  useEffect(() => {
    const handleKey = (e) => {
      if (gameOver) return;

      if (['ArrowLeft', 'ArrowRight', 'ArrowDown'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft') {
        setFruitPos((pos) => ({
          ...pos,
          col: Math.max(0, pos.col - 1),
        }));
      } else if (e.key === 'ArrowRight') {
        setFruitPos((pos) => ({
          ...pos,
          col: Math.min(GRID_COLS - 1, pos.col + 1),
        }));
      } else if (e.key === 'ArrowDown') {
        dropFruit();
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [fruitPos, grid, currentFruit, gameOver]);

  useEffect(() => {
    setLevel(1 + Math.floor(score / 100));
  }, [score]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('fruitHighScore', score);
    }
  }, [score, highScore]);

  const dropFruit = () => {
    let row = 0;
    for (let r = GRID_ROWS - 1; r >= 0; r--) {
      if (!grid[r][fruitPos.col]) {
        row = r;
        break;
      }
    }

    if (grid[0][fruitPos.col]) {
      setGameOver(true);
      return;
    }

    const newGrid = grid.map((r) => [...r]);
    newGrid[row][fruitPos.col] = currentFruit;
    setDropAnimCell(`${row}-${fruitPos.col}`);

    recursiveMerge(newGrid);

    setGrid(newGrid);
    setScore((prev) => prev + 10);
    setCurrentFruit(nextFruit);
    setNextFruit(fruits[Math.floor(Math.random() * fruits.length)]);
    setFruitPos({ row: 0, col: 2 });

    setTimeout(() => setDropAnimCell(null), 300);
  };

  const recursiveMerge = (grid) => {
    let merged = false;

    do {
      merged = false;

      for (let row = GRID_ROWS - 1; row >= 0; row--) {
        for (let col = 0; col < GRID_COLS; col++) {
          const fruit = grid[row][col];
          const index = fruits.indexOf(fruit);
          if (index === -1 || index === fruits.length - 1) continue;

          const directions = [
            [1, 0], // down
            [0, -1], // left
            [0, 1], // right
          ];

          for (let [dr, dc] of directions) {
            const nr = row + dr;
            const nc = col + dc;

            if (
              nr >= 0 &&
              nr < GRID_ROWS &&
              nc >= 0 &&
              nc < GRID_COLS &&
              grid[nr][nc] === fruit
            ) {
              grid[row][col] = null;
              grid[nr][nc] = fruits[index + 1];
              setScore((prev) => prev + (index + 1) * 20);
              merged = true;
              break;
            }
          }
        }
      }
    } while (merged);
  };

  const resetGame = () => {
    setGrid(initialGrid());
    setScore(0);
    setLevel(1);
    setCurrentFruit(fruits[0]);
    setNextFruit(fruits[1]);
    setFruitPos({ row: 0, col: 2 });
    setGameOver(false);
    setDropAnimCell(null);
  };

  const styles = {
    container: {
      textAlign: 'center',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      paddingTop: '1rem',
    },
    title: {
      fontSize: '2rem',
      color: '#00ffff',
      textShadow: '0 0 10px #00ffff',
    },
    score: {
      margin: '0.5rem 0',
      fontSize: '1.2rem',
    },
    controls: {
      fontSize: '0.9rem',
      color: '#ccc',
      marginBottom: '1rem',
    },
    gridWrapper: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: '20px',
    },
    gameGrid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${GRID_COLS}, ${CELL_SIZE}px)`,
      gridTemplateRows: `repeat(${GRID_ROWS}, ${CELL_SIZE}px)`,
      gap: '3px',
      padding: '10px',
      borderRadius: '15px',
      boxShadow: '0 0 20px cyan',
      backgroundColor: '#111',
    },
    cell: {
      width: `${CELL_SIZE}px`,
      height: `${CELL_SIZE}px`,
      backgroundColor: '#1a1a1a',
      borderRadius: '50%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '18px',
      color: 'white',
      transition: 'transform 0.3s ease, opacity 0.3s ease',
    },
    animateDrop: {
      transform: 'translateY(-20px)',
      opacity: 0.5,
      animation: 'fall 0.3s ease forwards',
    },
    nextPreview: {
      marginTop: '0.5rem',
      fontSize: '1rem',
      color: '#fff',
    },
    info: {
      fontSize: '1rem',
      margin: '4px 0',
    },
    gameOverText: {
      fontSize: '1.5rem',
      color: 'red',
      marginTop: '1rem',
      fontWeight: 'bold',
    },
    restartButton: {
      marginTop: '1rem',
      padding: '8px 16px',
      backgroundColor: '#00ffff',
      color: '#000',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    keyframes: `
      @keyframes fall {
        0% { transform: translateY(-20px); opacity: 0.5; }
        100% { transform: translateY(0); opacity: 1; }
      }
    `,
  };

  return (
    <div style={styles.container}>
      <style>{styles.keyframes}</style>

      <h1 style={styles.title}>🍉 Fruit Merge</h1>
      <p style={styles.score}>Score: {score} | High Score: {highScore}</p>
      <p style={styles.info}>Level: {level}</p>
      <p style={styles.controls}>Use ⬅️ ➡️ to move, ⬇️ to drop</p>
      <div style={styles.nextPreview}>Next Fruit: {nextFruit}</div>

      <div style={styles.gridWrapper}>
        <div style={styles.gameGrid}>
          {grid.map((row, rowIndex) =>
            row.map((cell, colIndex) => {
              const isActive =
                rowIndex === fruitPos.row && colIndex === fruitPos.col;
              const id = `${rowIndex}-${colIndex}`;
              const isDropping = id === dropAnimCell;

              return (
                <div
                  key={id}
                  style={{
                    ...styles.cell,
                    ...(isDropping ? styles.animateDrop : {}),
                  }}
                >
                  {isActive ? currentFruit : cell}
                </div>
              );
            })
          )}
        </div>
      </div>

      {gameOver && (
        <>
          <div style={styles.gameOverText}>Game Over</div>
          <button style={styles.restartButton} onClick={resetGame}>
            Restart
          </button>
        </>
      )}
    </div>
  );
}

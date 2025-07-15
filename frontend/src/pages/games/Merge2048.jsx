import { useEffect, useState } from 'react';

const GRID_SIZE = 4;
const START_TILES = 2;

const DIFFICULTY_SETTINGS = {
  Easy: { goal: 512, spawn4Prob: 0.1 },
  Medium: { goal: 1024, spawn4Prob: 0.3 },
  Hard: { goal: 2048, spawn4Prob: 0.5 },
};

const createEmptyGrid = () => Array(GRID_SIZE).fill(0).map(() => Array(GRID_SIZE).fill(0));
const cloneGrid = (grid) => grid.map(row => [...row]);

function getRandomEmptyCell(grid) {
  const empty = [];
  grid.forEach((row, i) => {
    row.forEach((val, j) => {
      if (val === 0) empty.push([i, j]);
    });
  });
  return empty.length ? empty[Math.floor(Math.random() * empty.length)] : null;
}

function addNewTile(grid, spawn4Prob) {
  const cell = getRandomEmptyCell(grid);
  if (!cell) return;
  const [i, j] = cell;
  grid[i][j] = Math.random() < spawn4Prob ? 4 : 2;
}

function canMove(grid) {
  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      if (grid[r][c] === 0) return true;
      if (c < GRID_SIZE - 1 && grid[r][c] === grid[r][c + 1]) return true;
      if (r < GRID_SIZE - 1 && grid[r][c] === grid[r + 1][c]) return true;
    }
  }
  return false;
}

function playSound(freq = 300, duration = 100) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'square';
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
}

export default function Merge2048() {
  const [grid, setGrid] = useState(() => {
    const fresh = createEmptyGrid();
    for (let i = 0; i < START_TILES; i++) addNewTile(fresh, 0.1);
    return fresh;
  });
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => Number(localStorage.getItem('2048HighScore') || 0));
  const [difficulty, setDifficulty] = useState('Easy');
  const [goal, setGoal] = useState(DIFFICULTY_SETTINGS['Easy'].goal);
  const [spawn4Prob, setSpawn4Prob] = useState(DIFFICULTY_SETTINGS['Easy'].spawn4Prob);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  const startGame = () => {
    const fresh = createEmptyGrid();
    for (let i = 0; i < START_TILES; i++) addNewTile(fresh, spawn4Prob);
    setGrid(fresh);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setGameStarted(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    const fresh = createEmptyGrid();
    for (let i = 0; i < START_TILES; i++) addNewTile(fresh, spawn4Prob);
    setGrid(fresh);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  const move = (grid, direction) => {
    let moved = false;
    let gained = 0;

    const mergeLine = (line) => {
      let newLine = line.filter(n => n !== 0);
      for (let i = 0; i < newLine.length - 1; i++) {
        if (newLine[i] === newLine[i + 1]) {
          newLine[i] *= 2;
          playSound(500);
          gained += newLine[i];
          newLine[i + 1] = 0;
        }
      }
      return [...newLine.filter(n => n !== 0), ...Array(GRID_SIZE - newLine.filter(n => n !== 0).length).fill(0)];
    };

    const newGrid = cloneGrid(grid);

    if (direction === 'left') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const original = [...newGrid[r]];
        newGrid[r] = mergeLine(newGrid[r]);
        if (original.join() !== newGrid[r].join()) moved = true;
      }
    } else if (direction === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        const original = [...newGrid[r]];
        newGrid[r] = mergeLine([...newGrid[r]].reverse()).reverse();
        if (original.join() !== newGrid[r].join()) moved = true;
      }
    } else if (direction === 'up') {
      for (let c = 0; c < GRID_SIZE; c++) {
        const col = newGrid.map(row => row[c]);
        const merged = mergeLine(col);
        for (let r = 0; r < GRID_SIZE; r++) {
          if (newGrid[r][c] !== merged[r]) moved = true;
          newGrid[r][c] = merged[r];
        }
      }
    } else if (direction === 'down') {
      for (let c = 0; c < GRID_SIZE; c++) {
        const col = newGrid.map(row => row[c]).reverse();
        const merged = mergeLine(col).reverse();
        for (let r = 0; r < GRID_SIZE; r++) {
          if (newGrid[r][c] !== merged[r]) moved = true;
          newGrid[r][c] = merged[r];
        }
      }
    }

    return { newGrid, moved, gained };
  };

  useEffect(() => {
    const handler = (e) => {
      if (!gameStarted || gameOver || gameWon) return;

      let dir = '';
      if (e.key === 'ArrowLeft') dir = 'left';
      if (e.key === 'ArrowRight') dir = 'right';
      if (e.key === 'ArrowUp') dir = 'up';
      if (e.key === 'ArrowDown') dir = 'down';
      if (!dir) return;

      e.preventDefault();

      const { newGrid, moved, gained } = move(grid, dir);
      if (!moved) return;

      playSound(300);
      addNewTile(newGrid, spawn4Prob);
      const newScore = score + gained;
      setScore(newScore);
      setGrid(newGrid);

      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('2048HighScore', newScore);
      }

      const flat = newGrid.flat();
      if (flat.includes(goal)) setGameWon(true);
      else if (!flat.includes(0) && !canMove(newGrid)) setGameOver(true);
    };

    window.addEventListener('keydown', handler, { passive: false });
    return () => window.removeEventListener('keydown', handler);
  }, [grid, score, gameStarted, gameOver, gameWon, goal, spawn4Prob]);

  const handleDifficultyChange = (e) => {
    const diff = e.target.value;
    setDifficulty(diff);
    setGoal(DIFFICULTY_SETTINGS[diff].goal);
    setSpawn4Prob(DIFFICULTY_SETTINGS[diff].spawn4Prob);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧠 2048 Merge</h2>

      <div style={styles.grid}>
        {grid.map((row, i) =>
          row.map((val, j) => (
            <div
              key={`${i}-${j}`}
              style={{
                ...styles.cell,
                backgroundColor: getColor(val),
                color: val <= 4 ? '#776e65' : 'white',
              }}
            >
              {val !== 0 ? val : ''}
            </div>
          ))
        )}
      </div>

      {!gameStarted ? (
        <div style={styles.menu}>
          <label style={styles.label}>Select Difficulty:</label>
          <select value={difficulty} onChange={handleDifficultyChange} style={styles.select}>
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
          <button onClick={startGame} style={styles.button}>Start Game</button>
        </div>
      ) : (
        <>
          <p style={styles.score}>Score: {score} | High Score: {highScore} | Goal: {goal}</p>
          <button onClick={resetGame} style={styles.button}>🔁 Reset</button>
          {gameWon && <h3 style={{ color: '#00ff88' }}>🎉 You Win!</h3>}
          {gameOver && <h3 style={{ color: 'red' }}>💀 Game Over</h3>}
        </>
      )}
    </div>
  );
}

function getColor(value) {
  const tileColors = {
    0: '#333',
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    4096: '#3c3a32',
    8192: '#2e2b28',
  };
  return tileColors[value] || '#1a1917';
}

const styles = {
  container: {
    textAlign: 'center',
    minHeight: '100vh',
    background: '#111',
    color: 'white',
    padding: '20px',
    fontFamily: 'sans-serif',
  },
  heading: {
    fontSize: '32px',
    color: '#00ffd0',
    marginBottom: '10px',
  },
  score: {
    fontSize: '18px',
    marginBottom: '10px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: `repeat(${GRID_SIZE}, 80px)`,
    gap: '10px',
    justifyContent: 'center',
    marginBottom: '20px',
  },
  cell: {
    width: '80px',
    height: '80px',
    backgroundColor: '#444',
    fontSize: '24px',
    fontWeight: 'bold',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '8px',
  },
  menu: {
    marginTop: '20px',
  },
  label: {
    fontSize: '16px',
    marginRight: '10px',
  },
  select: {
    padding: '6px 10px',
    fontSize: '16px',
    marginRight: '10px',
  },
  button: {
    padding: '8px 16px',
    fontSize: '16px',
    backgroundColor: '#00ffd0',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    color: '#000',
  },
};

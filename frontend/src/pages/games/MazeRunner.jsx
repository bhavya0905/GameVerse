import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function MazeRunner() {
  const [difficulty, setDifficulty] = useState('easy');
  const [maze, setMaze] = useState([]);
  const [player, setPlayer] = useState({ row: 0, col: 0 });
  const [hasWon, setHasWon] = useState(false);
  const [steps, setSteps] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const sizeMap = {
    easy: 11,
    medium: 17,
    hard: 21,
  };

  const numRows = sizeMap[difficulty];
  const numCols = sizeMap[difficulty];

  const playWinSound = () => {
    const audio = new Audio("https://www.fesliyanstudios.com/play-mp3/387");
    audio.play();
  };

  const generateMaze = () => {
    const grid = Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => ({ visited: false, wall: true }))
    );

    const directions = [
      [0, 2], [0, -2], [2, 0], [-2, 0]
    ];

    const isValid = (r, c) => r >= 0 && c >= 0 && r < numRows && c < numCols;

    const dfs = (r, c) => {
      grid[r][c].wall = false;
      grid[r][c].visited = true;

      const shuffled = directions.sort(() => Math.random() - 0.5);

      for (const [dr, dc] of shuffled) {
        const nr = r + dr;
        const nc = c + dc;

        if (isValid(nr, nc) && !grid[nr][nc].visited) {
          grid[r + dr / 2][c + dc / 2].wall = false;
          dfs(nr, nc);
        }
      }
    };

    // Always start at (0, 0) and dig to (last cell)
    dfs(0, 0);
    grid[numRows - 1][numCols - 1].wall = false; // ensure goal cell is accessible

    return grid;
  };

  const resetGame = () => {
    const newMaze = generateMaze();
    setMaze(newMaze);
    setPlayer({ row: 0, col: 0 });
    setHasWon(false);
    setSteps(0);
    setElapsedTime(0);
    setStartTime(Date.now());
  };

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const allowedKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'];
      if (!allowedKeys.includes(e.key)) return;

      e.preventDefault();
      if (hasWon) return;

      const { row, col } = player;
      let newRow = row, newCol = col;

      switch (e.key) {
        case 'ArrowUp':
        case 'w': newRow--; break;
        case 'ArrowDown':
        case 's': newRow++; break;
        case 'ArrowLeft':
        case 'a': newCol--; break;
        case 'ArrowRight':
        case 'd': newCol++; break;
        default: return;
      }

      if (
        newRow >= 0 &&
        newCol >= 0 &&
        newRow < numRows &&
        newCol < numCols &&
        !maze[newRow][newCol].wall
      ) {
        setPlayer({ row: newRow, col: newCol });
        setSteps(prev => prev + 1);

        if (newRow === numRows - 1 && newCol === numCols - 1) {
          setHasWon(true);
          setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
          playWinSound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [player, maze, hasWon, startTime]);

  return (
    <div style={{
      padding: '2rem',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      background: 'linear-gradient(to bottom, #000000, #0f0f0f, #140000)',
      minHeight: '100vh',
      color: 'white'
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: '#f87171' }}>
        🌲 Forest Maze
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Choose Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{ padding: '0.5rem', borderRadius: '5px' }}
        >
          <option value="easy">Easy (11x11)</option>
          <option value="medium">Medium (17x17)</option>
          <option value="hard">Hard (21x21)</option>
        </select>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${numCols}, 25px)`,
        gridTemplateRows: `repeat(${numRows}, 25px)`,
        justifyContent: 'center',
        gap: '2px',
        margin: 'auto',
        marginBottom: '1rem'
      }}>
        {maze.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            const isPlayer = rIdx === player.row && cIdx === player.col;
            const isGoal = rIdx === numRows - 1 && cIdx === numCols - 1;

            return (
              <motion.div
                key={`${rIdx}-${cIdx}`}
                animate={isPlayer ? { scale: [1, 1.3, 1] } : {}}
                style={{
                  width: '25px',
                  height: '25px',
                  fontSize: '20px',
                  textAlign: 'center',
                  lineHeight: '25px',
                  backgroundColor: cell.wall ? '#333' : '#eee',
                  borderRadius: '4px',
                  color: '#000'
                }}
              >
                {isPlayer ? '🐾' : isGoal ? '🌟' : cell.wall ? '' : '🌲'}
              </motion.div>
            );
          })
        )}
      </div>

      <div style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        <strong>Steps:</strong> {steps} | <strong>Time:</strong> {elapsedTime}s
      </div>

      {hasWon && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ color: '#22c55e', fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}
        >
          🎉 You Escaped the Forest! 🎉
        </motion.div>
      )}

      <button
        onClick={resetGame}
        style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}
      >
        🔁 Reset Game
      </button>
    </div>
  );
}

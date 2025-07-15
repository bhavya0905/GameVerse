import { useEffect, useState } from 'react';

const difficulties = {
  Easy: 35,
  Medium: 28,
  Hard: 20,
};

function generateEmptyBoard() {
  return Array(9).fill().map(() => Array(9).fill(''));
}

function isValid(board, row, col, num) {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let r = startRow; r < startRow + 3; r++) {
    for (let c = startCol; c < startCol + 3; c++) {
      if (board[r][c] === num) return false;
    }
  }
  return true;
}

function fillBoard(board) {
  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      if (board[row][col] === '') {
        const numbers = [...Array(9).keys()].map(i => (i + 1).toString()).sort(() => Math.random() - 0.5);
        for (let num of numbers) {
          if (isValid(board, row, col, num)) {
            board[row][col] = num;
            if (fillBoard(board)) return true;
            board[row][col] = '';
          }
        }
        return false;
      }
    }
  }
  return true;
}

function generatePuzzle(fullBoard, clues) {
  const puzzle = fullBoard.map(row => [...row]);
  let count = 81 - clues;
  while (count > 0) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);
    if (puzzle[row][col] !== '') {
      puzzle[row][col] = '';
      count--;
    }
  }
  return puzzle;
}

function playSound(freq = 400, duration = 100) {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
  oscillator.connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration / 1000);
}

export default function SudokuMaster() {
  const [difficulty, setDifficulty] = useState('Easy');
  const [board, setBoard] = useState(generateEmptyBoard());
  const [solution, setSolution] = useState(generateEmptyBoard());
  const [initialCells, setInitialCells] = useState(generateEmptyBoard());
  const [status, setStatus] = useState('');
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

  const startNewPuzzle = () => {
    const full = generateEmptyBoard();
    fillBoard(full);
    const puzzle = generatePuzzle(full, difficulties[difficulty]);
    const locked = puzzle.map(row => row.map(cell => cell !== ''));
    setBoard(puzzle.map(row => row.map(cell => cell.toString())));
    setInitialCells(locked);
    setSolution(full.map(row => row.map(cell => cell.toString())));
    setHintsUsed(0);
    setStatus('');
    setMistakes(0);
    setGameOver(false);
  };

  const resetPuzzle = () => {
    const fresh = board.map((row, r) =>
      row.map((_, c) => (initialCells[r][c] ? solution[r][c] : ''))
    );
    setBoard(fresh);
    setHintsUsed(0);
    setStatus('');
    setMistakes(0);
    setGameOver(false);
  };

  const checkForWin = (newBoard) => {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (newBoard[r][c] !== solution[r][c]) return false;
      }
    }
    return true;
  };

  const handleChange = (r, c, value) => {
    if (!/^[1-9]?$/.test(value) || gameOver) return;
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = value;
    setBoard(newBoard);

    if (value !== '' && value !== solution[r][c]) {
      setMistakes((prev) => {
        const updated = prev + 1;
        if (updated >= 5) {
          setStatus('❌ You lost! Too many mistakes.');
          setGameOver(true);
        }
        return updated;
      });
    } else if (value === solution[r][c]) {
      playSound(500);
    }

    if (checkForWin(newBoard)) {
      setStatus('🎉 Congratulations! You won!');
      setGameOver(true);
      playSound(700);
      const currentScore = Math.max(1000 - 10 * hintsUsed, 0);
      if (currentScore > highScore) {
        localStorage.setItem('sudokuHighScore', currentScore);
        setHighScore(currentScore);
      }
    }
  };

  const handleHint = () => {
    if (gameOver) return;
    const empties = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (!initialCells[r][c] && board[r][c] === '') {
          empties.push([r, c]);
        }
      }
    }
    if (empties.length === 0) return;
    const [r, c] = empties[Math.floor(Math.random() * empties.length)];
    const newBoard = board.map(row => [...row]);
    newBoard[r][c] = solution[r][c];
    setBoard(newBoard);
    setHintsUsed(h => h + 1);
    playSound(300);

    if (checkForWin(newBoard)) {
      setStatus('🎉 Congratulations! You won!');
      setGameOver(true);
      playSound(700);
      const currentScore = Math.max(1000 - 10 * (hintsUsed + 1), 0);
      if (currentScore > highScore) {
        localStorage.setItem('sudokuHighScore', currentScore);
        setHighScore(currentScore);
      }
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('sudokuHighScore');
    if (saved) setHighScore(Number(saved));
    startNewPuzzle();
  }, [difficulty]);

  useEffect(() => {
    const preventScroll = (e) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventScroll);
    return () => window.removeEventListener("keydown", preventScroll);
  }, []);

  const score = Math.max(1000 - 10 * hintsUsed, 0);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🧠 Sudoku Master</h2>

      <div style={styles.controls}>
        <label style={styles.label}>Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={styles.select}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </select>
        <button onClick={startNewPuzzle} style={styles.button}>New</button>
        <button onClick={resetPuzzle} style={styles.button}>Reset</button>
        <button onClick={handleHint} style={styles.button}>Hint 💡</button>
      </div>

      <div style={styles.stats}>
        💯 Score: {score} | 🧩 Hints: {hintsUsed} | ❌ Mistakes: {mistakes}/5 | 🏆 High Score: {highScore}
      </div>

      <div style={styles.grid}>
        {board.map((row, r) =>
          row.map((val, c) => {
            let bg = initialCells[r][c] ? '#ddd' : '#fff';
            if (!initialCells[r][c] && val !== '') {
              bg = val === solution[r][c] ? '#c8facc' : '#f8cccc';
            }
            return (
              <input
                key={`${r}-${c}`}
                value={val}
                disabled={initialCells[r][c] || gameOver}
                onChange={(e) => handleChange(r, c, e.target.value)}
                style={{
                  ...styles.cell,
                  backgroundColor: bg,
                  fontWeight: initialCells[r][c] ? 'bold' : 'normal',
                  borderRight: (c + 1) % 3 === 0 && c !== 8 ? '2px solid #666' : '1px solid #444',
                  borderBottom: (r + 1) % 3 === 0 && r !== 8 ? '2px solid #666' : '1px solid #444',
                }}
                maxLength={1}
              />
            );
          })
        )}
      </div>

      <p style={{ marginTop: '15px', fontSize: '18px', color: status.includes('won') ? 'lightgreen' : 'red' }}>
        {status}
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    backgroundColor: '#121212',
    color: '#eee',
    minHeight: '100vh',
    padding: '20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  heading: {
    fontSize: '30px',
    color: '#00ffc8',
    marginBottom: '20px',
  },
  controls: {
    marginBottom: '12px',
  },
  label: {
    fontSize: '15px',
    marginRight: '8px',
  },
  select: {
    padding: '6px 10px',
    fontSize: '14px',
    marginRight: '10px',
    borderRadius: '6px',
    border: '1px solid #999',
  },
  button: {
    margin: '4px',
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#00ffc8',
    border: 'none',
    borderRadius: '6px',
    color: '#111',
    cursor: 'pointer',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(9, 30px)',
    gap: '0px',
    justifyContent: 'center',
    padding: '10px',
    backgroundColor: '#222',
    borderRadius: '10px',
  },
  cell: {
    width: '30px',
    height: '30px',
    textAlign: 'center',
    fontSize: '16px',
    outline: 'none',
    border: '1px solid #444',
    transition: 'background-color 0.2s',
  },
  stats: {
    fontSize: '15px',
    marginBottom: '10px',
  },
};

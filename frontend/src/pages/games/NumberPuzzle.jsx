import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function generateBoard(size) {
  const board = Array.from({ length: size * size - 1 }, (_, i) => i + 1);
  board.push(null); // empty tile

  // Shuffle using Fisher-Yates
  for (let i = board.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [board[i], board[j]] = [board[j], board[i]];
  }

  return board;
}

function isSolvable(board, size) {
  let invCount = 0;
  for (let i = 0; i < board.length; i++) {
    for (let j = i + 1; j < board.length; j++) {
      if (board[i] && board[j] && board[i] > board[j]) invCount++;
    }
  }
  if (size % 2 === 1) return invCount % 2 === 0;
  const blankRowFromBottom = size - Math.floor(board.indexOf(null) / size);
  return (blankRowFromBottom % 2 === 0) === (invCount % 2 === 1);
}

export default function NumberPuzzle() {
  const [size, setSize] = useState(3);
  const [board, setBoard] = useState([]);
  const [won, setWon] = useState(false);

  const resetBoard = () => {
    let newBoard;
    do {
      newBoard = generateBoard(size);
    } while (!isSolvable(newBoard, size));
    setBoard(newBoard);
    setWon(false);
  };

  useEffect(() => {
    resetBoard();
  }, [size]);

  const handleTileClick = (index) => {
    const newBoard = [...board];
    const emptyIndex = newBoard.indexOf(null);
    const isAdjacent =
      index === emptyIndex - 1 && emptyIndex % size !== 0 ||
      index === emptyIndex + 1 && index % size !== 0 ||
      index === emptyIndex - size ||
      index === emptyIndex + size;

    if (isAdjacent) {
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);

      const wonCheck = newBoard.slice(0, -1).every((val, i) => val === i + 1);
      if (wonCheck) setWon(true);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #111827, #1f2937)',
        color: 'white',
        padding: '2rem',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#38bdf8' }}>
        🔢 Number Puzzle
      </h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Difficulty: </label>
        <select
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          style={{ padding: '0.5rem', borderRadius: '5px', marginLeft: '0.5rem' }}
        >
          <option value={3}>Easy (3x3)</option>
          <option value={4}>Medium (4x4)</option>
          <option value={5}>Hard (5x5)</option>
        </select>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${size}, 80px)`,
          gap: '0.5rem',
          justifyContent: 'center',
          marginBottom: '1rem'
        }}
      >
        {board.map((num, i) => (
          <motion.div
            key={i}
            onClick={() => handleTileClick(i)}
            whileTap={{ scale: 0.95 }}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: num ? '#fbbf24' : '#1f2937',
              color: num ? '#000' : 'transparent',
              fontWeight: 'bold',
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '8px',
              cursor: num ? 'pointer' : 'default',
              border: '2px solid #fbbf24'
            }}
          >
            {num}
          </motion.div>
        ))}
      </div>

      {won && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: '#4ade80', fontWeight: 'bold', marginBottom: '1rem' }}
        >
          🎉 You solved the puzzle!
        </motion.div>
      )}

      <button
        onClick={resetBoard}
        style={{
          padding: '0.5rem 1.5rem',
          backgroundColor: '#f87171',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold'
        }}
      >
        🔁 Shuffle
      </button>
    </div>
  );
}

// Dot Connect Game with Working Undo and Accurate Win/Loss Detection

import React, { useEffect, useState } from 'react';

const DIFFICULTY_LEVELS = {
  Easy: [
    { x: 0, y: 0, color: 'red' }, { x: 1, y: 2, color: 'red' },
    { x: 5, y: 0, color: 'blue' }, { x: 3, y: 1, color: 'blue' },
  ],
  Medium: [
    { x: 0, y: 0, color: 'red' }, { x: 2, y: 2, color: 'red' },
    { x: 5, y: 0, color: 'blue' }, { x: 5, y: 5, color: 'blue' },
    { x: 0, y: 5, color: 'green' }, { x: 3, y: 2, color: 'green' },
  ],
  Hard: [
  { x: 0, y: 0, color: 'red' },    { x: 4, y: 1, color: 'red' },
  { x: 1, y: 2, color: 'blue' },   { x: 3, y: 3, color: 'blue' },
  { x: 0, y: 4, color: 'green' },  { x: 1, y: 0, color: 'green' },
  { x: 0, y: 2, color: 'orange' }, { x: 3, y: 2, color: 'orange' },
],

};

const GRID_SIZE = 6;

const playSound = (freq = 700, duration = 0.1) => {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
};

function DotConnect() {
  const [grid, setGrid] = useState([]);
  const [dots, setDots] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [paths, setPaths] = useState({});
  const [currentColor, setCurrentColor] = useState(null);
  const [difficulty, setDifficulty] = useState('Easy');
  const [message, setMessage] = useState('');
  const [highScore, setHighScore] = useState(() => localStorage.getItem('dot-connect-highscore') || 0);
  const [completedColors, setCompletedColors] = useState([]);

  const resetBoard = () => {
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    const d = DIFFICULTY_LEVELS[difficulty];
    d.forEach(dot => newGrid[dot.y][dot.x] = dot.color);
    setDots(d);
    setGrid(newGrid);
    setPaths({});
    setCursor(null);
    setCurrentColor(null);
    setMessage('');
    setCompletedColors([]);
  };

  useEffect(() => {
    resetBoard();
  }, [difficulty]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!cursor || !currentColor || completedColors.includes(currentColor)) return;
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) e.preventDefault();

      const dir = {
        ArrowUp: [0, -1], ArrowDown: [0, 1],
        ArrowLeft: [-1, 0], ArrowRight: [1, 0]
      };

      const move = dir[e.key];
      if (!move) return;

      const newX = cursor.x + move[0];
      const newY = cursor.y + move[1];
      if (newX < 0 || newY < 0 || newX >= GRID_SIZE || newY >= GRID_SIZE) return;

      const newGrid = grid.map(row => [...row]);
      const cell = newGrid[newY][newX];
      const path = paths[currentColor] || [];
      const isDot = dots.find(dot => dot.x === newX && dot.y === newY);

      if (cell === null || (isDot?.color === currentColor && !path.find(p => p.x === newX && p.y === newY))) {
        newGrid[newY][newX] = currentColor;
        const newPath = [...path, { x: newX, y: newY }];
        const newPaths = { ...paths, [currentColor]: newPath };
        setGrid(newGrid);
        setPaths(newPaths);
        setCursor({ x: newX, y: newY });
        playSound();

        if (isDot?.color === currentColor && !completedColors.includes(currentColor)) {
          const newCompleted = [...completedColors, currentColor];
          setCompletedColors(newCompleted);
          setCursor(null);
          setCurrentColor(null);

          const allDotsConnected = Object.keys(DIFFICULTY_LEVELS[difficulty].reduce((acc, d) => {
            acc[d.color] = acc[d.color] ? acc[d.color] + 1 : 1;
            return acc;
          }, {})).every(color => {
            const path = newPaths[color] || [];
            return path.length >= 2 && newCompleted.includes(color);
          });

          const allFilled = newGrid.flat().every(cell => cell !== null);

          if (allDotsConnected && allFilled) {
          playSound(1000, 0.2);
          setMessage('🎉 You Win!');
          const steps = Object.values(newPaths).reduce((sum, arr) => sum + arr.length, 0);
          if (steps < highScore || highScore === 0) {
            localStorage.setItem('dot-connect-highscore', steps);
            setHighScore(steps);
          }
          } else if (allDotsConnected && !allFilled) {
            setMessage('❌ You Lose! Grid not completely filled');
          }
        }
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cursor, currentColor, grid, paths, difficulty, completedColors]);

  const handleDotClick = (x, y) => {
    const color = dots.find(dot => dot.x === x && dot.y === y)?.color;
    if (!color || completedColors.includes(color)) return;
    setCurrentColor(color);
    setCursor({ x, y });
    if (!paths[color]) setPaths({ ...paths, [color]: [{ x, y }] });
  };

  const undoStep = () => {
    if (!currentColor || !paths[currentColor]) return;
    const path = paths[currentColor];
    if (path.length === 0) return;
    const last = path[path.length - 1];
    const newPath = path.slice(0, -1);
    const newGrid = grid.map(r => [...r]);
    if (!dots.some(dot => dot.x === last.x && dot.y === last.y)) {
      newGrid[last.y][last.x] = null;
    }
    setGrid(newGrid);
    setPaths({ ...paths, [currentColor]: newPath });
    setCursor(newPath.length > 0 ? newPath[newPath.length - 1] : null);
  };

  const getCellStyle = (x, y) => {
    const color = grid[y]?.[x];
    const isDot = dots.find(dot => dot.x === x && dot.y === y);
    const isCursor = cursor?.x === x && cursor?.y === y;
    return {
      width: 24, height: 24,
      backgroundColor: color || '#f0f0f0',
      borderRadius: 4,
      border: '2px solid #ccc',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      cursor: isDot ? 'pointer' : 'default',
      boxShadow: isCursor ? 'inset 0 0 0 3px #000' : '',
      color: isDot ? '#fff' : '',
      fontSize: 14,
      transition: 'all 0.2s ease',
      transform: isDot ? 'scale(1.1)' : 'scale(1)',
      userSelect: 'none',
    };
  };

  return (
    <div style={{ textAlign: 'center', marginTop: 20, fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: 10, color: '#333' }}>🎯 Dot Connect Game</h2>

      <select
        value={difficulty}
        onChange={e => setDifficulty(e.target.value)}
        style={{
          padding: 8,
          marginBottom: 10,
          borderRadius: 6,
          fontSize: 16,
          border: '1px solid #888',
          outline: 'none',
          background: '#f9f9f9'
        }}>
        {Object.keys(DIFFICULTY_LEVELS).map(level => (
          <option key={level}>{level}</option>
        ))}
      </select>

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${GRID_SIZE}, 24px)`, gap: 6, marginBottom: 10 }}>
          {grid.length > 0 && grid.map((row, y) =>
            row.map((_, x) => (
              <div
                key={`${x}-${y}`}
                style={getCellStyle(x, y)}
                onClick={() => handleDotClick(x, y)}
              >
                {dots.find(dot => dot.x === x && dot.y === y) ? '●' : ''}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <button
          onClick={resetBoard}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 8,
            background: 'linear-gradient(to right, #00c6ff, #0072ff)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
            marginRight: 10
          }}>
          🔄 Reset
        </button>
        <button
          onClick={undoStep}
          style={{
            padding: '10px 20px',
            fontSize: 16,
            borderRadius: 8,
            background: 'linear-gradient(to right, #ff9966, #ff5e62)',
            border: 'none',
            color: '#fff',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0,0,0,0.15)'
          }}>
          ↩️ Undo
        </button>
      </div>

      {message && <div style={{ fontSize: 20, color: message.includes('Win') ? 'green' : 'red', fontWeight: 'bold' }}>{message}</div>}
      <div style={{ fontSize: 16, marginTop: 8 }}>🏆 Best Score: {highScore}</div>
    </div>
  );
}

export default DotConnect;

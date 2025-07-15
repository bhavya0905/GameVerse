// File: src/pages/games/LudoArena.jsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL);

const SIZE = 15;
const PX = 30;
const WIN_POS = 56;

const COLORS = {
  green: '#27ae60',
  yellow: '#f1c40f',
  red: '#e74c3c',
  blue: '#2980b9',
};

const OFFSET = {
  green: 0,
  yellow: 14,
  blue: 28,
  red: 42,
};

const PATH = [
  { r: 6, c: 0 }, { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
  { r: 6, c: 6 }, { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
  { r: 0, c: 7 }, { r: 0, c: 8 }, { r: 0, c: 9 }, { r: 0, c: 10 }, { r: 0, c: 11 }, { r: 0, c: 12 }, { r: 0, c: 13 },
  { r: 0, c: 14 }, { r: 1, c: 14 }, { r: 2, c: 14 }, { r: 3, c: 14 }, { r: 4, c: 14 }, { r: 5, c: 14 }, { r: 6, c: 14 },
  { r: 7, c: 14 }, { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 }, { r: 8, c: 8 },
  { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
  { r: 14, c: 7 }, { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }, { r: 8, c: 7 },
  { r: 8, c: 6 }, { r: 7, c: 6 }, { r: 7, c: 5 }, { r: 7, c: 4 }, { r: 7, c: 3 }, { r: 7, c: 2 }, { r: 7, c: 1 }, { r: 7, c: 0 }
];

export default function LudoArena() {
  const [mode, setMode] = useState(null);
  const [players, setPlayers] = useState([]);
  const [turn, setTurn] = useState('green');
  const [dice, setDice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [positions, setPositions] = useState({
    green: [0, 0, 0, 0],
    yellow: [0, 0, 0, 0],
    red: [0, 0, 0, 0],
    blue: [0, 0, 0, 0],
  });

  useEffect(() => {
    socket.on('move', ({ player, index, value }) => {
      move(player, index, value, true);
    });
  }, []);

  useEffect(() => {
    if (mode === 'bot' && turn === 'yellow') {
      const roll = Math.floor(Math.random() * 6) + 1;
      setDice(roll);
      setTimeout(() => {
        const i = positions.yellow.findIndex(p => p + roll <= WIN_POS);
        if (i !== -1) move('yellow', i, roll);
      }, 1000);
    }
  }, [turn, mode, dice]);

  const roll = () => {
    if (dice || winner) return;
    const value = Math.floor(Math.random() * 6) + 1;
    setDice(value);
  };

  const move = (player, index, value = dice, fromSocket = false) => {
    if (winner || turn !== player || value == null) return;

    const next = positions[player][index] + value;
    if (next > WIN_POS) return;

    const updated = [...positions[player]];
    updated[index] = next;
    setPositions(prev => ({ ...prev, [player]: updated }));
    setDice(null);

    if (!fromSocket && mode !== 'bot') {
      socket.emit('move', { player, index, value });
    }

    if (updated.every(p => p >= WIN_POS)) {
      setWinner(player);
      return;
    }

    const idx = players.indexOf(player);
    const nextTurn = players[(idx + 1) % players.length];
    setTimeout(() => setTurn(nextTurn), 500);
  };

  const cellColor = (r, c) => {
    if (r < 6 && c < 6) return COLORS.green + '33';
    if (r < 6 && c > 8) return COLORS.yellow + '33';
    if (r > 8 && c < 6) return COLORS.red + '33';
    if (r > 8 && c > 8) return COLORS.blue + '33';
    if (r === 7 || c === 7) return '#dfe6e9';
    return '#2d3436';
  };

  const S = {
    board: {
      position: 'relative',
      width: PX * SIZE,
      height: PX * SIZE,
      display: 'grid',
      gridTemplate: `repeat(${SIZE},${PX}px)/repeat(${SIZE},${PX}px)`,
      border: '4px solid #fff',
      marginTop: 20,
    },
    token: {
      position: 'absolute',
      width: PX * 0.6,
      height: PX * 0.6,
      borderRadius: '50%',
      border: '2px solid white',
      boxShadow: '0 0 8px rgba(0,0,0,0.3)'
    },
    btn: {
      padding: '10px 20px',
      fontSize: '1rem',
      borderRadius: 8,
      margin: '10px',
      border: 'none',
      cursor: 'pointer'
    }
  };

  if (!mode) {
    return (
      <div style={{ textAlign: 'center', marginTop: 40 }}>
        <h2>🎲 Ludo Arena</h2>
        {[
          ['bot', 'Play vs Computer'],
          ['2', '2 Players'],
          ['3', '3 Players'],
          ['4', '4 Players']
        ].map(([val, label]) => (
          <button
            key={val}
            style={{ ...S.btn, background: '#0984e3', color: 'white' }}
            onClick={() => {
              const list = val === 'bot' ? ['green', 'yellow'] : ['green', 'yellow', 'red', 'blue'].slice(0, +val);
              setMode(val);
              setPlayers(list);
              setTurn('green');
              setWinner(null);
              setDice(null);
              setPositions({
                green: [0, 0, 0, 0],
                yellow: [0, 0, 0, 0],
                red: [0, 0, 0, 0],
                blue: [0, 0, 0, 0],
              });
            }}
          >{label}</button>
        ))}
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <h3 style={{ color: COLORS[turn] }}>
        {winner ? `${winner.toUpperCase()} Wins! 🏆` : `Turn: ${turn.toUpperCase()}`}
      </h3>

      <div style={S.board}>
        {[...Array(SIZE * SIZE)].map((_, i) => {
          const r = Math.floor(i / SIZE);
          const c = i % SIZE;
          return <div key={i} style={{ background: cellColor(r, c), border: '1px solid #444' }} />;
        })}

        {players.map(player =>
          positions[player].map((steps, i) => {
            if (steps < 0 || steps > WIN_POS) return null;
            const idx = (OFFSET[player] + steps) % 56;
            const { r, c } = PATH[idx];
            return (
              <motion.div
                key={`${player}-${i}`}
                whileHover={{ scale: turn === player && dice ? 1.1 : 1 }}
                onClick={() => move(player, i)}
                style={{
                  ...S.token,
                  background: COLORS[player],
                  top: r * PX + PX * 0.2,
                  left: c * PX + PX * 0.2,
                  cursor: turn === player && dice ? 'pointer' : 'not-allowed'
                }}
              />
            );
          })
        )}
      </div>

      <motion.button
        whileTap={{ scale: 0.9 }}
        style={{ ...S.btn, background: COLORS[turn], color: 'white' }}
        onClick={roll}
      >
        {dice ? `🎲 Rolled ${dice}` : 'Roll Dice'}
      </motion.button>

      <button
        style={{ ...S.btn, background: '#d63031', color: 'white' }}
        onClick={() => setMode(null)}
      >🔙 Back</button>
    </div>
  );
}

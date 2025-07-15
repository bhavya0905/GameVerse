// frontend/src/games/RockPaperScissors.jsx
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL); // e.g. "http://localhost:3000"
const CHOICES = ['Rock', 'Paper', 'Scissors'];

export default function RockPaperScissors() {
  const [roomId, setRoomId]       = useState('');
  const [joined, setJoined]       = useState(false);
  const [opponentReady, setOpp]   = useState(false);
  const [myChoice, setMyChoice]   = useState(null);
  const [oppChoice, setOppChoice] = useState(null);
  const [result, setResult]       = useState('');

  /* ── socket listeners ── */
  useEffect(() => {
    socket.on('player-role', () => setJoined(true));
    socket.on('opponent-joined', () => setOpp(true));

    socket.on('rps-result', ({ yourChoice, theirChoice, outcome }) => {
      setMyChoice(yourChoice);
      setOppChoice(theirChoice);
      setResult(
        outcome === 'draw'
          ? 'It’s a draw!'
          : outcome === 'You'
          ? '🎉 You win!'
          : 'Opponent wins!'
      );
    });

    socket.on('opponent-left', resetAll);

    return () => {
      socket.off('player-role');
      socket.off('opponent-joined');
      socket.off('rps-result');
      socket.off('opponent-left');
    };
  }, []);

  /* ── helpers ── */
  function resetAll() {
    setMyChoice(null);
    setOppChoice(null);
    setResult('');
    setOpp(false);
    // Don’t leave the room; players can continue rounds
  }

  function joinRoom() {
    const id = roomId.trim().toUpperCase();
    if (!id) return;
    socket.emit('join-room', id);
  }

  function sendChoice(choice) {
    socket.emit('rps-choice', { roomId: roomId.trim().toUpperCase(), choice });
    setMyChoice(choice);
  }

  /* ── UI ── */
  return (
    <div style={styles.wrap}>
      <h2>🪨 📄 ✂️ Rock Paper Scissors</h2>

      {!joined ? (
        <>
          <input
            style={styles.input}
            placeholder="Enter ROOM ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button style={styles.btn} onClick={joinRoom}>
            Join Room
          </button>
        </>
      ) : !opponentReady ? (
        <p>Waiting for opponent…</p>
      ) : !myChoice ? (
        <>
          <p>Select your move:</p>
          <div style={styles.choiceRow}>
            {CHOICES.map((c) => (
              <button
                key={c}
                style={styles.choiceBtn}
                onClick={() => sendChoice(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <h3>
            You chose: <span style={{ color: '#00cec9' }}>{myChoice}</span>
          </h3>
          <h3>
            Opponent chose:{' '}
            <span style={{ color: '#ff7675' }}>{oppChoice || '…'}</span>
          </h3>
          {result && <h2 style={{ marginTop: 10 }}>{result}</h2>}
          <button style={styles.btn} onClick={resetAll}>
            Play Again
          </button>
        </>
      )}
    </div>
  );
}

/* ── simple inline styles ── */
const styles = {
  wrap: {
    minHeight: '100vh',
    background: '#1e272e',
    color: '#f5f6fa',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    padding: 20,
  },
  input: {
    padding: '10px 14px',
    fontSize: '1rem',
    borderRadius: 6,
    border: '1px solid #ccc',
    marginBottom: 10,
    width: 200,
    textTransform: 'uppercase',
  },
  btn: {
    padding: '10px 18px',
    fontSize: '1rem',
    background: '#00cec9',
    border: 'none',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#2d3436',
    marginTop: 6,
  },
  choiceRow: { display: 'flex', gap: '1rem', marginTop: 16 },
  choiceBtn: {
    padding: '1rem 1.4rem',
    fontSize: '1.1rem',
    background: '#2f3640',
    color: '#fff',
    border: '2px solid #00cec9',
    borderRadius: 8,
    cursor: 'pointer',
    width: 110,
  },
};

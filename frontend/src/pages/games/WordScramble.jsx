// File: src/games/WordScramble.jsx

import React, { useEffect, useState } from 'react';

const WORDS = ["apple", "banana", "orange", "grapes", "cherry", "mango", "peach", "lemon", "melon", "guava"];

function scramble(word) {
  return word.split('').sort(() => Math.random() - 0.5).join('');
}

export default function WordScramble() {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambled, setScrambled] = useState('');
  const [input, setInput] = useState('');
  const [turn, setTurn] = useState(1);
  const [scores, setScores] = useState({ 1: 0, 2: 0 });
  const [message, setMessage] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    generateNewWord();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          handleTimeUp();
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [turn, gameOver]);

  const generateNewWord = () => {
    const word = WORDS[Math.floor(Math.random() * WORDS.length)];
    setCurrentWord(word);
    setScrambled(scramble(word));
    setInput('');
    setMessage('');
    setTimer(20);
  };

  const handleSubmit = () => {
    if (gameOver || input.trim() === '') return;

    if (input.trim().toLowerCase() === currentWord) {
      setScores((prev) => {
        const updated = { ...prev, [turn]: prev[turn] + 1 };
        if (updated[turn] >= 5) {
          setGameOver(true);
          setMessage(`🎉 Congratulations Player ${turn}, you win! 🎉`);
        } else {
          setMessage(`✅ Correct! Player ${turn} +1`);
        }
        return updated;
      });
    } else {
      setMessage(`❌ Wrong! Correct was: ${currentWord}`);
    }

    setTimeout(() => {
      setTurn(turn === 1 ? 2 : 1);
      generateNewWord();
    }, 1200);
  };

  const handleTimeUp = () => {
    setMessage(`⏰ Time's up! Correct was: ${currentWord}`);
    setTimeout(() => {
      setTurn(turn === 1 ? 2 : 1);
      generateNewWord();
    }, 1200);
  };

  const handleRestart = () => {
    setScores({ 1: 0, 2: 0 });
    setTurn(1);
    setGameOver(false);
    setTimer(20);
    generateNewWord();
  };

  return (
    <div style={styles.container}>
      <h2>🔤 Word Scramble</h2>
      <h3 style={{ color: '#fdcb6e' }}>
        {gameOver ? message : `⏱️ ${timer}s | Turn: Player ${turn}`}
      </h3>

      {!gameOver && <h1 style={styles.scrambled}>{scrambled}</h1>}

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        disabled={gameOver || timer <= 0}
        placeholder="Your guess..."
        style={styles.input}
      />

      <button
        style={styles.button}
        onClick={handleSubmit}
        disabled={gameOver || timer <= 0}
      >
        Submit
      </button>

      {message && !gameOver && <p style={{ marginTop: 10 }}>{message}</p>}

      <div style={styles.scoreBox}>
        <p>🟢 Player 1: {scores[1]}</p>
        <p>🔵 Player 2: {scores[2]}</p>
      </div>

      {gameOver && (
        <button onClick={handleRestart} style={{ ...styles.button, background: '#00b894', marginTop: 20 }}>
          🔁 Play Again
        </button>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '3rem',
    background: '#2d3436',
    color: 'white',
    padding: '2rem',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '400px',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: '0 0 20px rgba(255,255,255,0.2)'
  },
  scrambled: {
    fontSize: '2.5rem',
    letterSpacing: '0.2em',
    margin: '1rem 0',
    color: '#ffeaa7'
  },
  input: {
    padding: '0.6rem',
    fontSize: '1.1rem',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '80%',
    maxWidth: '250px'
  },
  button: {
    marginTop: '1rem',
    padding: '0.6rem 1.2rem',
    fontSize: '1rem',
    borderRadius: '6px',
    border: 'none',
    background: '#0984e3',
    color: 'white',
    cursor: 'pointer'
  },
  scoreBox: {
    marginTop: '1.5rem',
    fontSize: '1.1rem'
  }
};

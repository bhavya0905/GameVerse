// src/games/SpeedMath.jsx
import React, { useState, useEffect, useRef } from 'react';

const DIFFICULTY_RANGES = {
  Easy: [1, 9],
  Medium: [10, 99],
  Hard: [100, 999],
};

const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const generateQuestion = (difficulty) => {
  const [min, max] = DIFFICULTY_RANGES[difficulty];
  const a = getRandomInt(min, max);
  const b = getRandomInt(min, max);
  const ops = ['+', '-', '*'];
  const op = ops[Math.floor(Math.random() * ops.length)];
  let answer;

  switch (op) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '*': answer = a * b; break;
    default: answer = a + b;
  }
  return { question: `${a} ${op} ${b}`, answer };
};

function SpeedMath() {
  const [difficulty, setDifficulty] = useState('Easy');
  const [currentQ, setCurrentQ] = useState(generateQuestion('Easy'));
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('speedMathHighScore')) || 0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [currentQ]);

  useEffect(() => {
    if (!gameStarted) return;

    if (timeLeft <= 0) {
      setGameOver(true);
      setGameStarted(false);
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('speedMathHighScore', score);
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameStarted]);

  const handleAnswer = (e) => {
    e.preventDefault();
    if (parseInt(input) === currentQ.answer) {
      setScore(score + 1);
    }
    setInput('');
    setCurrentQ(generateQuestion(difficulty));
  };

  const startGame = () => {
    setGameOver(false);
    setScore(0);
    setTimeLeft(60);
    setCurrentQ(generateQuestion(difficulty));
    setInput('');
    setGameStarted(true);

    const music = document.getElementById('bg-music');
    if (music) music.play();
  };

  const restartGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameOver(false);
    setCurrentQ(generateQuestion(difficulty));
    setInput('');
    setGameStarted(true);

    const music = document.getElementById('bg-music');
    if (music) music.play();
  };

  return (
    <div style={{
      textAlign: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      marginTop: 40,
      backgroundColor: '#121212',
      color: '#FF5252',
      minHeight: '100vh',
      padding: 20
    }}>
      <h1 style={{ fontSize: 42, marginBottom: 20 }}>⚡ Speed Math</h1>

      <audio id="bg-music" loop>
        <source src="https://cdn.pixabay.com/download/audio/2022/03/15/audio_f6a524c2cb.mp3" type="audio/mpeg" />
      </audio>

      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8, fontSize: 18 }}>Select Difficulty:</label>
        <select
          value={difficulty}
          onChange={e => setDifficulty(e.target.value)}
          disabled={!gameOver ? true : false}
          style={{
            fontSize: 16,
            padding: '6px 12px',
            backgroundColor: '#1E1E1E',
            color: '#FF5252',
            border: '1px solid #FF5252',
            borderRadius: 6
          }}
        >
          {Object.keys(DIFFICULTY_RANGES).map(level => (
            <option key={level}>{level}</option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: 20, marginBottom: 6 }}>⏳ Time Left: {timeLeft}s</div>
      <div style={{ fontSize: 18, marginBottom: 6 }}>🎯 Score: {score}</div>
      <div style={{ fontSize: 18, marginBottom: 16 }}>🏆 High Score: {highScore}</div>

      {!gameStarted ? (
        <button
          onClick={startGame}
          style={{
            padding: '10px 20px',
            fontSize: 18,
            marginBottom: 20,
            backgroundColor: '#FF5252',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            cursor: 'pointer'
          }}
        >
          Start Game
        </button>
      ) : !gameOver ? (
        <>
          <form onSubmit={handleAnswer}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{currentQ.question}</div>
            <input
              ref={inputRef}
              type="number"
              value={input}
              onChange={e => setInput(e.target.value)}
              style={{
                fontSize: 24,
                padding: 8,
                width: 120,
                borderRadius: 6,
                border: '2px solid #FF5252',
                backgroundColor: '#1E1E1E',
                color: '#fff'
              }}
            />
            <button
              type="submit"
              style={{
                marginLeft: 12,
                fontSize: 20,
                padding: '8px 16px',
                backgroundColor: '#FF1744',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Go
            </button>
          </form>
          <div style={{ marginTop: 20 }}>
            <button
              onClick={restartGame}
              style={{
                padding: '8px 20px',
                fontSize: 16,
                backgroundColor: '#FF5252',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer'
              }}
            >
              Reset
            </button>
          </div>
        </>
      ) : (
        <div>
          <h2>🎉 Time's Up!</h2>
          <p>Your Score: <strong>{score}</strong></p>
          <button
            onClick={restartGame}
            style={{
              padding: '10px 20px',
              fontSize: 16,
              backgroundColor: '#FF5252',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              cursor: 'pointer'
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

export default SpeedMath;

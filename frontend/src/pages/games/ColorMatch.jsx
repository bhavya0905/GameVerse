import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const baseColors = ['#f87171', '#60a5fa', '#34d399', '#fbbf24', '#a78bfa', '#f472b6', '#fb7185', '#38bdf8'];

function shuffle(colors) {
  const shuffled = [...colors, ...colors];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.map((color, idx) => ({ id: idx, color, flipped: false, matched: false }));
}

export default function ColorMatch() {
  const [difficulty, setDifficulty] = useState('easy');
  const [cards, setCards] = useState([]);
  const [firstCard, setFirstCard] = useState(null);
  const [secondCard, setSecondCard] = useState(null);
  const [matches, setMatches] = useState(0);
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  const successSound = "https://cdn.pixabay.com/audio/2022/03/15/audio_1fd929b6f3.mp3";
  const failSound = "https://cdn.pixabay.com/audio/2022/03/15/audio_69a0cc2269.mp3";
  const winSound = "https://www.fesliyanstudios.com/play-mp3/387";

  const playSound = (url) => {
    const audio = new Audio(url);
    audio.play();
  };

  const getColorsByDifficulty = () => {
    if (difficulty === 'easy') return baseColors.slice(0, 4);
    if (difficulty === 'hard') return baseColors.slice(0, 8);
    return baseColors.slice(0, 6);
  };

  const resetGame = () => {
    const chosenColors = getColorsByDifficulty();
    setCards(shuffle(chosenColors));
    setFirstCard(null);
    setSecondCard(null);
    setMatches(0);
    setDisabled(false);
    setTimeLeft(60);
    setGameOver(false);
  };

  useEffect(() => {
    resetGame();
  }, [difficulty]);

  useEffect(() => {
    if (firstCard && secondCard) {
      setDisabled(true);
      if (firstCard.color === secondCard.color) {
        setCards(prev =>
          prev.map(card =>
            card.color === firstCard.color ? { ...card, matched: true } : card
          )
        );
        setMatches(prev => prev + 1);
        playSound(successSound);
        resetTurn();
      } else {
        playSound(failSound);
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, flipped: false }
                : card
            )
          );
          resetTurn();
        }, 800);
      }
    }
  }, [firstCard, secondCard]);

  const resetTurn = () => {
    setFirstCard(null);
    setSecondCard(null);
    setDisabled(false);
  };

  const handleCardClick = (card) => {
    if (disabled || card.flipped || card.matched || gameOver) return;
    setCards(prev =>
      prev.map(c =>
        c.id === card.id ? { ...c, flipped: true } : c
      )
    );
    firstCard ? setSecondCard(card) : setFirstCard(card);
  };

  useEffect(() => {
    if (matches === getColorsByDifficulty().length) {
      playSound(winSound);
      setGameOver(true);
    }
  }, [matches, difficulty]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (timeLeft > 0 && !gameOver) {
        setTimeLeft(prev => prev - 1);
      } else if (timeLeft === 0) {
        setGameOver(true);
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  const totalPairs = getColorsByDifficulty().length;

  const getGridColumns = () => {
    if (difficulty === 'easy') return 'repeat(4, 1fr)';
    if (difficulty === 'hard') return 'repeat(4, 1fr)';
    return 'repeat(4, 1fr)';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom, #111827, #1f2937)',
      color: 'white',
      padding: '2rem',
      textAlign: 'center',
      fontFamily: 'sans-serif',
    }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: '#fbbf24' }}>
        🎨 Color Match
      </h2>

      {/* Difficulty Selector */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ marginRight: '0.5rem' }}>Difficulty:</label>
        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          style={{
            padding: '0.4rem',
            borderRadius: '5px',
            border: 'none',
            backgroundColor: '#f87171',
            color: 'white',
            fontWeight: 'bold'
          }}
        >
          <option value="easy">Easy (4 pairs)</option>
          <option value="medium">Medium (6 pairs)</option>
          <option value="hard">Hard (8 pairs)</option>
        </select>
      </div>

      {/* Timer Bar */}
      <div style={{ margin: '1rem auto', maxWidth: '600px' }}>
        <div style={{
          height: '20px',
          width: '100%',
          backgroundColor: '#374151',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #555'
        }}>
          <motion.div
            animate={{
              width: `${(timeLeft / 60) * 100}%`,
              backgroundColor:
                timeLeft > 40 ? '#4ade80' :
                timeLeft > 20 ? '#facc15' :
                '#f87171'
            }}
            transition={{ duration: 0.5 }}
            style={{
              height: '100%',
              borderRadius: '10px',
            }}
          />
        </div>
        <div style={{ color: '#d1d5db', marginTop: '0.25rem', fontSize: '0.9rem' }}>
          ⏳ {timeLeft}s left
        </div>
      </div>

      <p style={{ marginBottom: '1rem', color: '#d1d5db' }}>
        Match all the color pairs!
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: getGridColumns(),
        gap: '1rem',
        maxWidth: '600px',
        margin: '0 auto 2rem',
        justifyContent: 'center'
      }}>
        {cards.map(card => (
          <motion.div
            key={card.id}
            onClick={() => handleCardClick(card)}
            initial={false}
            animate={{ rotateY: card.flipped || card.matched ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            style={{
              width: '80px',
              height: '80px',
              backgroundColor: card.flipped || card.matched ? card.color : '#1f2937',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
              cursor: 'pointer',
              transformStyle: 'preserve-3d',
              transform: `rotateY(${card.flipped || card.matched ? 180 : 0}deg)`,
              border: card.matched ? '3px solid #22c55e' : '2px solid #444',
            }}
          />
        ))}
      </div>

      <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
        Matches: <strong>{matches}</strong> / {totalPairs}
      </p>

      {matches === totalPairs && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '1.25rem', color: '#4ade80', marginBottom: '1rem' }}
        >
          🎉 Congratulations! You matched all colors!
        </motion.div>
      )}

      {timeLeft === 0 && !gameOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ fontSize: '1.25rem', color: '#f87171', marginBottom: '1rem' }}
        >
          ❌ Time's up! Try again.
        </motion.div>
      )}

      <button
        onClick={resetGame}
        style={{
          backgroundColor: '#f87171',
          color: 'white',
          padding: '0.5rem 1.5rem',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        🔁 Play Again
      </button>
    </div>
  );
}

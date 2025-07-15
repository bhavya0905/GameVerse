import { useEffect, useState } from 'react';

const themes = {
  Fruits: ['🍎', '🍌', '🍇', '🍉', '🍍', '🍒', '🥝', '🍓', '🍋', '🥭', '🍑', '🍊', '🍐', '🥥', '🫐', '🍈', '🍅', '🌽'],
  Animals: ['🐶', '🐱', '🐭', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦄', '🐙'],
  Games: ['🎮', '🕹️', '🎲', '♟️', '🧩', '🎯', '🃏', '🎰', '🏆', '🧱', '⚽', '🏹', '🥏', '🏒', '🛹', '🚀', '🪙', '🎳']
};

const difficulties = {
  Easy: { rows: 4, cols: 4 },
  Medium: { rows: 5, cols: 4 },
  Hard: { rows: 6, cols: 6 },
};

function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 🎵 Simple browser-generated win sound
function playWinSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.type = 'triangle';
  oscillator.frequency.setValueAtTime(660, ctx.currentTime);
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start();
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1);
  oscillator.stop(ctx.currentTime + 1);
}

export default function MemoryFlip() {
  const [difficulty, setDifficulty] = useState('Easy');
  const [theme, setTheme] = useState('Fruits');
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState([]);
  const [matched, setMatched] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    generateBoard();
  }, [difficulty, theme]);

  const generateBoard = () => {
    const { rows, cols } = difficulties[difficulty];
    const totalPairs = (rows * cols) / 2;
    const selectedEmojis = shuffle(themes[theme]).slice(0, totalPairs);
    const allCards = shuffle([...selectedEmojis, ...selectedEmojis]).map((emoji, index) => ({
      id: index,
      emoji,
    }));

    setCards(allCards);
    setFlipped([]);
    setMatched([]);
    setMoves(0);
    setWon(false);
    setShowConfetti(false);
  };

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) return;

    const newFlipped = [...flipped, index];
    setFlipped(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((prev) => prev + 1);
      const [i, j] = newFlipped;
      if (cards[i].emoji === cards[j].emoji) {
        setMatched((prev) => [...prev, i, j]);
        setFlipped([]);
      } else {
        setTimeout(() => setFlipped([]), 800);
      }
    }
  };

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      setWon(true);
      setShowConfetti(true);
      playWinSound();
    }
  }, [matched]);

  const { rows, cols } = difficulties[difficulty];

  const styles = {
    container: {
      textAlign: 'center',
      fontFamily: 'Segoe UI, sans-serif',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    },
    options: {
      marginBottom: '20px',
    },
    select: {
      padding: '8px 12px',
      margin: '0 10px',
      borderRadius: '6px',
      fontSize: '16px',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: `repeat(${cols}, 60px)`,
      gridGap: '12px',
      justifyContent: 'center',
      marginTop: '20px',
    },
    card: {
      width: '60px',
      height: '60px',
      cursor: 'pointer',
      perspective: '1000px',
    },
    inner: {
      width: '100%',
      height: '100%',
      transition: 'transform 0.5s ease',
      transformStyle: 'preserve-3d',
      position: 'relative',
    },
    flipped: {
      transform: 'rotateY(180deg)',
    },
    face: {
      position: 'absolute',
      width: '100%',
      height: '100%',
      fontSize: '26px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      backfaceVisibility: 'hidden',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
    },
    front: {
      background: '#0ea5e9',
      color: 'white',
    },
    back: {
      background: '#f1f5f9',
      transform: 'rotateY(180deg)',
    },
    resetBtn: {
      marginTop: '20px',
      padding: '10px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '8px',
      backgroundColor: '#0ea5e9',
      color: 'white',
      cursor: 'pointer',
    },
    congrats: {
      fontSize: '20px',
      color: 'green',
      margin: '15px 0',
    },
    confetti: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      pointerEvents: 'none',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      animation: 'fadeout 2s ease-out forwards',
    },
    emoji: {
      fontSize: '2rem',
      animation: 'fall 1s ease-out',
      margin: '2px',
    },
  };

  return (
    <div style={styles.container}>
      <h2>🧠 Memory Flip Game</h2>

      <div style={styles.options}>
        <label>
          Difficulty:
          <select style={styles.select} value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
            {Object.keys(difficulties).map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </label>
        <label>
          Theme:
          <select style={styles.select} value={theme} onChange={(e) => setTheme(e.target.value)}>
            {Object.keys(themes).map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </label>
      </div>

      <p>Moves: {moves}</p>

      {won && <div style={styles.congrats}>🎉 You Won in {moves} Moves! 🎉</div>}

      <div style={styles.grid}>
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index);
          return (
            <div key={card.id} style={styles.card} onClick={() => handleCardClick(index)}>
              <div style={{ ...styles.inner, ...(isFlipped ? styles.flipped : {}) }}>
                <div style={{ ...styles.face, ...styles.front }}>❓</div>
                <div style={{ ...styles.face, ...styles.back }}>{card.emoji}</div>
              </div>
            </div>
          );
        })}
      </div>

      <button onClick={generateBoard} style={styles.resetBtn}>🔁 Reset Game</button>

      {showConfetti && (
        <div style={styles.confetti}>
          {Array.from({ length: 50 }, (_, i) => (
            <div key={i} style={styles.emoji}>
              {['🎉', '✨', '🎊', '💥'][i % 4]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Explore() {
  const navigate = useNavigate();

  // Categorized games
  const categories = {
    'Single Player Games': [
      'Maze Runner',
      'Color Match',
      'Number Puzzle',
      'Tower Blocks',
      'Brick Breaker',
      '2048 Merge',
      'Sudoku Master',
      'Ball Bounce',
      'Memory Flip',
      'Snake Classic',
      'Dot Connect',
      'Speed Math',
    ],
    'Multiplayer Games': [
      'Online Chess',
      'Trivia Duel',
      'Space Race',
      'Word War',
      'Ludo',
      'Tic Tac Toe',
      'Rock Paper Scissors',
      'Word Scramble',
    ],
    'Trending Now': [
      'Alien Hunt',
      'Cyber Jump',
      'Glitch Dash',
      'Zombie Escape',
      'Speed Runner',
      'Neon Drift',
      'Fruit Merge',
      'Pixel Invaders',
    ],
  };

  const gameRoutes = {
    // Single Player
    'Maze Runner': '/game/maze-runner',
    'Color Match': '/game/color-match',
    'Number Puzzle': '/game/number-puzzle',
    'Tower Blocks': '/game/tower-blocks',
    'Brick Breaker': '/game/brick-breaker',
    '2048 Merge': '/game/merge-2048',
    'Sudoku Master': '/game/sudoku-master',
    'Ball Bounce': '/game/ball-bounce',
    'Memory Flip': '/game/memory-flip',
    'Snake Classic': '/game/snake-classic',
    'Dot Connect': '/game/dot-connect',
    'Speed Math': '/game/speed-math',

    // Multiplayer
    'Online Chess': '/game/chess-board',
    'Trivia Duel': '/game/trivia-duel',
    'Space Race': '/game/space-race',
    'Word War': '/game/word-war',
    'Ludo': '/game/ludo-arena',
    'Tic Tac Toe': '/game/tic-tac-toe',
    'Rock Paper Scissors': '/game/rock-paper-scissors',
    'Word Scramble': '/game/word-scramble',

    // Trending
    'Alien Hunt': '/game/alien-hunt',
    'Cyber Jump': '/game/cyber-jump',
    'Glitch Dash': '/game/glitch-dash',
    'Zombie Escape': '/game/zombie-escape',
    'Speed Runner': '/game/speed-runner',
    'Neon Drift': '/game/neon-drift',
    'Fruit Merge': '/game/fruit-merge',
    'Pixel Invaders': '/game/pixel-invaders',
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #000000, #0f0f0f, #1a0000)',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: '2rem',
      }}
    >
      <h2
        style={{
          textAlign: 'center',
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#f87171',
          marginBottom: '2.5rem',
        }}
      >
        🎯 Explore the Arena
      </h2>

      {Object.entries(categories).map(([category, games]) => (
        <div key={category} style={{ marginBottom: '3rem' }}>
          <h3
            style={{
              fontSize: '1.8rem',
              color: '#facc15',
              marginBottom: '1.5rem',
              borderBottom: '1px solid #333',
              paddingBottom: '0.5rem',
            }}
          >
            {category}
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {games.map((game, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                style={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #7f1d1d',
                  borderRadius: '10px',
                  padding: '1.5rem',
                  textAlign: 'center',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
                }}
              >
                <h4 style={{ fontSize: '1.3rem', marginBottom: '0.75rem' }}>{game}</h4>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: gameRoutes[game] ? 'pointer' : 'not-allowed',
                    opacity: gameRoutes[game] ? 1 : 0.6,
                    fontWeight: 'bold',
                  }}
                  onClick={() => {
                    if (gameRoutes[game]) {
                      navigate(gameRoutes[game]);
                    } else {
                      alert('Coming soon!');
                    }
                  }}
                >
                  ▶ Play Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

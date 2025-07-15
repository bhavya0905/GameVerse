import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function SinglePlayer() {
  const navigate = useNavigate();

  const games = [
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
  ];

  const gameRoutes = {
    'Maze Runner': '/game/maze-runner',
    'Color Match': '/games/color-match',
    'Number Puzzle': '/game/number-puzzle',
    'Tower Blocks': '/games/tower-blocks',
    'Brick Breaker': '/games/brick-breaker',
    '2048 Merge': '/games/2048',
    'Sudoku Master': '/games/sudoku-master',
    'Ball Bounce': '/games/ball-bounce',
    'Memory Flip': '/games/memory-flip',
    'Snake Classic': '/games/snake-classic',
    'Dot Connect': '/games/dot-connect',
    'Speed Math': '/games/speed-math',

  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #000000, #0f0f0f, #1a0000)',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: '2rem',
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          textAlign: 'center',
          color: '#f87171',
        }}
      >
        🎮 Single Player Games
      </h2>
      <p style={{ textAlign: 'center', color: '#d1d5db', marginBottom: '2rem' }}>
        Challenge yourself and beat your own high score. One player, endless possibilities.
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          justifyItems: 'center',
        }}
      >
        {games.map((game, index) => (
          <motion.div
            key={index}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #7f1d1d',
              borderRadius: '0.75rem',
              width: '100%',
              maxWidth: '300px',
              height: '180px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.2rem',
              fontWeight: '500',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
              textAlign: 'center',
              transition: 'all 0.3s ease',
            }}
            whileHover={{ scale: 1.05 }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
              e.currentTarget.style.color = 'black';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#1a1a1a';
              e.currentTarget.style.color = 'white';
            }}
          >
            {game}
            <button
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (gameRoutes[game]) {
                  navigate(gameRoutes[game]);
                } else {
                  alert(`Launching ${game}... Coming soon!`);
                }
              }}
            >
              ▶ Play Now
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

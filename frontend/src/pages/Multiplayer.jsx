import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Multiplayer() {
  const games = [
    { name: 'Online chess', path: '/games/online-chess'},
    { name: 'Trivia Duel', path: '/games/trivia-duel' },
    { name: 'Space Race', path: '/games/space-race' },
    { name: 'Word War', path: '/games/word-war' },
    { name: 'Ludo', path: '/games/ludo' },
    { name: 'Tic Tac Toe', path: '/games/tic-tac-toe' },
    { name: 'Rock Paper Scissors', path: '/games/rock-paper-scissors' },
    { name: 'Word Scramble', path: '/games/word-scramble' },
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #000000, #0f0f0f, #1a0000)',
        color: 'white',
        fontFamily: 'sans-serif',
        padding: '3rem 2rem',
        boxSizing: 'border-box',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          color: '#f87171',
          marginBottom: '0.3rem',
          textAlign: 'center',
        }}
      >
        👫 Multiplayer Games
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#d1d5db',
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}
      >
        Challenge your friends or join matches with players across the globe!
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '2rem',
        }}
      >
        {games.map((game, index) => (
          <motion.div
            key={index}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #7f1d1d',
              borderRadius: '0.75rem',
              padding: '2rem',
              boxShadow: '0 2px 5px rgba(0,0,0,0.5)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '180px',
            }}
            whileHover={{ scale: 1.05 }}
          >
            <h3
              style={{
                fontSize: '1.3rem',
                color: 'white',
                marginBottom: '1.5rem',
              }}
            >
              {game.name}
            </h3>
            <Link to={game.path}>
              <button
                style={{
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
              >
                ▶ Play Now
              </button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

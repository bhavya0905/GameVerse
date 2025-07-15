import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Trending() {
  const trendingGames = [
    { name: 'Alien Hunt', path: '/games/alien-hunt' },
    { name: 'Cyber Jump', path: '/games/cyber-jump' },
    { name: 'Glitch Dash', path: '/games/glitch-dash' },
    { name: 'Zombie Escape', path: '/games/zombie-escape' },
    { name: 'Speed Runner', path: '/games/speed-runner' },
    { name: 'Neon Drift', path: '/games/neon-drift' },
    { name: 'Fruit Merge', path: '/games/fruit-merge'},
    { name: 'Pixel Invaders', path: '/games/pixel-invaders' },
  ];

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
          marginBottom: '2rem',
        }}
      >
        🔥 Trending Games
      </h2>
      <p
        style={{
          fontSize: '1.1rem',
          color: '#d1d5db',
          textAlign: 'center',
          marginBottom: '2.5rem',
        }}
      >
        Dive into the hottest and most-played games right now!
      </p>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          justifyItems: 'center',
        }}
      >
        {trendingGames.map((game, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #7f1d1d',
              borderRadius: '10px',
              padding: '2rem',
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.5)',
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{game.name}</h3>
            <Link to={game.path}>
              <button
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
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

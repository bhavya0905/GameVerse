import { motion } from 'framer-motion';

export default function Forums() {
  const categories = [
    {
      name: 'General Discussion',
      description: 'Talk about anything related to gaming, tech, or the platform!',
    },
    {
      name: 'Bug Reports',
      description: 'Found a bug? Let us know here so we can fix it fast!',
    },
    {
      name: 'Game Suggestions',
      description: 'Have ideas for new games or improvements? Share them!',
    },
    {
      name: 'Multiplayer Matchmaking',
      description: 'Looking for friends to play with? Post your game ID!',
    },
    {
      name: 'Announcements',
      description: 'Official updates, release notes, and news from the GameVerse team.',
    },
  ];

  return (
    <div
      style={{
        backgroundColor: '#0f0f0f',
        color: '#fff',
        minHeight: '100vh',
        padding: '2rem 1rem',
        fontFamily: 'sans-serif',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          fontSize: '2.5rem',
          textAlign: 'center',
          marginBottom: '1rem',
        }}
      >
        Community Forums
      </motion.h1>

      <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '2rem' }}>
        Join discussions, get help, and be a part of the GameVerse community.
      </p>

      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          display: 'grid',
          gap: '1.5rem',
        }}
      >
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            style={{
              background: '#1a1a1a',
              padding: '1.5rem',
              borderRadius: '1rem',
              border: '1px solid #2e2e2e',
              boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <h2 style={{ fontSize: '1.5rem', color: '#60a5fa', marginBottom: '0.5rem' }}>
              {cat.name}
            </h2>
            <p style={{ color: '#d1d5db' }}>{cat.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

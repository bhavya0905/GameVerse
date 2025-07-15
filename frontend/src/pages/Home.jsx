import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const sections = [
    {
      title: '🎮 Single Player Games',
      games: [
        'Maze Runner',
        'Color Match',
        'Number Puzzle',
        'Tower Blocks',
        'Brick Breaker',
        '2048 Merge',
        'Sudoku Master',
        'Ball Bounce',
      ],
      path: '/single-player',
    },
    {
      title: '👫 Multiplayer Games',
      games: [
        'Online Chess',
        'Trivia Duel',
        'Space Race',
        'Word War',
        'Ludo',
        'Tic Tac Toe',
        'Rock Paper Scissors',
      ],
      path: '/multiplayer',
    },
    {
      title: '🔥 Trending Now',
      games: [
        'Alien Hunt',
        'Cyber Jump',
        'Glitch Dash',
        'Zombie Escape',
        'Speed Runner',
        'Neon Drift',
        'Fruit Merge',
        'Pixel Invaders',
      ],
      path: '/trending',
    },
  ];

  const gameRoutes = {

    // Single Player Games
    'Maze Runner': '/game/maze-runner',
    'Color Match': '/game/color-match',
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

    // Multi Player Games
    'Online Chess': '/games/online-chess',
    'Trivia Duel': '/games/trivia-duel',
    'Space Race': '/games/space-race',
    'Word War': '/games/word-war',
    'Ludo': '/games/ludo',
    'Tic Tac Toe': '/games/tic-tac-toe',
    'Rock Paper Scissors': '/games/rock-paper-scissors',
    'Word Scramble': '/games/word-scramble',
    
    // Trending Now Games
    'Alien Hunt': '/games/alien-hunt',
    'Cyber Jump': '/games/cyber-jump',
    'Glitch Dash': '/games/glitch-dash' ,
    'Zombie Escape': '/games/zombie-escape',
    'Speed Runner': '/games/speed-runner',
    'Neon Drift': '/games/neon-drift',
    'Fruit Merge': '/games/fruit-merge',
    'Pixel Invaders': '/games/pixel-invaders',
  };

  const allGames = sections.flatMap((section) => section.games);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom, #000000, #0f0f0f, #1a0000)',
        color: 'white',
        fontFamily: 'sans-serif',
        overflowX: 'hidden',
        margin: 0,
        padding: 0,
        boxSizing: 'border-box',
      }}
    >
      {/* Welcome Banner */}
      <motion.div
        style={{ textAlign: 'center', padding: '3rem 1rem', color: '#f87171' }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h2 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
          Welcome to GameVerse
        </h2>
        <p style={{ fontSize: '1.125rem', color: '#d1d5db' }}>Your Ultimate Gaming Hub!</p>
      </motion.div>

      {/* Explore the Arena */}
      <div style={{ marginTop: '2rem', padding: '0 2rem' }}>
        <h3
          onClick={() => navigate('/explore')}
          style={{
            fontSize: '1.5rem',
            fontWeight: '600',
            color: '#f87171',
            borderBottom: '2px solid #b91c1c',
            paddingBottom: '0.5rem',
            cursor: 'pointer',
          }}
        >
          🎯 Explore the Arena
        </h3>
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            paddingBottom: '1rem',
            marginTop: '1rem',
            gap: '1.5rem',
          }}
        >
          {allGames.map((game, index) => (
            <motion.div
              key={index}
              style={{
                minWidth: '200px',
                height: '120px',
                backgroundColor: '#1a1a1a',
                border: '1px solid #7f1d1d',
                borderRadius: '0.5rem',
                boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '1.125rem',
                fontWeight: '500',
                cursor: 'pointer',
              }}
              whileHover={{ scale: 1.08 }}
              onClick={() => {
                if (gameRoutes[game]) {
                  navigate(gameRoutes[game]);
                } else {
                  alert('Coming soon!');
                }
              }}
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
            </motion.div>
          ))}
        </div>
      </div>

      {/* Game Sections */}
      <div style={{ marginTop: '2.5rem', padding: '0 2rem' }}>
        {sections.map((section, idx) => (
          <div key={idx} style={{ marginBottom: '3rem' }}>
            <h3
              style={{
                fontSize: '1.5rem',
                fontWeight: '600',
                marginBottom: '1rem',
                color: '#f87171',
                borderBottom: '2px solid #b91c1c',
                paddingBottom: '0.5rem',
                cursor: 'pointer',
              }}
              onClick={() => navigate(section.path)}
            >
              {section.title}
            </h3>
            <div
              style={{
                display: 'flex',
                overflowX: 'auto',
                whiteSpace: 'nowrap',
                paddingBottom: '0.5rem',
                gap: '1.5rem',
              }}
            >
              {section.games.map((game, index) => (
                <motion.div
                  key={index}
                  style={{
                    minWidth: '200px',
                    height: '120px',
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #7f1d1d',
                    borderRadius: '0.5rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.4)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.125rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                  whileHover={{ scale: 1.08 }}
                  onClick={() => {
                    if (gameRoutes[game]) {
                      navigate(gameRoutes[game]);
                    } else {
                      alert('Coming soon!');
                    }
                  }}
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
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

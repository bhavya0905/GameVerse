import { motion } from 'framer-motion';

const FAQS = [
  {
    q: 'How do I start a game?',
    a: 'Visit the home page and click any game category. Select a game and click "Play Now".',
  },
  {
    q: 'Can I play games with friends?',
    a: 'Yes! Go to the multiplayer section and invite your friend using the room ID.',
  },
  {
    q: 'Do I need to sign up?',
    a: 'Currently, you can play without signing up. Future updates may include user profiles.',
  },
  {
    q: 'Which browser works best?',
    a: 'We recommend the latest version of Chrome or Edge for the best experience.',
  },
];

export default function HelpCenter() {
  return (
    <div
      style={{
        background: '#111',
        color: '#fff',
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ fontSize: '2.3rem', textAlign: 'center', marginBottom: '1rem' }}
      >
        Help Center
      </motion.h1>

      <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '2.5rem' }}>
        Find answers to the most common questions.
      </p>

      {/* FAQ section */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {FAQS.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            style={{
              marginBottom: '2rem',
              padding: '1.5rem',
              background: '#1e1e1e',
              borderRadius: '1rem',
              border: '1px solid #333',
              boxShadow: '0 0 8px rgba(0,0,0,0.3)',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.6rem', color: '#60a5fa' }}>
              {item.q}
            </h3>
            <p style={{ fontSize: '1rem', color: '#d1d5db' }}>{item.a}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

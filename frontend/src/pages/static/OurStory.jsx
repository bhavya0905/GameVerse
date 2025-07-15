import { motion } from 'framer-motion';

export default function OurStory() {
  return (
    <div
      style={{
        padding: '3rem 2rem',
        backgroundColor: '#0a0a0a',
        color: '#fff',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={{
          fontSize: '2.5rem',
          marginBottom: '1.5rem',
          color: '#dc2626',
          textAlign: 'center',
        }}
      >
        Our Story
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        style={{
          fontSize: '1.2rem',
          maxWidth: '800px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.7',
          textAlign: 'center',
        }}
      >
        Welcome to <strong>GameVerse</strong> — the ultimate destination where fun meets innovation. Born out of a
        passion for gaming and technology, our platform brings together a universe of games across genres, styles, and
        challenges for players of all ages.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        style={{
          margin: '2rem auto',
          maxWidth: '900px',
          backgroundColor: '#1f1f1f',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 0 15px rgba(220, 38, 38, 0.5)',
        }}
      >
        <h2 style={{ color: '#f43f5e', marginBottom: '1rem', fontSize: '1.8rem' }}>How We Started</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
          We began as a group of friends obsessed with creating digital experiences that are fun, fast, and immersive.
          What started as weekend experiments evolved into a complete platform that now hosts everything from casual
          puzzles to competitive multiplayer battles.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.9, duration: 0.7 }}
        style={{
          margin: '2rem auto',
          maxWidth: '900px',
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 0 15px rgba(251, 191, 36, 0.4)',
        }}
      >
        <h2 style={{ color: '#fbbf24', marginBottom: '1rem', fontSize: '1.8rem' }}>Our Mission</h2>
        <p style={{ fontSize: '1.1rem', lineHeight: '1.7' }}>
          Our mission is simple: to bring joy, challenge, and creativity to gamers around the world. With every game we
          add, we aim to make it accessible, exciting, and replayable — whether you're solving a puzzle solo or battling
          a friend in a fierce face-off.
        </p>
      </motion.div>
    </div>
  );
}

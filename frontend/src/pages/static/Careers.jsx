import { motion } from 'framer-motion';

const JOBS = [
  {
    title: 'Frontend Developer',
    location: 'Remote / India',
    description: 'Work with React, Framer Motion, and help shape our game platform’s user experience.',
  },
  {
    title: 'Game Designer',
    location: 'Bangalore, India',
    description: 'Design original, addictive games across single and multiplayer formats.',
  },
  {
    title: 'Backend Developer',
    location: 'Remote',
    description: 'Develop and maintain scalable backend services using Node.js, Socket.IO, and MySQL.',
  },
  {
    title: 'QA / Playtester',
    location: 'Remote / Part-time',
    description: 'Playtest new games, report bugs, and ensure a smooth experience for players.',
  },
];

export default function Careers() {
  return (
    <div
      style={{
        background: '#0f0f0f',
        color: '#fff',
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}
      >
        Careers at <span style={{ color: '#60a5fa' }}>GameVerse</span>
      </motion.h1>

      {/* Subtitle */}
      <p style={{ textAlign: 'center', color: '#9ca3af', fontSize: '1.1rem', marginBottom: '3rem' }}>
        We're building the future of online gaming. Come build it with us!
      </p>

      {/* Job cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.8rem',
        }}
      >
        {JOBS.map((job, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.04 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            style={{
              background: '#1e1e1e',
              borderRadius: '1rem',
              padding: '1.6rem',
              boxShadow: '0 0 10px rgba(0,0,0,0.4)',
              border: '1px solid #333',
            }}
          >
            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', color: '#60a5fa' }}>
              {job.title}
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#d1d5db', marginBottom: '0.8rem' }}>
              📍 {job.location}
            </p>
            <p style={{ fontSize: '1rem', color: '#9ca3af' }}>{job.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

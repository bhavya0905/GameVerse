// src/pages/static/Discord.jsx
import { motion } from 'framer-motion';

export default function Discord() {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.card}
      >
        <h2 style={styles.title}>Join Our Discord Community</h2>
        <p style={styles.text}>
          Connect with fellow gamers, get support, and stay updated with the latest events and announcements.
        </p>
        <a
            href="https://discord.com/invite/YourRealCode?with_invite=true"
            target="_blank"
            rel="noopener noreferrer"
        >
         Join Discord
        </a>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '80vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#111827',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#1f2937',
    padding: '2rem',
    borderRadius: '1rem',
    textAlign: 'center',
    color: '#e5e7eb',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    maxWidth: '500px',
  },
  title: {
    fontSize: '2rem',
    marginBottom: '1rem',
    color: '#60a5fa',
  },
  text: {
    fontSize: '1rem',
    marginBottom: '2rem',
    lineHeight: 1.6,
  },
  button: {
    display: 'inline-block',
    padding: '0.75rem 1.5rem',
    backgroundColor: '#5865F2',
    color: '#fff',
    borderRadius: '0.5rem',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease',
  },
};

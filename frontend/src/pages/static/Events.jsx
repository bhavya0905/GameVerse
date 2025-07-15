import { motion } from 'framer-motion';

export default function Events() {
  const events = [
    {
      title: 'Game Jam 2025',
      date: 'August 15, 2025',
      description: 'Create your own game in 48 hours and compete with developers worldwide.',
    },
    {
      title: 'Live Coding Session',
      date: 'July 25, 2025',
      description: 'Watch our team build a multiplayer game live with Q&A!',
    },
    {
      title: 'Weekly Community Meetup',
      date: 'Every Friday at 6PM IST',
      description: 'Casual voice chat and updates on community-led projects.',
    },
  ];

  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={styles.title}>🎮 Upcoming & Community Events</h2>
        <p style={styles.subtitle}>
          Join us in events, meetups, and fun challenges happening across our GameVerse community.
        </p>

        <div style={styles.grid}>
          {events.map((event, index) => (
            <motion.div
              key={index}
              style={styles.card}
              whileHover={{ scale: 1.03 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h3 style={styles.eventTitle}>{event.title}</h3>
              <p style={styles.date}>{event.date}</p>
              <p style={styles.desc}>{event.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '90vh',
    backgroundColor: '#111827',
    color: '#f3f4f6',
    padding: '3rem 2rem',
  },
  title: {
    fontSize: '2.2rem',
    marginBottom: '0.5rem',
    color: '#60a5fa',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    fontSize: '1rem',
    color: '#9ca3af',
    marginBottom: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    backgroundColor: '#1f2937',
    padding: '1.5rem',
    borderRadius: '1rem',
    boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
    textAlign: 'left',
    transition: 'transform 0.3s ease',
  },
  eventTitle: {
    fontSize: '1.3rem',
    color: '#93c5fd',
    marginBottom: '0.5rem',
  },
  date: {
    fontSize: '0.9rem',
    color: '#d1d5db',
    marginBottom: '0.75rem',
  },
  desc: {
    fontSize: '0.95rem',
    color: '#e5e7eb',
  },
};

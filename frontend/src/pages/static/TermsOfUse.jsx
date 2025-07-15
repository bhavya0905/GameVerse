import { motion } from 'framer-motion';

export default function Terms() {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.content}
      >
        <h1 style={styles.heading}>📜 Terms & Conditions</h1>
        <p style={styles.updated}>Last updated: July 14, 2025</p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>1. Acceptance of Terms</h2>
          <p>
            By accessing or using GameVerse, you agree to be bound by these terms. If you do not
            agree, please do not use the platform.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>2. User Conduct</h2>
          <p>
            Users must not abuse, harass, threaten, impersonate others, or violate any laws using this
            platform. Offensive behavior will lead to removal and possible bans.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>3. Intellectual Property</h2>
          <p>
            All content, including games, visuals, and UI, is the property of GameVerse unless stated
            otherwise. Do not redistribute or copy without permission.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>4. Limitation of Liability</h2>
          <p>
            GameVerse is provided "as is" without warranties. We are not responsible for any loss or
            damage caused by use of the site or any games.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>5. Changes to Terms</h2>
          <p>
            We may update these terms from time to time. It is your responsibility to check this page
            for updates. Continued use implies acceptance.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>6. Contact Us</h2>
          <p>
            For questions about these terms, please visit the{' '}
            <a href="/support/contact" style={styles.link}>Contact Us</a> page.
          </p>
        </section>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#111827',
    color: '#f3f4f6',
    padding: '3rem 1.5rem',
    minHeight: '100vh',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#60a5fa',
    marginBottom: '0.25rem',
  },
  updated: {
    fontSize: '0.9rem',
    color: '#9ca3af',
    marginBottom: '2rem',
  },
  section: {
    marginBottom: '2rem',
  },
  subheading: {
    fontSize: '1.3rem',
    color: '#93c5fd',
    marginBottom: '0.5rem',
  },
  link: {
    color: '#3b82f6',
    textDecoration: 'underline',
  },
};

import { motion } from 'framer-motion';

export default function Cookies() {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.content}
      >
        <h1 style={styles.heading}>🍪 Cookie Policy</h1>
        <p style={styles.updated}>Effective Date: July 14, 2025</p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>1. What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device to help us remember your preferences
            and enhance your browsing experience.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>2. Types of Cookies We Use</h2>
          <ul style={styles.list}>
            <li><strong>Essential:</strong> Required for basic functionality (e.g., session tracking).</li>
            <li><strong>Analytics:</strong> Used to analyze how users interact with the platform.</li>
            <li><strong>Preference:</strong> Remembers settings like theme or game filters.</li>
            <li><strong>Marketing:</strong> Helps personalize ads and promotions (minimal use).</li>
          </ul>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>3. Managing Cookies</h2>
          <p>
            You can manage or disable cookies through your browser settings. Note that disabling
            cookies may affect some features of our platform.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>4. Third‑Party Cookies</h2>
          <p>
            Some cookies may be set by third‑party services (e.g., analytics or embedded content).
            These are subject to their own privacy policies.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>5. Changes to This Policy</h2>
          <p>
            We may update this Cookie Policy as needed. All changes will be posted on this page
            with a new effective date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>6. Contact Us</h2>
          <p>
            For any questions regarding our use of cookies, please{' '}
            <a href="/support/contact" style={styles.link}>contact us</a>.
          </p>
        </section>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#111827',
    color: '#f9fafb',
    padding: '3rem 1.5rem',
    minHeight: '100vh',
  },
  content: {
    maxWidth: '800px',
    margin: '0 auto',
  },
  heading: {
    fontSize: '2.5rem',
    color: '#fbbf24',
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
    color: '#fcd34d',
    marginBottom: '0.5rem',
  },
  link: {
    color: '#facc15',
    textDecoration: 'underline',
  },
  list: {
    paddingLeft: '1.5rem',
    lineHeight: 1.7,
  },
};

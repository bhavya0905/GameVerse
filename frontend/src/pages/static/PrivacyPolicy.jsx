import { motion } from 'framer-motion';

export default function Privacy() {
  return (
    <div style={styles.container}>
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={styles.content}
      >
        <h1 style={styles.heading}>🔐 Privacy Policy</h1>
        <p style={styles.updated}>Effective Date: July 14, 2025</p>

        <section style={styles.section}>
          <h2 style={styles.subheading}>1. Information We Collect</h2>
          <p>
            We collect information you provide directly (like name, email), and data collected
            automatically (such as device type, location, browser, and usage behavior).
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>2. How We Use Your Information</h2>
          <p>
            We use your data to improve user experience, personalize content, offer support,
            monitor game engagement, and enhance platform features.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>3. Sharing Your Information</h2>
          <p>
            Your information is never sold. We may share limited data with trusted third parties
            (e.g., analytics tools) under strict confidentiality and security protocols.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>4. Cookies & Tracking</h2>
          <p>
            We use cookies to remember preferences and gather analytics. You can disable cookies in
            your browser settings, though it may affect site functionality.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>5. Your Rights</h2>
          <p>
            You may request access, updates, or deletion of your data by contacting us. We comply
            with applicable data protection regulations.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>6. Updates to This Policy</h2>
          <p>
            We may update this policy periodically. Changes will be reflected on this page with a
            new effective date.
          </p>
        </section>

        <section style={styles.section}>
          <h2 style={styles.subheading}>7. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please{' '}
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
    color: '#34d399',
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
    color: '#6ee7b7',
    marginBottom: '0.5rem',
  },
  link: {
    color: '#10b981',
    textDecoration: 'underline',
  },
};

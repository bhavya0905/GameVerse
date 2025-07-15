import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactUs() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! Your message has been received.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div
      style={{
        backgroundColor: '#111',
        minHeight: '100vh',
        padding: '3rem 1rem',
        color: '#fff',
        fontFamily: 'sans-serif',
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '1rem' }}
      >
        Contact Us
      </motion.h1>

      <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '2rem' }}>
        We'd love to hear from you. Reach out with any questions, feedback, or ideas!
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '700px',
          margin: '0 auto',
          background: '#1c1c1c',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid #333',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        }}
      >
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          required
          value={form.email}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          name="subject"
          required
          value={form.subject}
          onChange={handleChange}
          style={inputStyle}
        />

        <label style={labelStyle}>Message</label>
        <textarea
          name="message"
          rows="5"
          required
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <button
          type="submit"
          style={{
            marginTop: '1.5rem',
            padding: '0.8rem 1.5rem',
            background: '#3b82f6',
            color: '#fff',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '0.5rem',
            cursor: 'pointer',
          }}
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  marginTop: '1rem',
  marginBottom: '0.4rem',
  display: 'block',
  color: '#93c5fd',
  fontWeight: 'bold',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  backgroundColor: '#2a2a2a',
  color: '#fff',
  fontSize: '1rem',
  border: '1px solid #444',
};

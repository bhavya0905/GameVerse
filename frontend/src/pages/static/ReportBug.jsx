import { motion } from 'framer-motion';
import { useState } from 'react';

export default function ReportBug() {
  const [form, setForm] = useState({ name: '', email: '', description: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thanks for reporting! We’ll review the bug shortly.');
    setForm({ name: '', email: '', description: '' });
  };

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
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ fontSize: '2.3rem', textAlign: 'center', marginBottom: '1rem' }}
      >
        Report a Bug
      </motion.h1>

      <p style={{ textAlign: 'center', color: '#9ca3af', marginBottom: '2.5rem' }}>
        Found an issue? Let us know below.
      </p>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          background: '#1e1e1e',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid #333',
          boxShadow: '0 0 10px rgba(0,0,0,0.4)',
        }}
      >
        <label style={labelStyle}>Name</label>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Describe the issue</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="5"
          required
          style={{ ...inputStyle, resize: 'vertical' }}
        />

        <button
          type="submit"
          style={{
            marginTop: '1rem',
            padding: '0.7rem 1.5rem',
            background: '#3b82f6',
            border: 'none',
            borderRadius: '0.5rem',
            color: '#fff',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
        >
          Submit Report
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: 'block',
  marginBottom: '0.4rem',
  fontWeight: 'bold',
  color: '#93c5fd',
  marginTop: '1.2rem',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '0.5rem',
  border: '1px solid #444',
  background: '#2a2a2a',
  color: '#fff',
  fontSize: '1rem',
};

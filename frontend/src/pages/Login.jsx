import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // ••• correct backend route •••
      const res = await axios.post('/api/auth/login', { username, password });

      // store token & username in context
      login(res.data.token, res.data.username);

      navigate('/'); // redirect to home
    } catch (err) {
      // capture both message and express‑validator array formats
      const data = err.response?.data;
      if (data?.errors && Array.isArray(data.errors)) {
        setError(data.errors.map((e) => e.msg).join(', '));
      } else {
        setError(data?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={styles.card}
      >
        <h2 style={styles.heading}>🔐 Login to GameVerse</h2>

        <form onSubmit={handleLogin}>
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              placeholder="Username"
              style={styles.input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password"
              style={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span onClick={() => setShowPass(!showPass)} style={styles.eyeIcon}>
              {showPass ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <motion.button
            type="submit"
            style={styles.button}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    background: 'radial-gradient(circle at top, #0f172a, #000)',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1e293b',
    padding: '2rem',
    borderRadius: '1rem',
    boxShadow: '0 0 20px rgba(0,0,0,0.5)',
    width: '90%',
    maxWidth: '400px',
  },
  heading: {
    color: '#f87171',
    textAlign: 'center',
    marginBottom: '1.5rem',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#111827',
    borderRadius: '0.5rem',
    padding: '0.5rem',
    marginBottom: '1rem',
    position: 'relative',
  },
  input: {
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#f8fafc',
    padding: '0.5rem',
    flex: 1,
    fontSize: '1rem',
  },
  icon: {
    color: '#6b7280',
    marginRight: '0.5rem',
  },
  eyeIcon: {
    position: 'absolute',
    right: '0.75rem',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  error: {
    color: '#f87171',
    fontSize: '0.9rem',
    marginBottom: '0.75rem',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: '#dc2626',
    color: '#fff',
    padding: '0.75rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
    fontSize: '1rem',
  },
};

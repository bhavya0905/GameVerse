import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function Register() {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Optional if you want auto-login after register

  const validate = () => {
    const newErrors = {};
    if (!formData.username) newErrors.username = 'Username required';
    if (!formData.email) newErrors.email = 'Email required';
    if (!formData.password) newErrors.password = 'Password required';
    else if (formData.password.length < 6) newErrors.password = 'Min 6 characters';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      try {
        const res = await axios.post('/api/auth/register', formData);

        // Optionally auto-login after registration:
        // login(res.data.token, res.data.username);
        // navigate('/');

        // Redirect to login page after successful registration
        navigate('/login');
      } catch (err) {
        const backendErrors = err.response?.data;
        if (backendErrors?.errors) {
          const mapped = {};
          backendErrors.errors.forEach((e) => (mapped[e.param] = e.msg));
          setErrors(mapped);
        } else {
          setErrors({ general: backendErrors?.message || 'Registration failed' });
        }
      } finally {
        setLoading(false);
      }
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
        <h2 style={styles.heading}>Create Your GameVerse Account</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Username */}
          <div style={styles.inputGroup}>
            <FaUser style={styles.icon} />
            <input
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              style={styles.input}
            />
          </div>
          {errors.username && <p style={styles.error}>{errors.username}</p>}

          {/* Email */}
          <div style={styles.inputGroup}>
            <FaEnvelope style={styles.icon} />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              style={styles.input}
            />
          </div>
          {errors.email && <p style={styles.error}>{errors.email}</p>}

          {/* Password */}
          <div style={styles.inputGroup}>
            <FaLock style={styles.icon} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              style={styles.input}
            />
            <span onClick={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          {errors.password && <p style={styles.error}>{errors.password}</p>}

          {errors.general && <p style={styles.error}>{errors.general}</p>}

          {/* Submit */}
          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={styles.redirectText}>
          Already have an account?{' '}
          <span
            onClick={() => navigate('/login')}
            style={{ color: '#60a5fa', cursor: 'pointer' }}
          >
            Login
          </span>
        </p>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #0f172a, #111827)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem',
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: '1rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '420px',
    boxShadow: '0 0 25px rgba(0,0,0,0.4)',
  },
  heading: {
    color: '#f87171',
    fontSize: '1.8rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    left: '0.9rem',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
  },
  eyeIcon: {
    position: 'absolute',
    right: '0.9rem',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#9ca3af',
    cursor: 'pointer',
  },
  input: {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 2.2rem',
    borderRadius: '0.5rem',
    backgroundColor: '#0f172a',
    color: '#f8fafc',
    border: '1px solid #334155',
    outline: 'none',
    fontSize: '1rem',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#dc2626',
    color: '#fff',
    fontWeight: 'bold',
    border: 'none',
    borderRadius: '0.5rem',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background 0.3s ease',
  },
  error: {
    color: '#f87171',
    fontSize: '0.85rem',
    marginTop: '-0.7rem',
    marginBottom: '0.5rem',
    paddingLeft: '0.3rem',
  },
  redirectText: {
    marginTop: '1.5rem',
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: '0.95rem',
  },
};

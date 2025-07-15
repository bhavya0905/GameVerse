import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  /* ── shared link styles ── */
  const baseLink = {
    textDecoration: 'none',
    color: '#d1d5db',
    fontSize: '1rem',
    fontWeight: 500,
    padding: '0.04rem',
    transition: 'color 0.3s ease',
  };
  const active = { color: '#dc2626', borderBottom: '2px solid #dc2626' };

  /* ── auth button styles ── (smaller) */
  const btn = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.35rem',
    background: '#dc2626',
    color: '#fff',
    fontSize: '0.85rem',
    fontWeight: 600,
    padding: '0.35rem 0.75rem',
    borderRadius: 6,
    textDecoration: 'none',
    transition: 'background 0.25s ease',
    cursor: 'pointer',
  };
  const hover = { background: '#b91c1c' };

  const logoutBtn = {
    ...btn,
    padding: '0.35rem 1rem',
  };

  return (
    <nav
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '1rem 2rem',
        background: '#0d0d0d',
        borderBottom: '2px solid #b91c1c',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
      }}
    >
      {/* logo */}
      <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#dc2626', letterSpacing: '2px' }}>
        GameVerse
      </h1>

      {/* main nav links – pushed toward the right */}
      <div style={{ display: 'flex', gap: '1.5rem', marginLeft: 'auto', marginRight: '2rem' }}>
        <NavLink to="/" style={({ isActive }) => (isActive ? { ...baseLink, ...active } : baseLink)}>
          Home
        </NavLink>
        <NavLink
          to="/explore"
          style={({ isActive }) => (isActive ? { ...baseLink, ...active } : baseLink)}
        >
          Explore
        </NavLink>
        <NavLink
          to="/leaderboard"
          style={({ isActive }) => (isActive ? { ...baseLink, ...active } : baseLink)}
        >
          Leaderboard
        </NavLink>
      </div>

      {/* auth buttons or welcome + logout */}
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
        {user ? (
          <>
            <span style={{ color: '#d1d5db', fontWeight: '600' }}>Welcome, {user}</span>
            <button
              onClick={logout}
              style={logoutBtn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: '#dc2626' })}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink
              to="/login"
              style={btn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: '#dc2626' })}
            >
              <FaSignInAlt /> Login
            </NavLink>
            <NavLink
              to="/register"
              style={btn}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, hover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { background: '#dc2626' })}
            >
              <FaUserPlus /> Register
            </NavLink>
          </>
        )}
      </div>
    </nav>
  );
}

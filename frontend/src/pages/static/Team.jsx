import { motion } from 'framer-motion';
import { useRef } from 'react';

// Fake team data (add / edit as needed)
const TEAM = [
  { name: 'Bhavya Jain', role: 'Founder & Lead Dev', color: '#dc2626' },
  { name: 'Aarav Mehta', role: 'Game Designer',      color: '#22d3ee' },
  { name: 'Sana Kapoor', role: 'UI / UX Expert',     color: '#f43f5e' },
  { name: 'Karan Singh', role: 'Full‑Stack Eng.',    color: '#c084fc' },
  { name: 'Anika Verma', role: 'Community Manager',  color: '#fbbf24' },
  { name: 'Rahul Sharma',role: 'QA & Play‑tester',   color: '#38bdf8' },
];

export default function Team() {
  const sliderRef = useRef(null);

  const scroll = (dir) => {
    if (!sliderRef.current) return;
    const amount = 280; // pixels to scroll each click
    sliderRef.current.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

  return (
    <div
      style={{
        background: '#0a0a0a',
        color: '#fff',
        minHeight: '100vh',
        padding: '3rem 1.5rem',
        fontFamily: 'sans‑serif',
        position: 'relative',
      }}
    >
      {/* Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: '2.6rem', textAlign: 'center', marginBottom: '2.5rem' }}
      >
        Meet the <span style={{ color: '#22d3ee' }}>GameVerse</span> Team
      </motion.h1>

      {/* Slider controls */}
      <button
        onClick={() => scroll(-1)}
        style={arrowStyle('left')}
      >
        ‹
      </button>
      <button
        onClick={() => scroll(1)}
        style={arrowStyle('right')}
      >
        ›
      </button>

      {/* Carousel */}
      <div
        ref={sliderRef}
        style={{
          display: 'flex',
          gap: '1.6rem',
          overflowX: 'auto',
          scrollSnapType: 'x mandatory',
          paddingBottom: '1rem',
        }}
      >
        {TEAM.map((member, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.08, rotateZ: 1 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: 'spring', stiffness: 70 }}
            style={{
              minWidth: '250px',
              scrollSnapAlign: 'center',
              background: '#1a1a1a',
              borderRadius: '1rem',
              padding: '2rem 1.2rem',
              boxShadow: `0 0 15px ${member.color}80`,
              textAlign: 'center',
              position: 'relative',
            }}
          >
            {/* Colored circle with initials */}
            <div
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: member.color,
                color: '#0a0a0a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.6rem',
                fontWeight: 700,
                margin: '0 auto 1rem',
              }}
            >
              {member.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </div>

            <h3 style={{ fontSize: '1.3rem', marginBottom: '0.3rem', color: member.color }}>
              {member.name}
            </h3>
            <p style={{ fontSize: '1.05rem', color: '#d1d5db' }}>{member.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* Helper for arrow button style */
function arrowStyle(side) {
  return {
    position: 'absolute',
    top: '50%',
    [side]: '1.2rem',
    transform: 'translateY(-50%)',
    background: '#1f2937',
    border: 'none',
    color: '#fff',
    fontSize: '2rem',
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    cursor: 'pointer',
    boxShadow: '0 0 8px rgba(0,0,0,0.4)',
    zIndex: 10,
    transition: 'background 0.3s',
    lineHeight: '0.9',
  };
}

// src/pages/Leaderboard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaCrown, FaMedal } from 'react-icons/fa';

const players = [
  { rank: 1, name: 'BlazeMaster99',  score: 9820, country: '🇺🇸', game: 'Maze Runner' },
  { rank: 2, name: 'PixelQueen',     score: 9450, country: '🇬🇧', game: 'Color Match' },
  { rank: 3, name: 'DarkShadow',     score: 9130, country: '🇨🇦', game: '2048 Merge' },
  { rank: 4, name: 'SpeedFreak',     score: 8740, country: '🇮🇳', game: 'Speed Math' },
  { rank: 5, name: 'MazeRunnerX',    score: 8430, country: '🇦🇺', game: 'Maze Runner' },
  { rank: 6, name: 'Brainiac101',    score: 8290, country: '🇩🇪', game: 'Sudoku Master' },
  { rank: 7, name: 'EmojiWizard',    score: 8100, country: '🇫🇷', game: 'Memory Flip' },
  { rank: 8, name: 'TicTacPro',      score: 7930, country: '🇧🇷', game: 'Tic Tac Toe' },
  { rank: 9, name: 'SudokuSensei',   score: 7750, country: '🇯🇵', game: 'Sudoku Master' },
  { rank:10, name: 'GameVerseKing',  score: 7600, country: '🇪🇸', game: 'Brick Breaker' },
];

const getRankIcon = (rank) => {
  if (rank === 1) return <FaCrown style={{ color: '#FFD700', fontSize: '1.4rem' }} />;
  if (rank === 2) return <FaMedal style={{ color: '#C0C0C0' }} />;
  if (rank === 3) return <FaMedal style={{ color: '#CD7F32' }} />;
  return <span style={{ fontWeight: 'bold' }}>#{rank}</span>;
};

export default function Leaderboard() {
  const [page, setPage] = useState(1);
  const playersPerPage = 5;
  const totalPages = Math.ceil(players.length / playersPerPage);
  const startIndex = (page - 1) * playersPerPage;
  const currentPlayers = players.slice(startIndex, startIndex + playersPerPage);

  return (
    <div style={styles.wrapper}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        style={styles.card}
      >
        <h2 style={styles.heading}>🏆 Global Leaderboard</h2>
        <p style={styles.subHeading}>Top champions across all GameVerse titles</p>

        <table style={styles.table}>
          <thead>
            <tr style={styles.headRow}>
              <th style={styles.th}>Rank</th>
              <th style={styles.th}>Player</th>
              <th style={styles.th}>Game</th>
              <th style={styles.th}>Score</th>
            </tr>
          </thead>
          <tbody>
            {currentPlayers.map((player, idx) => (
              <motion.tr
                key={player.rank}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                style={{
                  ...styles.row,
                  background:
                    player.rank === 1 ? 'linear-gradient(to right, #FFD70022, #00000011)' :
                    player.rank === 2 ? 'linear-gradient(to right, #C0C0C022, #00000011)' :
                    player.rank === 3 ? 'linear-gradient(to right, #CD7F3222, #00000011)' :
                    '#1e293b',
                }}
              >
                <td style={styles.td}>{getRankIcon(player.rank)}</td>
                <td style={styles.playerCell}>
                  <div style={styles.avatar}>{player.name[0]}</div>
                  <div>
                    <strong>{player.name}</strong><br />
                    <span style={{ fontSize: '0.9rem', color: '#9ca3af' }}>{player.country}</span>
                  </div>
                </td>
                <td style={styles.td}>
                  <span style={styles.badge}>{player.game}</span>
                </td>
                <td style={{ ...styles.td, fontWeight: 600 }}>{player.score.toLocaleString()}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={styles.pagination}>
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              style={{
                ...styles.pageBtn,
                backgroundColor: page === i + 1 ? '#dc2626' : '#1f2937',
                color: page === i + 1 ? '#fff' : '#d1d5db',
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  wrapper: {
    minHeight: '100vh',
    background: 'radial-gradient(circle at top, #111827, #0f172a)',
    padding: '3rem 1rem',
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: '#0f172acc',
    borderRadius: '1.25rem',
    padding: '2.5rem',
    width: '100%',
    maxWidth: '950px',
    boxShadow: '0 0 30px rgba(0,0,0,0.45)',
    backdropFilter: 'blur(6px)',
  },
  heading: {
    color: '#facc15',
    fontSize: '2.5rem',
    textAlign: 'center',
    textShadow: '0 0 6px #000',
    marginBottom: '0.5rem',
  },
  subHeading: {
    color: '#cbd5e1',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  headRow: {
    backgroundColor: '#1f2937',
  },
  th: {
    color: '#e2e8f0',
    textAlign: 'left',
    padding: '1rem',
    fontSize: '1rem',
    borderBottom: '1px solid #334155',
  },
  row: {
    transition: 'all 0.3s ease',
  },
  td: {
    padding: '1rem',
    fontSize: '1rem',
    color: '#f8fafc',
    verticalAlign: 'middle',
  },
  playerCell: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
  },
  avatar: {
    backgroundColor: '#f87171',
    width: '2.5rem',
    height: '2.5rem',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#111827',
  },
  badge: {
    backgroundColor: '#22c55e22',
    color: '#bbf7d0',
    padding: '0.4rem 0.75rem',
    borderRadius: '9999px',
    fontSize: '0.85rem',
    fontWeight: '500',
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '2rem',
    gap: '0.5rem',
  },
  pageBtn: {
    padding: '0.5rem 1rem',
    border: 'none',
    borderRadius: '0.5rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

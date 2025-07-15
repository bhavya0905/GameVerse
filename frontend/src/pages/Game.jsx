import { useParams, Link } from 'react-router-dom';
import { useState } from 'react';

// ✅ Local Game Imports
import AlienHunt from './games/AlienHunt';
import BallBounce from './games/BallBounce';
import BrickBreaker from './games/BrickBreaker';
import ChessBoard from './games/ChessBoard';
import ColorMatch from './games/ColorMatch';
import CyberJump from './games/CyberJump';
import DotConnect from './games/DotConnect';
import FruitMerge from './games/FruitMerge';
import LudoArena from './games/LudoArena';
import MazeRunner from './games/MazeRunner';
import MemoryFlip from './games/MemoryFlip';
import Merge2048 from './games/Merge2048';
import NeonDrift from './games/NeonDrift';
import NumberPuzzle from './games/NumberPuzzle';
import PixelInvaders from './games/PixelInvaders';
import RockPaperScissors from './games/RockPaperScissors';
import SnakeClassic from './games/SnakeClassic';
import SpaceRace from './games/SpaceRace';
import SpeedMath from './games/SpeedMath';
import SpeedRunner from './games/SpeedRunner';
import SudokuMaster from './games/SudokuMaster';
import TicTacToe from './games/TicTacToe';
import TowerBlocks from './games/TowerBlocks';
import TriviaDuel from './games/TriviaDuel';
import WordScramble from './games/WordScramble';
import WordWar from './games/WordWar';
import ZombieEscape from './games/ZombieEscape';
import GlitchDash from './games/GlitchDash'; // ✅ Added

// ✅ Embeddable iframe games
const gameURLs = {
  tetris: 'https://freetetris.org/game.php',
  snake: 'https://playsnake.org/',
  breakout: 'https://classicreload.com/breakout.html',
  flappy: 'https://flappybird.io/',
};

// ✅ Local Game Components Map
const localGames = {
  'alien-hunt': <AlienHunt />,
  'ball-bounce': <BallBounce />,
  'brick-breaker': <BrickBreaker />,
  'chess-board': <ChessBoard />,
  'color-match': <ColorMatch />,
  'cyber-jump': <CyberJump />,
  'dot-connect': <DotConnect />,
  'fruit-merge': <FruitMerge />,
  'ludo-arena': <LudoArena />,
  'maze-runner': <MazeRunner />,
  'memory-flip': <MemoryFlip />,
  'merge-2048': <Merge2048 />,
  'neon-drift': <NeonDrift />,
  'number-puzzle': <NumberPuzzle />,
  'pixel-invaders': <PixelInvaders />,
  'rock-paper-scissors': <RockPaperScissors />,
  'snake-classic': <SnakeClassic />,
  'space-race': <SpaceRace />,
  'speed-math': <SpeedMath />,
  'speed-runner': <SpeedRunner />,
  'sudoku-master': <SudokuMaster />,
  'tic-tac-toe': <TicTacToe />,
  'tower-blocks': <TowerBlocks />,
  'trivia-duel': <TriviaDuel />,
  'word-scramble': <WordScramble />,
  'word-war': <WordWar />,
  'zombie-escape': <ZombieEscape />,
  'glitch-dash': <GlitchDash /> // ✅ Added
};

export default function Game() {
  const { id } = useParams();
  const [username, setUsername] = useState('');
  const [score, setScore] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !score) {
      alert('Please fill in both name and score');
      return;
    }

    try {
      const res = await fetch('http://localhost:3000/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, gameId: id, score: parseInt(score) }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        alert('Failed to submit score');
      }
    } catch (err) {
      console.error(err);
      alert('Error submitting score. Is your backend running?');
    }
  };

  const renderGame = () => {
    if (localGames[id]) {
      return localGames[id];
    } else if (gameURLs[id]) {
      return (
        <iframe
          src={gameURLs[id]}
          width="700"
          height="500"
          title={`Game: ${id}`}
          style={{
            border: '2px solid #333',
            borderRadius: '8px',
            marginBottom: '2rem',
            maxWidth: '100%',
          }}
        />
      );
    } else {
      return <p>⚠️ Game not found</p>;
    }
  };

  return (
    <div
      style={{
        padding: '2rem',
        fontFamily: 'sans-serif',
        color: 'white',
        background: 'linear-gradient(to bottom, #000, #0f0f0f, #1a0000)',
        minHeight: '100vh',
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: '#f87171' }}>
        🎮 Playing: {id}
      </h2>

      {renderGame()}

      {/* Score Submission (for iframe games only) */}
      {!submitted && gameURLs[id] && (
        <>
          <h3 style={{ color: '#facc15' }}>Submit Your Score</h3>
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: '300px',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
            }}
          >
            <input
              type="text"
              placeholder="Your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #444',
              }}
            />
            <input
              type="number"
              placeholder="Score"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              style={{
                padding: '0.5rem',
                borderRadius: '4px',
                border: '1px solid #444',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '0.5rem',
                background: '#dc2626',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              🚀 Submit
            </button>
          </form>
        </>
      )}

      {submitted && (
        <p style={{ marginTop: '1rem', color: '#4ade80' }}>
          ✅ Score submitted! <Link to={`/leaderboard/${id}`}>View Leaderboard</Link>
        </p>
      )}
    </div>
  );
}

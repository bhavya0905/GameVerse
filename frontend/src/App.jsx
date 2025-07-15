// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';                // ✅ NEW

import Layout      from './components/Layout';
import Home        from './pages/Home';
import Game        from './pages/Game';
import Explore     from './pages/Explore';
import SinglePlayer from './pages/SinglePlayer';
import Multiplayer  from './pages/Multiplayer';
import Trending     from './pages/Trending';

/*──────────────────────────────────────────────
  Auth pages
──────────────────────────────────────────────*/
import Login    from './pages/Login';
import Register from './pages/Register';

/*──────────────────────────────────────────────
  Single‑player games
──────────────────────────────────────────────*/
import ColorMatch   from './pages/games/ColorMatch';
import NumberPuzzle from './pages/games/NumberPuzzle';
import TowerBlocks  from './pages/games/TowerBlocks';
import BrickBreaker from './pages/games/BrickBreaker';
import Merge2048    from './pages/games/Merge2048';
import SudokuMaster from './pages/games/SudokuMaster';
import BallBounce   from './pages/games/BallBounce';
import MemoryFlip   from './pages/games/MemoryFlip';
import SnakeClassic from './pages/games/SnakeClassic';
import DotConnect   from './pages/games/DotConnect';
import SpeedMath    from './pages/games/SpeedMath';

/*──────────────────────────────────────────────
  Multiplayer games
──────────────────────────────────────────────*/
import ChessBoard        from './pages/games/ChessBoard';
import TriviaDuel        from './pages/games/TriviaDuel';
import SpaceRace         from './pages/games/SpaceRace';
import WordWar           from './pages/games/WordWar';
import LudoArena         from './pages/games/LudoArena';
import TicTacToe         from './pages/games/TicTacToe';
import RockPaperScissors from './pages/games/RockPaperScissors';
import WordScramble      from './pages/games/WordScramble';

/*──────────────────────────────────────────────
  Trending games
──────────────────────────────────────────────*/
import AlienHunt     from './pages/games/AlienHunt';
import CyberJump     from './pages/games/CyberJump';
import GlitchDash    from './pages/games/GlitchDash';
import ZombieEscape  from './pages/games/ZombieEscape';
import SpeedRunner   from './pages/games/SpeedRunner';
import NeonDrift     from './pages/games/NeonDrift';
import FruitMerge    from './pages/games/FruitMerge';
import PixelInvaders from './pages/games/PixelInvaders';

/*──────────────────────────────────────────────
  Static / informational pages
──────────────────────────────────────────────*/
import ContactUs     from './pages/static/ContactUs';
import HelpCenter    from './pages/static/HelpCenter';
import OurStory      from './pages/static/OurStory';
import Team          from './pages/static/Team';
import Careers       from './pages/static/Careers';
import ReportBug     from './pages/static/ReportBug';
import Forums        from './pages/static/Forums';
import Discord       from './pages/static/Discord';
import Events        from './pages/static/Events';
import TermsOfUse    from './pages/static/TermsOfUse';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import CookiesPolicy from './pages/static/CookiesPolicy';

/*──────────────────────────────────────────────
  Demo Leaderboard page
──────────────────────────────────────────────*/
import Leaderboard from './pages/Leaderboard';

/*──────────────────────────────────────────────
  Fallback “Not Found” page
──────────────────────────────────────────────*/
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      {/* ✅ Scroll to top on every route change */}
      <ScrollToTop />

      <Routes>
        <Route element={<Layout />}>
          {/* Core sections */}
          <Route path="/"              element={<Home />} />
          <Route path="/game/:id"      element={<Game />} />
          <Route path="/game"          element={<Navigate to="/explore" replace />} />
          <Route path="/explore"       element={<Explore />} />
          <Route path="/single-player" element={<SinglePlayer />} />
          <Route path="/multiplayer"   element={<Multiplayer />} />
          <Route path="/trending"      element={<Trending />} />
          <Route path="/leaderboard"   element={<Leaderboard />} />

          {/* Auth */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Single‑player games */}
          <Route path="/games/color-match"     element={<ColorMatch />} />
          <Route path="/games/number-puzzle"   element={<NumberPuzzle />} />
          <Route path="/games/tower-blocks"    element={<TowerBlocks />} />
          <Route path="/games/brick-breaker"   element={<BrickBreaker />} />
          <Route path="/games/2048"            element={<Merge2048 />} />
          <Route path="/games/sudoku-master"   element={<SudokuMaster />} />
          <Route path="/games/ball-bounce"     element={<BallBounce />} />
          <Route path="/games/memory-flip"     element={<MemoryFlip />} />
          <Route path="/games/snake-classic"   element={<SnakeClassic />} />
          <Route path="/games/dot-connect"     element={<DotConnect />} />
          <Route path="/games/speed-math"      element={<SpeedMath />} />

          {/* Multiplayer games */}
          <Route path="/games/online-chess"        element={<ChessBoard />} />
          <Route path="/games/trivia-duel"         element={<TriviaDuel />} />
          <Route path="/games/space-race"          element={<SpaceRace />} />
          <Route path="/games/word-war"            element={<WordWar />} />
          <Route path="/games/ludo"                element={<LudoArena />} />
          <Route path="/games/tic-tac-toe"         element={<TicTacToe />} />
          <Route path="/games/rock-paper-scissors" element={<RockPaperScissors />} />
          <Route path="/games/word-scramble"       element={<WordScramble />} />

          {/* Trending games */}
          <Route path="/games/alien-hunt"     element={<AlienHunt />} />
          <Route path="/games/cyber-jump"     element={<CyberJump />} />
          <Route path="/games/glitch-dash"    element={<GlitchDash />} />
          <Route path="/games/zombie-escape"  element={<ZombieEscape />} />
          <Route path="/games/speed-runner"   element={<SpeedRunner />} />
          <Route path="/games/neon-drift"     element={<NeonDrift />} />
          <Route path="/games/fruit-merge"    element={<FruitMerge />} />
          <Route path="/games/pixel-invaders" element={<PixelInvaders />} />

          {/* Footer‑linked static pages */}
          {/* About */}
          <Route path="/about/our-story" element={<OurStory />} />
          <Route path="/about/team"      element={<Team />} />
          <Route path="/about/careers"   element={<Careers />} />

          {/* Support */}
          <Route path="/support/help"       element={<HelpCenter />} />
          <Route path="/support/report-bug" element={<ReportBug />} />
          <Route path="/support/contact"    element={<ContactUs />} />

          {/* Community */}
          <Route path="/community/forums"   element={<Forums />} />
          <Route path="/community/discord"  element={<Discord />} />
          <Route path="/community/events"   element={<Events />} />

          {/* Legal */}
          <Route path="/legal/terms"    element={<TermsOfUse />} />
          <Route path="/legal/privacy"  element={<PrivacyPolicy />} />
          <Route path="/legal/cookies"  element={<CookiesPolicy />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}

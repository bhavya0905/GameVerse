// src/games/GlitchDash.jsx
import React, { useCallback, useEffect, useRef, useState } from "react";

/* ───────── CONFIG ───────── */
const LANES = 3;
const ROWS = 12;
const START_SPEED = 480;          // ms
const MIN_SPEED   = 180;
const ACCEL_STEP  = 1.2;
const OBSTACLE    = "🟥";
const BULLET      = "🔺";

/* ───────── HELPERS ───────── */
const emptyGrid = () => Array.from({ length: ROWS }, () => Array(LANES).fill(""));

export default function GlitchDash() {
  /* STATE */
  const [grid, setGrid]       = useState(emptyGrid);
  const [lane, setLane]       = useState(1);
  const [started, setStart]   = useState(false);
  const [paused, setPause]    = useState(false);
  const [gameOver, setOver]   = useState(false);
  const [score, setScore]     = useState(0);
  const [best, setBest]       = useState(() => +localStorage.getItem("gd_best") || 0);

  /* REFS */
  const speed   = useRef(START_SPEED);
  const rafId   = useRef(null);
  const keyLock = useRef(false);
  const bullets = useRef([]);               // {row, lane}

  /* RESET */
  const reset = () => {
    setGrid(emptyGrid);
    setLane(1);
    setScore(0);
    setOver(false);
    setPause(false);
    setStart(false);
    bullets.current = [];
    speed.current   = START_SPEED;
    cancelAnimationFrame(rafId.current);
  };

  /* SHOOT (spacebar) */
  const shoot = () => {
    if (!started || paused || gameOver) return;
    const b = { row: ROWS - 2, lane };
    bullets.current.push(b);

    /* render bullet immediately so user gets feedback */
    setGrid((g) => {
      const dup = g.map((row) => [...row]);
      dup[b.row][b.lane] = BULLET;
      return dup;
    });
  };

  /* MAIN LOOP */
  const frame = useCallback(() => {
    if (paused) {
      rafId.current = requestAnimationFrame(frame);
      return;
    }

    /* frame timing */
    const now   = performance.now();
    if (!frame.last) frame.last = now;
    const dt = now - frame.last;

    if (dt >= speed.current) {
      setGrid((prev) => {
        const next = emptyGrid();

        /* 1. shift obstacles down */
        for (let r = ROWS - 2; r >= 0; r--) {
          for (let c = 0; c < LANES; c++) {
            if (prev[r][c] === OBSTACLE) next[r + 1][c] = OBSTACLE;
          }
        }

        /* 2. bullets travel up & collide */
        const newBullets = [];
        bullets.current.forEach((b) => {
          const newRow = b.row - 1;
          if (newRow < 0) return;                        // left screen

          /* hit obstacle? */
          if (next[newRow][b.lane] === OBSTACLE) {
            next[newRow][b.lane] = "";                  // destroy obstacle
            setScore((s) => s + 1);                     // bonus point
            return;
          }

          next[newRow][b.lane] = BULLET;                // place bullet
          newBullets.push({ row: newRow, lane: b.lane });
        });
        bullets.current = newBullets;

        /* 3. spawn new obstacle at top row */
        const col = Math.floor(Math.random() * LANES);
        if (next[0][col] === "") next[0][col] = OBSTACLE;

        /* 4. collision with player */
        if (next[ROWS - 1][lane] === OBSTACLE) setOver(true);

        return next;
      });

      /* score & speed */
      setScore((s) => s + 1);
      if (speed.current > MIN_SPEED) speed.current -= ACCEL_STEP;
      frame.last = now;
    }

    if (!gameOver) rafId.current = requestAnimationFrame(frame);
  }, [paused, lane, gameOver]);

  /* START LOOP */
  useEffect(() => {
    if (started && !gameOver) rafId.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId.current);
  }, [started, gameOver, frame]);

  /* KEY HANDLERS */
  const move = (dir) => setLane((l) => Math.max(0, Math.min(LANES - 1, l + dir)));

  const onKeyDown = useCallback(
    (e) => {
      const { key, code } = e;
      if (["Space", "ArrowLeft", "ArrowRight", "a", "d", "p"].includes(code) || key === " ") {
        e.preventDefault(); // stop page scroll
      }
      if (gameOver) return;

      if (code === "KeyP") {
        setPause((p) => !p);
      } else if (code === "Space") {
        shoot();
      } else if (code === "ArrowLeft" || code === "KeyA") {
        if (!keyLock.current) move(-1);
        keyLock.current = true;
      } else if (code === "ArrowRight" || code === "KeyD") {
        if (!keyLock.current) move(1);
        keyLock.current = true;
      }
    },
    [gameOver]
  );

  const onKeyUp = useCallback(() => (keyLock.current = false), []);

  useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onKeyDown, onKeyUp]);

  /* SAVE BEST */
  useEffect(() => {
    if (gameOver) {
      cancelAnimationFrame(rafId.current);
      if (score > best) {
        setBest(score);
        localStorage.setItem("gd_best", score);
      }
    }
  }, [gameOver, score, best]);

  /* ───────── STYLES (inline for brevity) ───────── */
  const neon = "#00ffff";
  const css = {
    page: { fontFamily: "monospace", textAlign: "center", background: "#000", color: neon, minHeight: "100vh", padding: 24 },
    grid: { display: "inline-block", border: `4px solid ${neon}`, boxShadow: `0 0 24px ${neon}`, marginTop: 16 },
    row:  { display: "flex" },
    cell: { width: 34, height: 34, border: "1px solid #111", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 },
    obs:  { background: "#ff0033" },
    ply:  { background: neon, color: "#000" },
    btn:  { margin: "0 6px", padding: "6px 14px", background: neon, color: "#000", border: "none", borderRadius: 6, cursor: "pointer" },
  };

  return (
    <div style={css.page}>
      <h1>⚡ Glitch Dash</h1>

      {!started && <button style={css.btn} onClick={() => setStart(true)}>▶️ Start</button>}
      <button style={css.btn} onClick={reset}>🔄 Restart</button>
      {started && <button style={css.btn} onClick={() => setPause(!paused)}>{paused ? "▶️ Resume" : "⏸ Pause"}</button>}

      {started && !gameOver && <div>Score: {score}</div>}
      {best > 0 && <div>Best: {best}</div>}

      <div style={css.grid} aria-label="game grid">
        {grid.map((row, r) => (
          <div key={r} style={css.row}>
            {row.map((cell, c) => {
              const isPlayer = r === ROWS - 1 && c === lane;
              const style = {
                ...css.cell,
                ...(cell === OBSTACLE ? css.obs : {}),
                ...(isPlayer ? css.ply : {}),
              };
              return (
                <div key={c} style={style}>
                  {cell || (isPlayer ? "🚀" : "")}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {gameOver && <div style={{ color: "#ff0033", fontSize: "1.7rem", marginTop: 18 }}>💥 Game Over</div>}
    </div>
  );
}

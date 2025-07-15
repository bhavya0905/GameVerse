import { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 240;
const CANVAS_HEIGHT = 360;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 10;
const GUN_WIDTH = 4;
const GUN_HEIGHT = 6;
const ALIEN_SIZE = 18;
const BULLET_HEIGHT = 6;
const ALIEN_TYPES = [
  { emoji: '👾', points: 10 },
  { emoji: '👽', points: 15 },
  { emoji: '🛸', points: 20 },
  { emoji: '🤖', points: 25 }
];

export default function PixelInvaders() {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => parseInt(localStorage.getItem('invaderHighScore')) || 0);
  const [gameOver, setGameOver] = useState(false);
  const [powerUp, setPowerUp] = useState(false);
  const [level, setLevel] = useState(1);
  const [bossMode, setBossMode] = useState(false);
  const [boss, setBoss] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.font = `${ALIEN_SIZE}px Arial`;
    ctx.textAlign = 'center';

    let playerX = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
    const playerY = CANVAS_HEIGHT - PLAYER_HEIGHT - 8;
    const bullets = [];
    const alienBullets = [];
    let aliens = [];
    let alienSpeed = 0.4 + level * 0.2;
    let frame = 0;
    let keys = {};
    let alienDirection = 1;

    const initAliens = () => {
      const a = [];
      for (let r = 0; r < 3 + level; r++) {
        for (let c = 0; c < 6; c++) {
          const type = ALIEN_TYPES[(r + c) % ALIEN_TYPES.length];
          a.push({ x: c * 30 + 15, y: r * 30 + 10, alive: true, type });
        }
      }
      return a;
    };

    aliens = initAliens();

    const initBoss = () => ({ x: CANVAS_WIDTH / 2 - 20, y: 20, width: 40, height: 20, hp: 10 + level * 2 });

    const drawPlayer = (ctx, x, y) => {
      ctx.font = '18px Arial';
      ctx.fillText('🧍‍♂️', x + PLAYER_WIDTH / 2, y + PLAYER_HEIGHT);
      ctx.fillStyle = 'cyan';
      ctx.fillRect(x + PLAYER_WIDTH / 2 - GUN_WIDTH / 2, y - GUN_HEIGHT, GUN_WIDTH, GUN_HEIGHT); // gun
    };

    const draw = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      drawPlayer(ctx, playerX, playerY);

      ctx.fillStyle = 'white';
      bullets.forEach((b, i) => {
        b.y -= 5;
        ctx.fillRect(b.x, b.y, 2, BULLET_HEIGHT);
        if (b.y < 0) bullets.splice(i, 1);
      });

      ctx.fillStyle = 'red';
      alienBullets.forEach((b, i) => {
        b.y += 3;
        ctx.fillRect(b.x, b.y, 2, BULLET_HEIGHT);
        if (b.y > CANVAS_HEIGHT) alienBullets.splice(i, 1);
      });

      const edgePadding = 5;
      let minX = Infinity;
      let maxX = -Infinity;
      aliens.forEach((a) => {
        if (a.alive) {
          minX = Math.min(minX, a.x);
          maxX = Math.max(maxX, a.x + ALIEN_SIZE);
        }
      });
      if (minX <= edgePadding || maxX >= CANVAS_WIDTH - edgePadding) {
        alienDirection *= -1;
        aliens.forEach((a) => (a.y += 12));
      }
      aliens.forEach((a) => {
        if (a.alive) {
          a.x += alienDirection * alienSpeed;
          ctx.fillText(a.type.emoji, a.x, a.y);
        }
      });

      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        for (let j = 0; j < aliens.length; j++) {
          const a = aliens[j];
          if (
            a.alive &&
            b.x >= a.x - ALIEN_SIZE / 2 &&
            b.x <= a.x + ALIEN_SIZE / 2 &&
            b.y >= a.y - ALIEN_SIZE &&
            b.y <= a.y
          ) {
            a.alive = false;
            bullets.splice(i, 1);
            setScore((s) => s + a.type.points);
            if (Math.random() < 0.1) setPowerUp(true);
            break;
          }
        }
      }

      alienBullets.forEach((b) => {
        if (
          b.x > playerX &&
          b.x < playerX + PLAYER_WIDTH &&
          b.y > playerY &&
          b.y < playerY + PLAYER_HEIGHT
        ) {
          setGameOver(true);
        }
      });

      if (aliens.some((a) => a.alive && a.y + ALIEN_SIZE >= playerY)) {
        setGameOver(true);
      }

      if (bossMode && boss) {
        ctx.fillStyle = 'magenta';
        ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
        bullets.forEach((b, i) => {
          if (
            b.x > boss.x &&
            b.x < boss.x + boss.width &&
            b.y > boss.y &&
            b.y < boss.y + boss.height
          ) {
            bullets.splice(i, 1);
            boss.hp -= 1;
            setScore((s) => s + 20);
            if (boss.hp <= 0) {
              setLevel((l) => l + 1);
              setBossMode(false);
              setBoss(null);
              aliens = initAliens();
            }
          }
        });
      }

      if (!bossMode && aliens.every((a) => !a.alive)) {
        setBossMode(true);
        setBoss(initBoss());
      }
    };

    const shoot = () => {
      const base = [playerX + PLAYER_WIDTH / 2];
      if (powerUp) base.push(playerX + 4, playerX + PLAYER_WIDTH - 4);
      base.forEach((x) => bullets.push({ x, y: playerY }));
    };

    const loop = () => {
      if (gameOver) return;
      draw();

      if (frame % 90 === 0) {
        const shooters = aliens.filter((a) => a.alive);
        if (shooters.length > 0) {
          const a = shooters[Math.floor(Math.random() * shooters.length)];
          alienBullets.push({ x: a.x, y: a.y });
        }
      }

      if (keys['ArrowLeft']) playerX = Math.max(0, playerX - 3);
      if (keys['ArrowRight']) playerX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, playerX + 3);

      frame++;
      requestAnimationFrame(loop);
    };

    const keyDown = (e) => {
      keys[e.key] = true;
      if (e.key === ' ' || e.key === 'ArrowUp') shoot();
    };

    const keyUp = (e) => {
      keys[e.key] = false;
    };

    window.addEventListener('keydown', keyDown);
    window.addEventListener('keyup', keyUp);
    loop();

    return () => {
      window.removeEventListener('keydown', keyDown);
      window.removeEventListener('keyup', keyUp);
    };
  }, [gameOver, powerUp, level]);

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('invaderHighScore', score);
    }
  }, [score]);

  return (
    <div style={{ textAlign: 'center', color: 'white', fontFamily: 'monospace' }}>
      <h2>👾 Pixel Invaders</h2>
      <p>Score: {score} | High Score: {highScore} | Level: {level}</p>
      {powerUp && <p style={{ color: 'yellow' }}>Power-Up: Triple Shot!</p>}
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{ border: '2px solid cyan', background: 'black' }}
      />
      {gameOver && (
        <div>
          <h3 style={{ color: 'red' }}>Game Over</h3>
          <button onClick={() => window.location.reload()}>Restart</button>
        </div>
      )}
    </div>
  );
}

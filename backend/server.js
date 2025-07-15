// backend/server.js
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const db = require('./db'); // MySQL pool
dotenv.config();

/* ───────────────────────────── Config ───────────────────────────── */
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'default_jwt_secret';

/* ───────────────────────────── App Setup ───────────────────────────── */
const app = express();
const server = http.createServer(app);
app.use(cors({ origin: '*' }));
app.use(express.json());

/* ───────────────────────────── Auth Routes ───────────────────────────── */
app.post('/api/auth/register', async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password)
    return res.status(400).json({ error: 'All fields are required' });

  try {
    const [existing] = await db.query(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) return res.status(409).json({ error: 'User already exists' });

    await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, password]
    );

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

    if (users.length === 0)
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, username });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

/* ───────────────────────────── Socket.IO ───────────────────────────── */
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

const rooms = {};

io.on('connection', (socket) => {
  console.log(`🟢 ${socket.id} connected`);

  socket.on('join-room', (roomId) => {
    roomId = roomId.trim().toUpperCase();
    if (!roomId) return;

    if (!rooms[roomId]) rooms[roomId] = { players: [], choices: {} };
    const room = rooms[roomId];

    if (room.players.length >= 2) {
      socket.emit('room-full');
      return;
    }

    room.players.push(socket.id);
    socket.join(roomId);
    socket.emit('player-role', room.players.length);

    if (room.players.length === 2) io.to(roomId).emit('opponent-joined');
  });

  socket.on('rps-choice', ({ roomId, choice }) => {
    roomId = roomId.trim().toUpperCase();
    const room = rooms[roomId];
    if (!room) return;

    room.choices[socket.id] = choice;

    if (Object.keys(room.choices).length === 2) {
      const [p1, p2] = room.players;
      const c1 = room.choices[p1];
      const c2 = room.choices[p2];
      const outcome = getOutcome(c1, c2);

      io.to(p1).emit('rps-result', {
        yourChoice: c1,
        theirChoice: c2,
        outcome: outcome === 'draw' ? 'draw' : outcome === 'p1' ? 'You' : 'Opponent',
      });
      io.to(p2).emit('rps-result', {
        yourChoice: c2,
        theirChoice: c1,
        outcome: outcome === 'draw' ? 'draw' : outcome === 'p2' ? 'You' : 'Opponent',
      });

      room.choices = {};
    }
  });

  socket.on('disconnect', () => {
    for (const [roomId, room] of Object.entries(rooms)) {
      const idx = room.players.indexOf(socket.id);
      if (idx !== -1) {
        room.players.splice(idx, 1);
        delete room.choices[socket.id];
        socket.to(roomId).emit('opponent-left');
        if (room.players.length === 0) delete rooms[roomId];
      }
    }
    console.log(`🔴 ${socket.id} disconnected`);
  });
});

function getOutcome(c1, c2) {
  if (c1 === c2) return 'draw';
  if ((c1 === 'Rock' && c2 === 'Scissors') || (c1 === 'Paper' && c2 === 'Rock') || (c1 === 'Scissors' && c2 === 'Paper'))
    return 'p1';
  return 'p2';
}

/* ───────────────────────────── Misc Routes ───────────────────────────── */
app.get('/', (_req, res) => res.send('Backend is running!'));

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message)
    return res.status(400).json({ error: 'All fields required' });

  console.log('📩 Contact message received:', { name, email, message });
  return res.status(200).json({ success: true, message: 'Message received' });
});

/* ───────────────────────────── Start Server ───────────────────────────── */
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));

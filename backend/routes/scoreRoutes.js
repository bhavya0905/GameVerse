// backend/routes/scoreRoutes.js
const express = require('express');
const router = express.Router();

// GET all scores for a game
router.get('/:gameId', (req, res) => {
  const db = req.app.get('db');
  const { gameId } = req.params;

  db.query(
    'SELECT username, score FROM scores WHERE gameId = ? ORDER BY score DESC LIMIT 10',
    [gameId],
    (err, results) => {
      if (err) {
        console.error('Error fetching scores:', err);
        return res.status(500).json({ error: 'Failed to fetch scores' });
      }
      res.json(results);
    }
  );
});

// POST a new score
router.post('/', (req, res) => {
  const db = req.app.get('db');
  const { username, gameId, score } = req.body;

  if (!username || !gameId || !score) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  db.query(
    'INSERT INTO scores (username, gameId, score) VALUES (?, ?, ?)',
    [username, gameId, score],
    (err, result) => {
      if (err) {
        console.error('Error inserting score:', err);
        return res.status(500).json({ error: 'Failed to save score' });
      }
      res.status(201).json({ message: 'Score saved successfully' });
    }
  );
});

module.exports = router;

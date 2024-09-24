const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./src/config/db');  // MySQL database connection

const app = express();
const port = 3001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Basic route to check the server
app.get('/', (req, res) => {
  res.send('Delgor API is running');
});

// Movies CRUD

// Create (Add a new movie)
app.post('/movies', (req, res) => {
  const { title } = req.body;
  const query = 'INSERT INTO movies (title) VALUES (?)';
  db.query(query, [title], (err, result) => {
    if (err) {
      console.error('Error inserting movie:', err);
      return res.status(500).send('Error inserting movie');
    }
    res.status(201).send('Movie added successfully');
  });
});

// Read (Get all movies)
app.get('/movies', (req, res) => {
  const query = 'SELECT * FROM movies';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching movies:', err);
      return res.status(500).send('Error fetching movies');
    }
    res.status(200).json(results);
  });
});

// Update (Edit a movie's title)
app.put('/movies/:id', (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const query = 'UPDATE movies SET title = ? WHERE id = ?';
  db.query(query, [title, id], (err, result) => {
    if (err) {
      console.error('Error updating movie:', err);
      return res.status(500).send('Error updating movie');
    }
    res.status(200).send('Movie updated successfully');
  });
});

// Delete (Remove a movie)
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const query = 'DELETE FROM movies WHERE id = ?';
  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting movie:', err);
      return res.status(500).send('Error deleting movie');
    }
    res.status(200).send('Movie deleted successfully');
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

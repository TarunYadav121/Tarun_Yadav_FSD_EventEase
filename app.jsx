// Import required packages
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create Express app
const app = express();
const PORT = 3000;

// Enable CORS
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve static files

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root', // Default MySQL username, change if needed
  password: '', // Default MySQL password (blank), change if needed
  database: 'eventease'
});

// Connect to Database
db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to MySQL Database!');
});

// API Endpoint to get all event planners
app.get('/api/event-planners', (req, res) => {
  const query = `SELECT * FROM event_planners`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching planners:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// API Endpoint to get event planners based on event type and location
app.get('/api/search-planners', (req, res) => {
  const eventType = req.query.event_type || '';
  const location = req.query.location || 'Faridabad'; // Default location

  const query = `
    SELECT * FROM event_planners
    WHERE profile LIKE ? AND location LIKE ?
  `;

  db.query(
    query, 
    [`%${eventType}%`, `%${location}%`], 
    (err, results) => {
      if (err) {
        console.error('Error fetching planners:', err);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
      res.json(results);
    }
  );
});

// API Endpoint to get event types
app.get('/api/event-types', (req, res) => {
  const query = `SELECT DISTINCT profile as name FROM event_planners`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching event types:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// API Endpoint to get locations
app.get('/api/locations', (req, res) => {
  const query = `SELECT DISTINCT location FROM event_planners`;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching locations:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
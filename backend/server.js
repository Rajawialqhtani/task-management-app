// Import required modules
const express = require('express');
const mysql = require('mysql2');

// Create an Express app
const app = express();
const PORT = 5000;

// Middleware to parse JSON requests
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Rajawi@505', // Replace with your MySQL password
  database: 'task_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the database connection
pool.query('SELECT 1 + 1 AS solution', (err, results) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('MySQL connection successful:', results[0].solution);
  }
});

// Route to get all tasks
app.get('/tasks', async (req, res) => {
  try {
    const [tasks] = await pool.promise().query('SELECT * FROM tasks');
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to create a new task
app.post('/tasks', async (req, res) => {
  const { title, status } = req.body;
  try {
    const [result] = await pool.promise().query(
      'INSERT INTO tasks (title, status) VALUES (?, ?)',
      [title, status]
    );
    res.status(201).json({ id: result.insertId, title, status });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Route to delete a task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.promise().query('DELETE FROM tasks WHERE id = ?', [id]);
    res.status(200).send('Task deleted successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
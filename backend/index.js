import express from 'express';  // If using ES modules (ensure "type":"module" in package.json)
// const express = require('express');  // If using CommonJS

const app = express();
const PORT = process.env.PORT || 3000;

// Simple middleware to parse JSON bodies (optional)
app.use(express.json());

// Define a “health check” or root endpoint
app.get('/', (req, res) => {
  res.send('Hello, World!');
});

// Example API endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Express server listening on http://localhost:${PORT}`);
});
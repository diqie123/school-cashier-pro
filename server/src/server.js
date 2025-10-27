/**
 * Main server file for the School Cashier Pro API.
 * This file initializes the Express server, sets up middleware,
 * defines API routes, and starts the server.
 */

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import route handlers
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Initialize the Express application
const app = express();

// --- Middleware Setup ---

// Enable Cross-Origin Resource Sharing for all routes
app.use(cors());

// Set various security-related HTTP headers
app.use(helmet());

// Parse incoming JSON payloads
app.use(express.json());

// Log HTTP requests in 'dev' format for better debugging
app.use(morgan('dev'));


// --- API Routes ---

// Mount the route handlers for specific API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/transactions', transactionRoutes);

// A simple root endpoint to confirm the API is running
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the School Cashier Pro API!' });
});

// --- Server Activation ---

// Get the port from environment variables, with a default fallback
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming connections
app.listen(PORT, () => {
  console.log(`Server is running with passion on http://localhost:${PORT}`);
});

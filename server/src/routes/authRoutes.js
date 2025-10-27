/**
 * Defines API routes for authentication-related endpoints.
 */

const express = require('express');
const router = express.Router();
const { login, getUserProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate a user and return a JWT.
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/profile
 * @desc    Get the profile of the currently logged-in user.
 * @access  Private (requires authentication)
 */
router.get('/profile', authenticateToken, getUserProfile);

module.exports = router;

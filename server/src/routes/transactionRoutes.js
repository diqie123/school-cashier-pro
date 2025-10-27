/**
 * Defines API routes for transaction management.
 */

const express = require('express');
const router = express.Router();
const {
  getAllTransactions,
  createTransaction
} = require('../controllers/transactionController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Protect all transaction routes with authentication
router.use(authenticateToken);

/**
 * @route   GET /api/transactions
 * @desc    Get a list of all transactions with optional filtering.
 * @access  Private (All authenticated roles)
 */
router.get('/', getAllTransactions);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction.
 * @access  Private (Admin and Kasir only)
 */
router.post('/', authorizeRole(['admin', 'kasir']), createTransaction);

module.exports = router;

/**
 * Defines API routes for student data management (CRUD operations).
 */

const express = require('express');
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} = require('../controllers/studentController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Protect all student routes with authentication
router.use(authenticateToken);

/**
 * @route   GET /api/students
 * @desc    Get a list of all students.
 * @access  Private (All authenticated roles)
 */
router.get('/', getAllStudents);

/**
 * @route   GET /api/students/:id
 * @desc    Get a single student by their ID.
 * @access  Private (All authenticated roles)
 */
router.get('/:id', getStudentById);

/**
 * @route   POST /api/students
 * @desc    Create a new student.
 * @access  Private (Admin only)
 */
router.post('/', authorizeRole(['admin']), createStudent);

/**
 * @route   PUT /api/students/:id
 * @desc    Update an existing student's data.
 * @access  Private (Admin only)
 */
router.put('/:id', authorizeRole(['admin']), updateStudent);

/**
 * @route   DELETE /api/students/:id
 * @desc    Delete a student.
 * @access  Private (Admin only)
 */
router.delete('/:id', authorizeRole(['admin']), deleteStudent);

module.exports = router;

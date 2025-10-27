/**
 * Controller functions for handling student data (CRUD operations).
 */

const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/dbUtils');

/**
 * Get all students, with optional filtering by search term and class.
 */
const getAllStudents = async (req, res) => {
  try {
    const { search, kelas } = req.query;
    const db = await readData();
    let students = db.students;

    // Apply search filter if provided
    if (search) {
      students = students.filter(s =>
        s.nama.toLowerCase().includes(search.toLowerCase()) ||
        s.nis.includes(search)
      );
    }
    // Apply class filter if provided
    if (kelas) {
      students = students.filter(s => s.kelas === kelas);
    }

    res.status(200).json(students);
  } catch (error) {
    console.error('Error getting students:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Get a single student by their ID.
 */
const getStudentById = async (req, res) => {
  try {
    const db = await readData();
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new student.
 */
const createStudent = async (req, res) => {
  try {
    const { nis, nama, kelas, noTelpWali } = req.body;
    if (!nis || !nama || !kelas || !noTelpWali) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newStudent = {
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };

    const db = await readData();
    db.students.unshift(newStudent); // Add to the beginning of the list
    await writeData(db);

    res.status(201).json(newStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Update an existing student's data.
 */
const updateStudent = async (req, res) => {
  try {
    const db = await readData();
    const studentIndex = db.students.findIndex(s => s.id === req.params.id);

    if (studentIndex === -1) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const updatedStudent = {
      ...db.students[studentIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    db.students[studentIndex] = updatedStudent;
    await writeData(db);

    res.status(200).json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Delete a student.
 */
const deleteStudent = async (req, res) => {
  try {
    const db = await readData();
    const newStudents = db.students.filter(s => s.id !== req.params.id);

    if (newStudents.length === db.students.length) {
      return res.status(404).json({ message: 'Student not found' });
    }

    db.students = newStudents;
    await writeData(db);

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
};

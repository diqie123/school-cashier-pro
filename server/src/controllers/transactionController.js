/**
 * Controller functions for handling transaction data.
 */

const { v4: uuidv4 } = require('uuid');
const { readData, writeData } = require('../utils/dbUtils');

/**
 * Get all transactions, with optional filtering.
 */
const getAllTransactions = async (req, res) => {
  try {
    const db = await readData();
    // In a real app, you would add more complex filtering logic here based on req.query
    const transactions = db.transactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.status(200).json(transactions);
  } catch (error) {
    console.error('Error getting transactions:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Create a new transaction.
 */
const createTransaction = async (req, res) => {
  try {
    const { studentId, items, total } = req.body;
    if (!studentId || !items || !Array.isArray(items) || items.length === 0 || total === undefined) {
      return res.status(400).json({ message: 'Invalid transaction data.' });
    }

    const db = await readData();
    const student = db.students.find(s => s.id === studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found.' });
    }

    const today = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const newTransaction = {
      id: `trx-${uuidv4()}`,
      transactionCode: `TRX-${today}-${String(Date.now()).slice(-4)}`,
      createdAt: new Date().toISOString(),
      studentName: student.nama,
      studentNis: student.nis,
      studentKelas: student.kelas,
      kasir: req.user.nama, // Kasir is the logged-in user
      status: 'Lunas', // Default status, can be expanded
      ...req.body
    };

    db.transactions.unshift(newTransaction);
    await writeData(db);

    res.status(201).json(newTransaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllTransactions,
  createTransaction,
};

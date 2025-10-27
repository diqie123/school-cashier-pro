/**
 * Utility functions for reading from and writing to the JSON database file.
 * This acts as a simple data layer for the application.
 */

const fs = require('fs').promises;
const path = require('path');

// Construct the absolute path to the db.json file
const dbPath = path.join(__dirname, '../../data/db.json');

/**
 * Asynchronously reads the entire database from db.json.
 * @returns {Promise<object>} A promise that resolves to the parsed JSON data from the file.
 */
const readData = async () => {
  try {
    const fileContent = await fs.readFile(dbPath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Error reading from database file:', error);
    // In case of an error (e.g., file not found), return a default structure
    return { users: [], students: [], transactions: [], settings: {} };
  }
};

/**
 * Asynchronously writes data to the db.json file.
 * @param {object} data The JavaScript object to be written to the file.
 * @returns {Promise<void>} A promise that resolves when the file has been successfully written.
 */
const writeData = async (data) => {
  try {
    // Convert the data object to a formatted JSON string (2-space indentation)
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(dbPath, jsonString, 'utf8');
  } catch (error) {
    console.error('Error writing to database file:', error);
  }
};

module.exports = { readData, writeData };

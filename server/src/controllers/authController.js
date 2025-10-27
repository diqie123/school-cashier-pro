/**
 * Controller functions for handling user authentication.
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readData } = require('../utils/dbUtils');

/**
 * Authenticates a user based on username and password.
 * If credentials are valid, it returns a JWT.
 */
const login = async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', { username, password }); // Logging input

  // Basic validation
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }

  try {
    const db = await readData();
    const user = db.users.find(u => u.username === username);
    console.log('User found:', user); // Logging user found

    // Check if user exists and if the password is correct
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      console.log('Password match:', isMatch); // Logging password comparison result
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
    } else {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
    
    // Create a payload for the JWT (do not include sensitive info like password)
    const payload = {
      id: user.id,
      username: user.username,
      nama: user.nama,
      role: user.role,
    };

    // Sign the JWT with a secret key and set an expiration time
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
    
    // Send the token and user info back to the client
    res.json({
      message: 'Login successful!',
      token,
      user: payload
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An internal server error occurred.' });
  }
};

/**
 * Retrieves the profile of the currently authenticated user.
 * The user's information is decoded from the JWT by the auth middleware.
 */
const getUserProfile = async (req, res) => {
    // The user object is attached to the request by the `authenticateToken` middleware
    const { id } = req.user;

    try {
        const db = await readData();
        const user = db.users.find(u => u.id === id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        // Return user data, excluding the password
        const { password, ...userProfile } = user;
        res.json(userProfile);

    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'An internal server error occurred.' });
    }
};

module.exports = {
  login,
  getUserProfile
};

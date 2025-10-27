/**
 * Middleware for handling JWT-based authentication and authorization.
 */

const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate a user by verifying the JWT from the Authorization header.
 * If the token is valid, it attaches the user payload to the request object.
 */
const authenticateToken = (req, res, next) => {
  // Get the token from the 'Authorization' header, typically in the format "Bearer TOKEN"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    // If no token is provided, deny access
    return res.sendStatus(401); // Unauthorized
  }

  // Verify the token using the secret key
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      // If the token is invalid or expired, deny access
      return res.sendStatus(403); // Forbidden
    }
    // Attach the decoded user payload to the request object for use in subsequent handlers
    req.user = user;
    next();
  });
};

/**
 * Middleware factory to authorize users based on their role.
 * @param {string[]} allowedRoles - An array of roles that are allowed to access the route.
 * @returns {function} An Express middleware function.
 */
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    // This middleware must run after authenticateToken, so req.user should be available
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      // If the user's role is not in the allowed list, deny access
      return res.status(403).json({ message: 'Access denied: Insufficient permissions.' });
    }
    // If the user has the required role, proceed to the next handler
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRole,
};

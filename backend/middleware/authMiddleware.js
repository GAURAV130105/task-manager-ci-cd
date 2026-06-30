const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_jwt_secret_change_in_production';

/**
 * Auth Middleware — Verifies JWT token on every protected route.
 * Attaches req.userId so route handlers know who is making the request.
 */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token in the Authorization header
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please log in to continue.',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify token and extract userId from payload
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Session expired. Please log in again.',
    });
  }
};

module.exports = authMiddleware;

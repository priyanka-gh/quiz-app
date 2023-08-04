import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const authMiddleware = express.Router();

authMiddleware.use((req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Failed to authenticate token' });
    }

    // Save user ID for use in other routes
    if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded) {
      // Save user ID for use in other routes
      req.userId = decoded.userId;
  
      next();
    } else {
      return res.status(403).json({ error: 'Invalid token' });
    }
  });
});

export default authMiddleware;

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const verifyToken = async (token) => {
    if (!token) {
        throw new Error('Access denied, no token provided.');
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
        console.error('JWT_SECRET is not defined in .env');
        throw new Error('Server configuration error: JWT secret missing.');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded; // Return the decoded payload
    } catch (err) {
        console.error("JWT Verification Error:", err);
        throw new Error('Invalid token. Try signing back in');
    }
};
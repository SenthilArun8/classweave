// server/src/config/db.js
import mongoose from 'mongoose';
import dotenv from 'dotenv'; // Ensure dotenv is configured if not in server.js root

dotenv.config(); // Call dotenv.config() here if app.js doesn't handle it, or ensure it's called once at the entry point

const MONGODB_URI = process.env.MONGODB_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // Exit process on severe database connection error
    }
};
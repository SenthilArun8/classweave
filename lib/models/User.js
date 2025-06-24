// server/src/models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: String, // Stores the unique token for password reset
  resetPasswordExpires: Date  // Stores the expiration timestamp for the token
}, { timestamps: true });

export default mongoose.model('User', userSchema);

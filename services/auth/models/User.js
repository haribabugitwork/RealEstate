// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['Owner','Agent','Tenant'], default: 'Tenant' },
  refreshToken: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);

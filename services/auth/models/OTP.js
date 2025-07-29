// models/OTP.js (Separate model for OTP management)
import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  otpHash: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,
    required: true,
    enum: ['login', 'registration', 'password_reset'],
    default: 'login',
  },
  attempts: {
    type: Number,
    default: 0,
    max: 5,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expireAfterSeconds: 0 }, // MongoDB TTL for auto-cleanup
  }
}, {
  timestamps: true,
});

// Compound index for efficient queries
otpSchema.index({ email: 1, purpose: 1 });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model('OTP', otpSchema);
// models/User.js (Updated version based on your existing structure)
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  username: {
    type: String,
    required: function() {
      // Username is required for registration but not for OTP-only login
      return this.passwordHash ? true : false;
    },
    unique: true,
    sparse: true, // Allows multiple null values
    trim: true
  },
  passwordHash: { 
    type: String, 
    required: function() {
      // Password is required for registration but not for OTP-only users
      return this.isRegistered ? true : false;
    }
  },
  role: { 
    type: String, 
    enum: ['Owner', 'Agent', 'Tenant'], 
    default: 'Tenant' 
  },
  refreshToken: { 
    type: String,
    default: null
  },
  // New fields for OTP functionality
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isRegistered: {
    type: Boolean,
    default: false // True when user completes full registration
  },
  lastLogin: {
    type: Date,
    default: null
  },
  // Optional profile fields
  profile: {
    firstName: String,
    lastName: String,
    phone: String
  }
}, { 
  timestamps: true 
});

// Index for efficient queries
userSchema.index({ email: 1 });
userSchema.index({ username: 1 }, { sparse: true });

// Virtual for checking if user can login
userSchema.virtual('canLogin').get(function() {
  return this.isEmailVerified;
});

// Method to mark user as fully registered
userSchema.methods.completeRegistration = function() {
  this.isRegistered = true;
  this.isEmailVerified = true;
  return this.save();
};

export default mongoose.model('User', userSchema);
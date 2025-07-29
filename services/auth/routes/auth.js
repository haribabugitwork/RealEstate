// routes/auth.js - SIMPLE WORKING FIX
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import OTP from '../models/OTP.js';

const router = express.Router();

// ✅ SIMPLE WORKING FIX: Email transporter configuration
const createEmailTransporter = () => {
  try {
    console.log('📧 Creating email transporter...');
    console.log('📨 Email User:', process.env.EMAIL_USER);
    console.log('🔑 Email Pass configured:', !!process.env.EMAIL_PASS);
    
    // ✅ DIRECT ACCESS - This should work with nodemailer 6.10.1
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,      // e.g. smtp.gmail.com
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
    
    
    console.log('✅ Email transporter created successfully');
    return transporter;
  } catch (error) {
    console.error('❌ Failed to create email transporter:', error);
    console.error('❌ Nodemailer type:', typeof nodemailer);
    console.error('❌ Nodemailer keys:', Object.keys(nodemailer));
    console.error('❌ Nodemailer createTransporter type:', typeof nodemailer.createTransporter);
    throw error;
  }
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 Attempting to send email to:', email);
    
    const transporter = createEmailTransporter();
    
    // Verify transporter configuration
    await transporter.verify();
    console.log('✅ Email server connection verified');
    
    const mailOptions = {
      from: `"RealEstates" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your RealEstates Login Code',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Your Login Code</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f4; font-family: Arial, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background-color: white;">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">🏠 RealEstates</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">Your trusted property platform</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Your Login Verification Code</h2>
              <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                Hi there! 👋<br><br>
                You requested to log in to your RealEstates account. Use the verification code below to complete your login:
              </p>
              
              <!-- OTP Box -->
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 15px; text-align: center; margin: 30px 0;">
                <div style="color: white; font-size: 18px; margin-bottom: 10px;">Your verification code is:</div>
                <div style="color: white; font-size: 42px; font-weight: bold; letter-spacing: 8px; margin: 0; font-family: 'Courier New', monospace;">${otp}</div>
              </div>
              
              <!-- Instructions -->
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px; margin: 30px 0;">
                <p style="margin: 0; color: #666; font-size: 14px;">
                  <strong>⏰ This code expires in 5 minutes</strong><br>
                  📱 Enter this code in the app to complete your login<br>
                  🔒 Keep this code secure and don't share it with anyone
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.6; margin: 30px 0 0 0;">
                If you didn't request this code, you can safely ignore this email. Your account remains secure.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #eee;">
              <p style="margin: 0; color: #999; font-size: 12px;">
                © 2025 RealEstates. Making property management simple.<br>
                This is an automated message, please do not reply to this email.
              </p>
            </div>
            
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully');
    console.log('📧 Message ID:', info.messageId);
    console.log('📨 Sent to:', email);
    
    return info;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    console.error('Error details:', {
      code: error.code,
      response: error.response,
      responseCode: error.responseCode
    });
    throw error;
  }
};

const signToken = (user) => jwt.sign(
  { id: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);

const signRefreshToken = (user) => jwt.sign(
  { id: user._id },
  process.env.JWT_REFRESH_SECRET,
  { expiresIn: '7d' }
);

// POST /auth/register
router.post('/register', async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    if (!email || !password || !username || !role) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isRegistered) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username is already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    if (existingUser && !existingUser.isRegistered) {
      existingUser.passwordHash = passwordHash;
      existingUser.username = username;
      existingUser.role = role;
      existingUser.isRegistered = true;
      existingUser.isEmailVerified = true;
      await existingUser.save();
    } else {
      const user = new User({ 
        email, 
        passwordHash, 
        username,
        role: role || 'Tenant',
        isRegistered: true,
        isEmailVerified: true
      });
      await user.save();
    }
    
    res.status(201).json({ message: 'User registered' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    const user = await User.findOne({ email, isRegistered: true });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = signToken(user);
    const refreshToken = signRefreshToken(user);
    
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();
    
    res.json({ 
      token, 
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /auth/send-otp
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    console.log('\n🔄 === OTP REQUEST START ===');
    console.log('📧 Email requested:', email);
    console.log('🕐 Timestamp:', new Date().toISOString());

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Email configuration missing');
      return res.status(500).json({ 
        error: 'Email service not configured. Please contact support.',
        code: 'EMAIL_NOT_CONFIGURED'
      });
    }

    console.log('✅ Email configuration check passed');

    // Rate limiting check
    const recentOTP = await OTP.findOne({
      email,
      purpose: 'login',
      createdAt: { $gt: new Date(Date.now() - 60 * 1000) }
    });

    if (recentOTP) {
      console.log('⏰ Rate limit hit for:', email);
      return res.status(429).json({ 
        error: 'OTP was sent recently. Please wait before requesting again.',
        retryAfter: 60
      });
    }

    console.log('✅ Rate limit check passed');

    // Delete existing OTPs
    const deletedCount = await OTP.deleteMany({ email, purpose: 'login' });
    console.log('🗑️ Deleted', deletedCount.deletedCount, 'existing OTPs');

    // Generate OTP
    const otp = generateOTP();
    const otpHash = await bcrypt.hash(otp, 10);

    const otpRecord = await OTP.create({
      email,
      otpHash,
      purpose: 'login',
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    console.log('💾 OTP saved to database with ID:', otpRecord._id);
    console.log('🔢 Generated OTP:', otp); // Remove in production

    // Send email
    try {
      console.log('📧 Attempting to send email...');
      await sendOTPEmail(email, otp);
      console.log('✅ Email sent successfully!');
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      
      // Clean up OTP if email fails
      await OTP.deleteMany({ email, purpose: 'login' });
      console.log('🗑️ Cleaned up OTP after email failure');
      
      // Return specific error messages
      if (emailError.code === 'EAUTH') {
        return res.status(500).json({ 
          error: 'Email authentication failed. Please check your email configuration.',
          code: 'EMAIL_AUTH_FAILED',
          details: 'Invalid email credentials'
        });
      } else if (emailError.code === 'ENOTFOUND') {
        return res.status(500).json({ 
          error: 'Cannot connect to email service. Please try again later.',
          code: 'EMAIL_SERVICE_UNAVAILABLE'
        });
      } else if (emailError.responseCode === 550) {
        return res.status(500).json({ 
          error: 'Email address rejected by server.',
          code: 'EMAIL_REJECTED'
        });
      } else {
        return res.status(500).json({ 
          error: 'Failed to send email. Please try again later.',
          code: 'EMAIL_SEND_FAILED',
          details: emailError.message
        });
      }
    }

    console.log('🎉 === OTP REQUEST SUCCESS ===\n');

    res.json({ 
      message: 'OTP sent successfully. Please check your email.',
      expiresIn: 300
    });

  } catch (error) {
    console.error('❌ === OTP REQUEST FAILED ===');
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    
    res.status(500).json({ 
      error: 'Failed to process OTP request. Please try again.',
      code: 'OTP_REQUEST_FAILED'
    });
  }
});

// POST /auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    console.log('\n🔐 === OTP VERIFICATION START ===');
    console.log('📧 Email:', email);
    console.log('🔢 OTP:', otp);

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' });
    }

    if (!/^\d{6}$/.test(otp)) {
      return res.status(400).json({ error: 'OTP must be a 6-digit number' });
    }

    const otpRecord = await OTP.findOne({
      email,
      purpose: 'login',
      expiresAt: { $gt: new Date() }
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      console.log('❌ No valid OTP found for:', email);
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    console.log('✅ Found OTP record:', otpRecord._id);

    const isValidOTP = await bcrypt.compare(otp, otpRecord.otpHash);
    if (!isValidOTP) {
      console.log('❌ Invalid OTP attempt for:', email);
      otpRecord.attempts = (otpRecord.attempts || 0) + 1;
      
      if (otpRecord.attempts >= 5) {
        await OTP.deleteMany({ email, purpose: 'login' });
        return res.status(429).json({ 
          error: 'Too many failed attempts. Please request a new OTP.' 
        });
      }
      
      await otpRecord.save();
      return res.status(400).json({ 
        error: `Invalid OTP. ${5 - otpRecord.attempts} attempts remaining.` 
      });
    }

    console.log('✅ OTP verified successfully');

    // Delete the OTP
    await OTP.deleteMany({ email, purpose: 'login' });
    console.log('🗑️ OTP deleted after successful verification');

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('👤 Creating new user for:', email);
      user = new User({ 
        email,
        role: 'Tenant',
        isRegistered: false,
        isEmailVerified: true,
        username: `user_${Date.now()}`
      });
      await user.save();
    } else {
      console.log('👤 Existing user found:', user.username);
      user.isEmailVerified = true;
      user.lastLogin = new Date();
    }

    const token = signToken(user);
    const refreshToken = signRefreshToken(user);
    user.refreshToken = refreshToken;
    
    await user.save();

    console.log('🎉 === OTP VERIFICATION SUCCESS ===\n');

    res.json({ 
      token, 
      refreshToken,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isRegistered: user.isRegistered
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('❌ === OTP VERIFICATION FAILED ===');
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to verify OTP. Please try again.' });
  }
});

// POST /auth/refresh
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Missing token' });
  
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid refresh token' });
    }
    
    const newToken = signToken(user);
    const newRefresh = signRefreshToken(user);
    user.refreshToken = newRefresh;
    await user.save();
    
    res.json({ token: newToken, refreshToken: newRefresh });
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

export default router;
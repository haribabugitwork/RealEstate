// routes/allocations.js
import express from 'express';
import Allocation from '../models/Allocation.js';
import { authenticate, authorize } from '../middleware/auth.js';
import nodemailer from 'nodemailer';

const router = express.Router();
router.use(authenticate, authorize('Agent'));

// POST /allocations
router.post('/', async (req, res) => {
  const { propertyId, tenantEmail } = req.body;
  const allocation = new Allocation({
    propertyId,
    tenantEmail,
    status: 'pending',
    invitedAt: new Date()
  });
  await allocation.save();

  // send invite email (stub transporter)
  const transporter = nodemailer.createTransport({ sendmail: true });
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: tenantEmail,
    subject: 'Property Allocation Invitation',
    text: `You have been invited to confirm your allocation. Visit ${process.env.APP_URL}/verify/${allocation._id}`
  });

  res.status(201).json(allocation);
});

// GET /allocations/:id
router.get('/:id', async (req, res) => {
  const allocation = await Allocation.findById(req.params.id);
  if (!allocation) return res.status(404).json({ error: 'Not found' });
  res.json(allocation);
});

export default router;

// routes/payments.js
import express from 'express';
import Payment from '../models/Payment.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate, authorize('Owner', 'Agent'));

// POST /payments
router.post('/', async (req, res) => {
  const { tenantId, amount, date, chequeNumber } = req.body;
  const payment = new Payment({ tenantId, amount, date, chequeNumber });
  await payment.save();
  res.status(201).json(payment);
});

// GET /payments/:tenantId
router.get('/:tenantId', async (req, res) => {
  const payments = await Payment.find({ tenantId: req.params.tenantId });
  res.json(payments);
});

export default router;

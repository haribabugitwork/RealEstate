// routes/complaints.js
import express from 'express';
import Complaint from '../models/Complaint.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

// POST /complaints (Tenant)
router.post('/', authenticate, authorize('Tenant'), async (req, res) => {
  const { tenantId, unitId, description } = req.body;
  const complaint = new Complaint({ tenantId, unitId, description });
  await complaint.save();
  res.status(201).json(complaint);
});

// GET /complaints (Owner/Agent)
router.get('/', authenticate, authorize('Owner', 'Agent'), async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});

// PUT /complaints/:id (Owner/Agent)
router.put('/:id', authenticate, authorize('Owner', 'Agent'), async (req, res) => {
  const updates = (({ status, inventoryItemId }) => ({ status, inventoryItemId }))(req.body);
  const complaint = await Complaint.findByIdAndUpdate(req.params.id, updates, { new: true });
  if (!complaint) return res.status(404).json({ error: 'Not found' });
  res.json(complaint);
});

export default router;

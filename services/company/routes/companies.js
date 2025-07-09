// services/company/routes/companies.js
import express from 'express';
import Company from '../models/Company.js';
import Employee from '../models/Employee.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(authenticate, authorize('Owner', 'Agent'));

// POST /companies
router.post('/', async (req, res) => {
  const { name, adminEmail } = req.body;
  const company = new Company({ name, adminEmail, unitIds: [] });
  await company.save();
  res.status(201).json(company);
});

// POST /companies/:id/employees
router.post('/:id/employees', async (req, res) => {
  const { email, businessTripDates } = req.body;
  const employee = new Employee({
    companyId: req.params.id,
    email,
    tripAssignments: businessTripDates
  });
  await employee.save();
  res.status(201).json(employee);
});

// GET /companies/:id
router.get('/:id', async (req, res) => {
  const company = await Company.findById(req.params.id).lean();
  if (!company) return res.status(404).json({ error: 'Not found' });
  const employees = await Employee.find({ companyId: req.params.id });
  res.json({ ...company, employees });
});

export default router;

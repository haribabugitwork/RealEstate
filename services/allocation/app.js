// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import allocationsRoutes from './routes/allocations.js';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/allocations', allocationsRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Tenant Allocation Service running on port ${PORT}`);
});

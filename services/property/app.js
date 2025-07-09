// app.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import propertiesRoutes from './routes/properties.js';

dotenv.config();
const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use('/properties', propertiesRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Property Inventory Service running on port ${PORT}`);
});

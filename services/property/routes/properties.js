// routes/properties.js
import express from 'express';
import Property from '../models/Property.js';
import { authenticate, authorize } from '../middleware/auth.js';
import multer from 'multer';
import csvParser from 'csv-parser';
import fs from 'fs';

const router = express.Router();

// Apply authentication to all routes
router.use(authenticate);

// GET /properties (with query support)
router.get('/', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 GET /properties route hit');
  console.log('🔍 Query params:', req.query);
  console.log('🔍 User:', req.user);
  
  try {
    // Handle status query parameter
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    
    console.log('🔍 MongoDB filter:', filter);
    const list = await Property.find(filter);
    console.log('✅ Properties found:', list.length);
    res.json(list);
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /properties/:id
router.get('/:id', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 GET /properties/:id route hit');
  console.log('🔍 ID:', req.params.id);
  console.log('🔍 User:', req.user);
  
  try {
    const prop = await Property.findById(req.params.id);
    if (!prop) return res.status(404).json({ error: 'Not found' });
    res.json(prop);
  } catch (error) {
    console.error('❌ Error fetching property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /properties
router.post('/', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 POST /properties route hit');
  console.log('🔍 Body:', req.body);
  console.log('🔍 User:', req.user);
  
  try {
    const prop = new Property(req.body);
    await prop.save();
    res.status(201).json(prop);
  } catch (error) {
    console.error('❌ Error creating property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /properties/:id
router.put('/:id', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 PUT /properties/:id route hit');
  console.log('🔍 ID:', req.params.id);
  console.log('🔍 Body:', req.body);
  console.log('🔍 User:', req.user);
  
  try {
    const updated = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (error) {
    console.error('❌ Error updating property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /properties/:id
router.delete('/:id', authorize('Owner', 'Agent'), async (req, res) => {
  console.log('🔍 DELETE /properties/:id route hit');
  console.log('🔍 ID:', req.params.id);
  console.log('🔍 User:', req.user);
  
  try {
    const removed = await Property.findByIdAndDelete(req.params.id);
    if (!removed) return res.status(404).json({ error: 'Not found' });
    res.status(204).end();
  } catch (error) {
    console.error('❌ Error deleting property:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

const upload = multer({ dest: 'uploads/' });

// POST /properties/seed-csv
router.post('/seed-csv', authorize('Owner', 'Agent'), upload.single('csvFile'), async (req, res) => {
  console.log('📥 POST /properties/seed-csv route hit');
  console.log('📁 Uploaded file:', req.file);

  const filePath = req.file.path;
  const results = [];

  fs.createReadStream(filePath)
    .pipe(csvParser())
    .on('data', (row) => {
      results.push({
        name: row.name,
        location: {
          address: row.address,
          coords: {
            lat: parseFloat(row.lat),
            lng: parseFloat(row.lng)
          }
        },
        status: row.status || 'available',
        vacancyDate: row.vacancyDate ? new Date(row.vacancyDate) : null
      });
    })
    .on('end', async () => {
      try {
        const inserted = await Property.insertMany(results);
        console.log(`✅ Inserted ${inserted.length} properties`);
        fs.unlinkSync(filePath);
        res.json({ message: `✅ Seeded ${inserted.length} properties.` });
      } catch (error) {
        console.error('❌ Failed to insert CSV data:', error);
        res.status(500).json({ error: 'Server error during CSV insert' });
      }
    })
    .on('error', (error) => {
      console.error('❌ CSV Parse error:', error);
      res.status(500).json({ error: 'Failed to parse CSV file' });
    });
});

export default router;
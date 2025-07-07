import { Router } from 'express';
import { getAllThreats, getThreatById, getThreatStats, getAllCategories } from '../controllers/threat.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import express from 'express';
import { spawn } from 'child_process';
import { io } from '../index'; // Import the io instance
const router = Router();

router.use(authenticateToken);

router.get('/', getAllThreats);
router.get('/stats', getThreatStats);
router.get('/categories', getAllCategories);
router.get('/:id', getThreatById);

// POST /api/analyze
router.post('/analyze', async (req, res) => {
  const { description } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }
  try {
    const py = spawn('python', ['ml/predict.py', description]);
    let result = '';
    let error = '';
    py.stdout.on('data', (data) => {
      result += data.toString();
    });
    py.stderr.on('data', (data) => {
      error += data.toString();
    });
    py.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: error || 'Prediction failed' });
      }
      const predicted_category = result.trim();
      // Emit WebSocket event
      io.emit('analysis', {
        description,
        predicted_category,
        timestamp: new Date().toISOString()
      });
      res.json({ predicted_category });
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;

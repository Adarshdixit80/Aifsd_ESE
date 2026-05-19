const express = require('express');
const router = express.Router();
const { analyzeComplaint } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/ai/analyze  (protected)
router.post('/analyze', protect, analyzeComplaint);

module.exports = router;

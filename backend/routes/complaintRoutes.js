const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  searchByLocation,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
} = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');

// GET /api/complaints/search?location=xyz   (must be before /:id)
router.get('/search', searchByLocation);

// GET /api/complaints
router.get('/', getAllComplaints);

// POST /api/complaints  (protected)
router.post('/', protect, createComplaint);

// GET /api/complaints/:id
router.get('/:id', getComplaintById);

// PUT /api/complaints/:id  (protected)
router.put('/:id', protect, updateComplaint);

// DELETE /api/complaints/:id  (protected)
router.delete('/:id', protect, deleteComplaint);

module.exports = router;

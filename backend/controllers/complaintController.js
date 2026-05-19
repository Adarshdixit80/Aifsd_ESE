const Complaint = require('../models/Complaint');

// ─── POST /api/complaints ─────────────────────────────────────────────────────
const createComplaint = async (req, res) => {
  try {
    const { name, email, title, description, category, location, status } =
      req.body;

    // Validate required fields
    if (!name || !email || !title || !description || !category || !location) {
      return res.status(400).json({
        message:
          'All fields are required: name, email, title, description, category, location.',
      });
    }

    const complaint = await Complaint.create({
      name,
      email,
      title,
      description,
      category,
      location,
      status: status || 'Pending',
      createdBy: req.user ? req.user._id : null,
    });

    res.status(201).json({
      message: 'Complaint registered successfully!',
      complaint,
    });
  } catch (error) {
    console.error('Create Complaint Error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    res.status(500).json({ message: 'Server error. Could not save complaint.' });
  }
};

// ─── GET /api/complaints ──────────────────────────────────────────────────────
const getAllComplaints = async (req, res) => {
  try {
    const { category, status, page = 1, limit = 20 } = req.query;

    const filter = {};
    if (category) filter.category = category;
    if (status) filter.status = status;

    const complaints = await Complaint.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Complaint.countDocuments(filter);

    res.status(200).json({
      complaints,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Get Complaints Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not fetch complaints.' });
  }
};

// ─── GET /api/complaints/search?location= ────────────────────────────────────
const searchByLocation = async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res
        .status(400)
        .json({ message: 'Location query parameter is required.' });
    }

    const complaints = await Complaint.find({
      location: { $regex: location, $options: 'i' },
    }).sort({ createdAt: -1 });

    res.status(200).json({ complaints, total: complaints.length });
  } catch (error) {
    console.error('Search Error:', error.message);
    res.status(500).json({ message: 'Server error during search.' });
  }
};

// ─── GET /api/complaints/:id ──────────────────────────────────────────────────
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.status(200).json({ complaint });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid complaint ID format.' });
    }
    console.error('Get Complaint Error:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
};

// ─── PUT /api/complaints/:id ──────────────────────────────────────────────────
const updateComplaint = async (req, res) => {
  try {
    const { status, aiAnalysis } = req.body;

    const updateFields = {};
    if (status) updateFields.status = status;
    if (aiAnalysis) updateFields.aiAnalysis = aiAnalysis;

    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.status(200).json({
      message: 'Complaint updated successfully!',
      complaint,
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid complaint ID format.' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    console.error('Update Complaint Error:', error.message);
    res.status(500).json({ message: 'Server error. Could not update complaint.' });
  }
};

// ─── DELETE /api/complaints/:id ───────────────────────────────────────────────
const deleteComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }
    res.status(200).json({ message: 'Complaint deleted successfully.' });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid complaint ID format.' });
    }
    console.error('Delete Complaint Error:', error.message);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  createComplaint,
  getAllComplaints,
  searchByLocation,
  getComplaintById,
  updateComplaint,
  deleteComplaint,
};

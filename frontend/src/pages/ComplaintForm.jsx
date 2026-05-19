import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { complaintsAPI, aiAPI } from '../services/api';

const CATEGORIES = [
  'Water Supply',
  'Electricity',
  'Roads & Infrastructure',
  'Garbage & Sanitation',
  'Public Safety',
  'Noise Pollution',
  'Other',
];

const initialForm = {
  name: '',
  email: '',
  title: '',
  description: '',
  category: '',
  location: '',
  status: 'Pending',
};

const ComplaintForm = () => {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setError('');
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAnalyze = async () => {
    if (!form.title || !form.description || !form.category) {
      setError('Please fill Title, Description and Category before analyzing.');
      return;
    }
    setAiLoading(true);
    setAiResult(null);
    setError('');
    try {
      const res = await aiAPI.analyze({
        title: form.title,
        description: form.description,
        category: form.category,
        location: form.location,
      });
      setAiResult(res.data.analysis);
    } catch (err) {
      setError(err.message || 'AI analysis failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const required = ['name', 'email', 'title', 'description', 'category', 'location'];
    for (const field of required) {
      if (!form[field]) {
        setError(`Please fill in the ${field} field.`);
        return;
      }
    }

    setLoading(true);
    try {
      const res = await complaintsAPI.create(form);
      setSavedId(res.data.complaint._id);
      setSuccess('✅ Complaint registered successfully!');
      setForm(initialForm);
      setAiResult(null);
    } catch (err) {
      setError(err.message || 'Failed to register complaint.');
    } finally {
      setLoading(false);
    }
  };

  const priorityColor = (p) => {
    if (p === 'High') return '#dc2626';
    if (p === 'Low') return '#16a34a';
    return '#d97706';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📝 Register a Complaint</h1>
        <p>Fill in the details below to submit your complaint</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {success && (
        <div className="alert alert-success">
          {success}{' '}
          {savedId && (
            <button
              className="btn-link"
              onClick={() => navigate(`/complaints/${savedId}`)}
            >
              View Complaint →
            </button>
          )}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="complaint-form card"
        id="complaint-registration-form"
      >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="comp-name">Full Name *</label>
            <input
              id="comp-name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="comp-email">Email Address *</label>
            <input
              id="comp-email"
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comp-title">Complaint Title *</label>
          <input
            id="comp-title"
            type="text"
            name="title"
            placeholder="Brief title of your complaint"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="comp-category">Category *</label>
            <select
              id="comp-category"
              name="category"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Category --</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="comp-location">Location *</label>
            <input
              id="comp-location"
              type="text"
              name="location"
              placeholder="Area, Street, City"
              value={form.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="comp-description">Complaint Description *</label>
          <textarea
            id="comp-description"
            name="description"
            placeholder="Describe your complaint in detail (minimum 10 characters)..."
            value={form.description}
            onChange={handleChange}
            required
            rows={5}
          />
        </div>

        <div className="form-group">
          <label htmlFor="comp-status">Initial Status</label>
          <select
            id="comp-status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
          </select>
        </div>

        {/* AI Analysis Section */}
        <div className="ai-section">
          <button
            type="button"
            id="ai-analyze-btn"
            className="btn-ai"
            onClick={handleAnalyze}
            disabled={aiLoading}
          >
            {aiLoading ? '🔄 Analyzing...' : '🤖 Analyze with AI'}
          </button>
          <span className="ai-hint">
            Get AI-powered priority, department & response suggestions
          </span>
        </div>

        {aiResult && (
          <div className="ai-result-card" id="ai-result-section">
            <h3>🤖 AI Analysis Result</h3>
            <div className="ai-result-grid">
              <div className="ai-result-item">
                <span className="ai-label">Priority</span>
                <span
                  className="ai-badge"
                  style={{ backgroundColor: priorityColor(aiResult.priority) }}
                >
                  {aiResult.priority}
                </span>
              </div>
              <div className="ai-result-item">
                <span className="ai-label">Recommended Department</span>
                <span className="ai-value">{aiResult.department}</span>
              </div>
            </div>
            <div className="ai-summary">
              <strong>Summary:</strong>
              <p>{aiResult.summary}</p>
            </div>
            <div className="ai-response">
              <strong>Auto Response:</strong>
              <p>{aiResult.response}</p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <button
            id="complaint-submit-btn"
            type="submit"
            className="btn-primary"
            disabled={loading}
          >
            {loading ? 'Submitting...' : '📤 Submit Complaint'}
          </button>
          <button
            type="button"
            id="complaint-reset-btn"
            className="btn-secondary"
            onClick={() => {
              setForm(initialForm);
              setAiResult(null);
              setError('');
              setSuccess('');
            }}
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default ComplaintForm;

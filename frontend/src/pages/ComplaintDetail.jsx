import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintsAPI, aiAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

const STATUS_COLORS = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#ef4444',
};

const PRIORITY_COLORS = {
  High: '#dc2626',
  Medium: '#d97706',
  Low: '#16a34a',
};

const ComplaintDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isAdmin } = useAuth();

  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [updateMsg, setUpdateMsg] = useState('');
  const [updating, setUpdating] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        const res = await complaintsAPI.getById(id);
        setComplaint(res.data.complaint);
        setStatus(res.data.complaint.status);
        if (res.data.complaint.aiAnalysis?.priority) {
          setAiResult(res.data.complaint.aiAnalysis);
        }
      } catch (err) {
        setError(err.message || 'Failed to load complaint.');
      } finally {
        setLoading(false);
      }
    };
    fetchComplaint();
  }, [id]);

  const handleStatusUpdate = async () => {
    setUpdating(true);
    setUpdateMsg('');
    setError('');
    try {
      const res = await complaintsAPI.update(id, { status });
      setComplaint(res.data.complaint);
      setUpdateMsg('✅ Status updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to update status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAIAnalysis = async () => {
    setAiLoading(true);
    setError('');
    try {
      const res = await aiAPI.analyze({
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        location: complaint.location,
      });
      const analysis = res.data.analysis;
      setAiResult(analysis);

      // Save AI result to complaint
      await complaintsAPI.update(id, { aiAnalysis: analysis });
    } catch (err) {
      setError(err.message || 'AI analysis failed.');
    } finally {
      setAiLoading(false);
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading complaint...</p>
      </div>
    );
  }

  if (error && !complaint) {
    return (
      <div className="page-container">
        <div className="alert alert-error">{error}</div>
        <button className="btn-primary" onClick={() => navigate('/complaints')}>
          ← Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <button
          id="back-btn"
          className="btn-back"
          onClick={() => navigate('/complaints')}
        >
          ← Back
        </button>
        <h1>Complaint Details</h1>
      </div>

      {error && <div className="alert alert-error">{error}</div>}
      {updateMsg && <div className="alert alert-success">{updateMsg}</div>}

      <div className="detail-grid">
        {/* Complaint Info Card */}
        <div className="card detail-card">
          <div className="detail-header">
            <h2 id="complaint-title">{complaint.title}</h2>
            <span
              className="status-badge"
              style={{ backgroundColor: STATUS_COLORS[complaint.status] }}
            >
              {complaint.status}
            </span>
          </div>

          <div className="detail-info-grid">
            <div className="detail-info-item">
              <span className="detail-label">👤 Name</span>
              <span>{complaint.name}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-label">📧 Email</span>
              <span>{complaint.email}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-label">📂 Category</span>
              <span className="category-tag">{complaint.category}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-label">📍 Location</span>
              <span>{complaint.location}</span>
            </div>
            <div className="detail-info-item">
              <span className="detail-label">📅 Registered On</span>
              <span>{formatDate(complaint.createdAt)}</span>
            </div>
          </div>

          <div className="detail-description">
            <span className="detail-label">📝 Description</span>
            <p>{complaint.description}</p>
          </div>
        </div>

        {/* Right Column */}
        <div className="detail-side">
          {/* Status Update Card */}
          {isAuthenticated && (
            <div className="card">
              <h3>🔄 Update Status</h3>
              <div className="form-group">
                <label htmlFor="status-select">Change Status</label>
                <select
                  id="status-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <button
                id="update-status-btn"
                className="btn-primary btn-full"
                onClick={handleStatusUpdate}
                disabled={updating || status === complaint.status}
              >
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          )}

          {/* AI Analysis Card */}
          {isAuthenticated && (
            <div className="card">
              <h3>🤖 AI Analysis</h3>
              <button
                id="run-ai-btn"
                className="btn-ai btn-full"
                onClick={handleAIAnalysis}
                disabled={aiLoading}
              >
                {aiLoading ? '🔄 Analyzing...' : '🤖 Run AI Analysis'}
              </button>

              {aiResult && (
                <div className="ai-result-detail" id="ai-analysis-result">
                  <div className="ai-priority">
                    <span className="detail-label">Priority</span>
                    <span
                      className="ai-badge"
                      style={{
                        backgroundColor:
                          PRIORITY_COLORS[aiResult.priority] || '#6b7280',
                      }}
                    >
                      {aiResult.priority}
                    </span>
                  </div>
                  <div className="ai-dept">
                    <span className="detail-label">Department</span>
                    <p>{aiResult.department}</p>
                  </div>
                  <div className="ai-summary-box">
                    <span className="detail-label">Summary</span>
                    <p>{aiResult.summary}</p>
                  </div>
                  <div className="ai-response-box">
                    <span className="detail-label">Auto Response</span>
                    <p>{aiResult.response}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;

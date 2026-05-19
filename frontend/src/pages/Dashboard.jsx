import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_COLORS = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#ef4444',
};

const Dashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await complaintsAPI.getAll({ limit: 100 });
        setComplaints(res.data.complaints || []);
      } catch (err) {
        setError(err.message || 'Failed to load data.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Compute stats
  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inProgress = complaints.filter((c) => c.status === 'In Progress').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;
  const rejected = complaints.filter((c) => c.status === 'Rejected').length;

  // Category breakdown
  const categoryCount = complaints.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1;
    return acc;
  }, {});

  // High priority (from AI)
  const highPriority = complaints.filter(
    (c) => c.aiAnalysis?.priority === 'High'
  ).length;

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <p>
          Welcome back, <strong>{user?.name}</strong> &nbsp;
          <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
        </p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid" id="stats-section">
        <div className="stat-card stat-total">
          <div className="stat-icon">📋</div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Complaints</div>
        </div>
        <div className="stat-card stat-pending">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">{pending}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card stat-progress">
          <div className="stat-icon">🔄</div>
          <div className="stat-value">{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card stat-resolved">
          <div className="stat-icon">✅</div>
          <div className="stat-value">{resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
        <div className="stat-card stat-rejected">
          <div className="stat-icon">❌</div>
          <div className="stat-value">{rejected}</div>
          <div className="stat-label">Rejected</div>
        </div>
        <div className="stat-card stat-ai">
          <div className="stat-icon">🤖</div>
          <div className="stat-value">{highPriority}</div>
          <div className="stat-label">High Priority (AI)</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions card">
        <h3>⚡ Quick Actions</h3>
        <div className="action-buttons">
          <Link to="/register-complaint" className="btn-primary" id="dash-register-btn">
            📝 New Complaint
          </Link>
          <Link to="/complaints" className="btn-secondary" id="dash-view-btn">
            📋 View All Complaints
          </Link>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="dashboard-grid">
        <div className="card">
          <h3>📂 Complaints by Category</h3>
          {Object.keys(categoryCount).length === 0 ? (
            <p className="muted-text">No complaints yet.</p>
          ) : (
            <div className="category-list" id="category-breakdown">
              {Object.entries(categoryCount)
                .sort(([, a], [, b]) => b - a)
                .map(([cat, count]) => (
                  <div key={cat} className="category-row">
                    <span className="category-name">{cat}</span>
                    <div className="category-bar-wrap">
                      <div
                        className="category-bar"
                        style={{
                          width: `${(count / total) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="category-count">{count}</span>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Recent Complaints */}
        <div className="card">
          <h3>🕐 Recent Complaints</h3>
          {complaints.length === 0 ? (
            <p className="muted-text">No complaints registered yet.</p>
          ) : (
            <div className="recent-list" id="recent-complaints">
              {complaints.slice(0, 8).map((c) => (
                <div key={c._id} className="recent-item">
                  <div className="recent-info">
                    <Link
                      to={`/complaints/${c._id}`}
                      className="recent-title"
                    >
                      {c.title}
                    </Link>
                    <span className="recent-meta">
                      {c.category} · {formatDate(c.createdAt)}
                    </span>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: STATUS_COLORS[c.status] }}
                  >
                    {c.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

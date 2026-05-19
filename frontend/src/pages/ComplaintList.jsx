import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { complaintsAPI } from '../services/api';

const CATEGORIES = [
  'All',
  'Water Supply',
  'Electricity',
  'Roads & Infrastructure',
  'Garbage & Sanitation',
  'Public Safety',
  'Noise Pollution',
  'Other',
];

const STATUS_COLORS = {
  Pending: '#f59e0b',
  'In Progress': '#3b82f6',
  Resolved: '#10b981',
  Rejected: '#ef4444',
};

const ComplaintList = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [locationSearch, setLocationSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [total, setTotal] = useState(0);

  const fetchComplaints = async (category = '', location = '') => {
    setLoading(true);
    setError('');
    try {
      let res;
      if (location.trim()) {
        setSearching(true);
        res = await complaintsAPI.searchByLocation(location.trim());
        setComplaints(res.data.complaints || []);
        setTotal(res.data.total || 0);
        setSearching(false);
      } else {
        const params = {};
        if (category && category !== 'All') params.category = category;
        res = await complaintsAPI.getAll(params);
        setComplaints(res.data.complaints || []);
        setTotal(res.data.total || 0);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch complaints.');
      setComplaints([]);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  };

  useEffect(() => {
    fetchComplaints(categoryFilter, '');
  }, [categoryFilter]);

  const handleLocationSearch = (e) => {
    e.preventDefault();
    fetchComplaints(categoryFilter, locationSearch);
  };

  const handleClearSearch = () => {
    setLocationSearch('');
    fetchComplaints(categoryFilter, '');
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📋 All Complaints</h1>
        <p>
          Total: <strong>{total}</strong> complaints found
        </p>
      </div>

      {/* Filters */}
      <div className="filter-section card">
        <div className="filter-row">
          <div className="filter-group">
            <label htmlFor="category-filter">Filter by Category</label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setLocationSearch('');
              }}
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <form onSubmit={handleLocationSearch} className="search-group">
            <label htmlFor="location-search">Search by Location</label>
            <div className="search-input-row">
              <input
                id="location-search"
                type="text"
                placeholder="Enter location..."
                value={locationSearch}
                onChange={(e) => setLocationSearch(e.target.value)}
              />
              <button
                id="location-search-btn"
                type="submit"
                className="btn-primary"
                disabled={searching}
              >
                {searching ? '...' : '🔍 Search'}
              </button>
              {locationSearch && (
                <button
                  type="button"
                  id="clear-search-btn"
                  className="btn-secondary"
                  onClick={handleClearSearch}
                >
                  Clear
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading complaints...</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state card">
          <div className="empty-icon">📭</div>
          <h3>No complaints found</h3>
          <p>Try a different filter or search term.</p>
          <Link to="/register-complaint" className="btn-primary">
            Register First Complaint
          </Link>
        </div>
      ) : (
        <div className="table-container card">
          <table className="complaints-table" id="complaints-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Name</th>
                <th>Category</th>
                <th>Location</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((c, i) => (
                <tr key={c._id}>
                  <td>{i + 1}</td>
                  <td className="title-cell">{c.title}</td>
                  <td>{c.name}</td>
                  <td>
                    <span className="category-tag">{c.category}</span>
                  </td>
                  <td>{c.location}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        backgroundColor:
                          STATUS_COLORS[c.status] || '#6b7280',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td>{formatDate(c.createdAt)}</td>
                  <td>
                    <Link
                      to={`/complaints/${c._id}`}
                      id={`view-complaint-${c._id}`}
                      className="btn-view"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ComplaintList;

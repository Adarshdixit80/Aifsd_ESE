import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" id="navbar-logo">
          <span className="brand-icon">📋</span>
          <span>SmartComplaint</span>
        </Link>
      </div>

      <ul className="navbar-links">
        <li>
          <Link
            to="/complaints"
            id="nav-complaints"
            className={isActive('/complaints') ? 'active' : ''}
          >
            All Complaints
          </Link>
        </li>
        {isAuthenticated && (
          <>
            <li>
              <Link
                to="/register-complaint"
                id="nav-register"
                className={isActive('/register-complaint') ? 'active' : ''}
              >
                Register
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard"
                id="nav-dashboard"
                className={isActive('/dashboard') ? 'active' : ''}
              >
                Dashboard
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className="navbar-auth">
        {isAuthenticated ? (
          <div className="navbar-user">
            <span className="user-greeting">
              Hi, <strong>{user?.name?.split(' ')[0]}</strong>
            </span>
            <span className={`role-badge role-${user?.role}`}>{user?.role}</span>
            <button id="nav-logout-btn" className="btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar-guest">
            <Link to="/login" id="nav-login" className="btn-nav-login">
              Login
            </Link>
            <Link to="/signup" id="nav-signup" className="btn-nav-signup">
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

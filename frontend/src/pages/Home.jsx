import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">🏛️ Government Complaint Portal</div>
          <h1 className="hero-title">
            AI-Powered Smart<br />
            <span className="hero-highlight">Complaint Management</span>
          </h1>
          <p className="hero-subtitle">
            Register, track, and resolve civic complaints with the help of
            Artificial Intelligence. Get instant priority detection, department
            routing, and automated responses.
          </p>
          <div className="hero-actions">
            {isAuthenticated ? (
              <>
                <Link to="/register-complaint" id="hero-register-btn" className="btn-primary btn-large">
                  📝 Register Complaint
                </Link>
                <Link to="/dashboard" id="hero-dashboard-btn" className="btn-secondary btn-large">
                  📊 My Dashboard
                </Link>
              </>
            ) : (
              <>
                <Link to="/signup" id="hero-signup-btn" className="btn-primary btn-large">
                  Get Started Free
                </Link>
                <Link to="/complaints" id="hero-view-btn" className="btn-secondary btn-large">
                  View Complaints
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Our System?</h2>
        <div className="features-grid">
          <div className="feature-card" id="feature-ai">
            <div className="feature-icon">🤖</div>
            <h3>AI-Powered Analysis</h3>
            <p>
              Our AI automatically detects complaint priority, recommends the
              right department, and generates professional responses.
            </p>
          </div>
          <div className="feature-card" id="feature-track">
            <div className="feature-icon">📍</div>
            <h3>Real-time Tracking</h3>
            <p>
              Track the status of your complaint from Pending to Resolved with
              live updates and status history.
            </p>
          </div>
          <div className="feature-card" id="feature-secure">
            <div className="feature-icon">🔐</div>
            <h3>Secure & Private</h3>
            <p>
              JWT authentication and bcrypt encryption ensure your data and
              complaints are safe and private.
            </p>
          </div>
          <div className="feature-card" id="feature-fast">
            <div className="feature-icon">⚡</div>
            <h3>Fast Resolution</h3>
            <p>
              AI priority detection ensures high-priority complaints like water
              and electricity issues are flagged immediately.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="steps-section">
        <h2>How It Works</h2>
        <div className="steps-grid">
          <div className="step-card">
            <div className="step-number">1</div>
            <h3>Register</h3>
            <p>Create your account and fill in the complaint form.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h3>AI Analysis</h3>
            <p>Our AI analyzes priority and recommends the department.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h3>Track</h3>
            <p>Monitor the status from your dashboard in real time.</p>
          </div>
          <div className="step-arrow">→</div>
          <div className="step-card">
            <div className="step-number">4</div>
            <h3>Resolved</h3>
            <p>Get notified when your complaint is resolved.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Ready to Register Your Complaint?</h2>
        <p>Join thousands of citizens using our smart complaint system.</p>
        <Link
          to={isAuthenticated ? '/register-complaint' : '/signup'}
          id="cta-btn"
          className="btn-primary btn-large"
        >
          {isAuthenticated ? '📝 Register Complaint' : '🚀 Get Started Now'}
        </Link>
      </section>
    </div>
  );
};

export default Home;

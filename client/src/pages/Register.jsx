import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      return setError('All fields are required.');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters.');
    }
    if (form.password !== confirmPassword) {
      return setError('Passwords do not match.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/register', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Registration failed. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split">
      {/* Left Visual Side */}
      <div className="auth-visual">
        <div className="visual-content" style={{ position: 'relative', zIndex: 2 }}>
          <div className="brand-link" style={{ marginBottom: '2rem' }}>
            <div className="brand-icon">⚡</div>
            <span style={{ fontSize: '2rem', fontWeight: 800 }}>TodoFlow</span>
          </div>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem', letterSpacing: '-2px' }}>
            Design your <br /> ideal workflow.
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '400px' }}>
            Join thousands of high performers and transform your daily productivity.
          </p>
        </div>
        {/* 3D Spline Animation */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
          <spline-viewer url="https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode" style={{ width: '100%', height: '100%' }}></spline-viewer>
        </div>
        {/* Animated Orbs */}
        <div style={{ position: 'absolute', top: '10%', right: '-5%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 1, pointerEvents: 'none' }}></div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header" style={{ textAlign: 'left', marginBottom: '2rem' }}>
            <h1 className="auth-title" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Account</h1>
            <p className="auth-subtitle" style={{ color: 'var(--text-dim)' }}>Start your 14-day pro trial.</p>
          </div>

          {error && <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                id="name"
                name="name"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Min 6 chars"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirm-password" className="form-label">Confirm</label>
                <input
                  id="confirm-password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : 'Create Account'}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            Already have an account?{' '}
            <Link to="/login" className="auth-link" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

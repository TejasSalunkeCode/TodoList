import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
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

    if (!form.email.trim() || !form.password.trim()) {
      return setError('Email and password are required.');
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data.user, res.data.token);
      navigate('/dashboard');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Login failed. Check your credentials.';
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
            The workspace <br /> for high performers.
          </h2>
          <p style={{ fontSize: '1.2rem', color: 'rgba(255,255,255,0.7)', maxWidth: '400px' }}>
            Elevate your productivity with our glassmorphic interface and advanced task workflows.
          </p>
        </div>
        {/* Animated Orbs/Gradients */}
        <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '60%', height: '60%', background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '70%', height: '70%', background: 'radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 70%)', filter: 'blur(80px)' }}></div>
      </div>

      {/* Right Form Side */}
      <div className="auth-form-container">
        <div className="auth-card">
          <div className="auth-header" style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            <h1 className="auth-title" style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sign In</h1>
            <p className="auth-subtitle" style={{ color: 'var(--text-dim)' }}>Welcome back to the flow.</p>
          </div>

          {error && <div className="alert alert-error" role="alert" style={{ marginBottom: '1.5rem' }}>{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form" noValidate>
            <div className="form-group">
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="name@company.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password" className="form-label">Password</label>
              <div className="input-wrap">
                <input
                  id="login-password"
                  name="password"
                  type={showPass ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              id="login-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '1rem' }}
              disabled={loading}
            >
              {loading ? <span className="btn-spinner" /> : 'Enter Dashboard'}
            </button>
          </form>

          <p className="auth-switch" style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
            New here?{' '}
            <Link to="/register" className="auth-link" style={{ color: 'var(--primary)', fontWeight: 600 }}>Create your profile</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

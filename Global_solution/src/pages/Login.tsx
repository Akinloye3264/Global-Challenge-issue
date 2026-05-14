import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Mail, Lock, Eye, EyeOff, Globe,
  AlertTriangle, ShieldCheck, ArrowRight
} from 'lucide-react';
import { signIn } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await signIn(email, password);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      {/* Left Brand Panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <div className="auth-shield-icon">
            <Shield size={56} strokeWidth={1.5} />
          </div>
          <h1 className="auth-brand-title">Afya Shield</h1>
          <p className="auth-brand-tagline">Protecting Lives Through Data</p>
          <div className="auth-brand-divider" />
          <p className="auth-brand-description">
            AI-powered cholera outbreak prediction system for NGOs operating in South Sudan.
            Real-time analysis. Actionable insights. Faster response.
          </p>
          <div className="auth-stats-grid">
            <div className="auth-stat-card">
              <span className="auth-stat-value">95%</span>
              <span className="auth-stat-label">Prediction Accuracy</span>
            </div>
            <div className="auth-stat-card">
              <span className="auth-stat-value">48h</span>
              <span className="auth-stat-label">Faster Response</span>
            </div>
            <div className="auth-stat-card">
              <span className="auth-stat-value">WHO</span>
              <span className="auth-stat-label">Data Standards</span>
            </div>
          </div>
          <div className="auth-brand-badge">
            <Globe size={14} />
            <span>Serving South Sudan &amp; Sub-Saharan Africa</span>
          </div>
        </div>
        <div className="auth-brand-bg-circles">
          <div className="auth-circle auth-circle-1" />
          <div className="auth-circle auth-circle-2" />
          <div className="auth-circle auth-circle-3" />
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2 className="auth-form-title">Welcome back</h2>
            <p className="auth-form-subtitle">Sign in to your Afya Shield account</p>
          </div>

          {error && (
            <div className="auth-error-banner">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field-group">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Mail size={16} /></span>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@organization.org"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Lock size={16} /></span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="auth-input auth-input-padded"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-toggle-password"
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-spinner" />
                  Signing in...
                </span>
              ) : (
                <span className="auth-btn-content">
                  Sign In <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <p className="auth-switch-text">
              Don't have an account?{' '}
              <Link to="/signup" className="auth-switch-link">Create one free</Link>
            </p>
          </div>

          <div className="auth-secure-note">
            <ShieldCheck size={13} />
            <span>Secured with JWT encryption &amp; HTTPS</span>
          </div>
        </div>
      </div>
    </div>
  );
}

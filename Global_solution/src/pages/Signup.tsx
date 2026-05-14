import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Mail, Lock, Eye, EyeOff, Globe,
  AlertTriangle, ShieldCheck, ArrowRight,
  User, Building2, Bot
} from 'lucide-react';
import { signUp } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Signup() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', organization: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function update(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');

    setLoading(true);
    try {
      const data = await signUp(form.name, form.email, form.password, form.organization);
      login(data.token, data.user);
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Registration failed. Please try again.');
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
            Join the network of NGOs using AI-powered data analysis to respond faster to
            cholera outbreaks across South Sudan and sub-Saharan Africa.
          </p>
          <div className="auth-features-list">
            <div className="auth-feature-item">
              <span className="auth-feature-icon"><Bot size={26} /></span>
              <div>
                <strong>AI-Powered Analysis</strong>
                <p>Processes outbreak data and generates actionable insights in seconds</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon"><Mail size={26} /></span>
              <div>
                <strong>Instant Reports</strong>
                <p>Receive detailed prediction reports directly in your inbox</p>
              </div>
            </div>
            <div className="auth-feature-item">
              <span className="auth-feature-icon"><Globe size={26} /></span>
              <div>
                <strong>WHO Standards</strong>
                <p>Recommendations aligned with WHO GTFCC cholera response protocols</p>
              </div>
            </div>
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
            <h2 className="auth-form-title">Create your account</h2>
            <p className="auth-form-subtitle">Free access for NGOs &amp; health organizations</p>
          </div>

          {error && (
            <div className="auth-error-banner">
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-fields-row">
              <div className="auth-field-group">
                <label className="auth-label">Full Name</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><User size={16} /></span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="Dr. Jane Doe"
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="auth-field-group">
                <label className="auth-label">Organization</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Building2 size={16} /></span>
                  <input
                    type="text"
                    className="auth-input"
                    placeholder="MSF, UNICEF, WHO..."
                    value={form.organization}
                    onChange={e => update('organization', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="auth-field-group">
              <label className="auth-label">Email address</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon"><Mail size={16} /></span>
                <input
                  type="email"
                  className="auth-input"
                  placeholder="you@organization.org"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="auth-fields-row">
              <div className="auth-field-group">
                <label className="auth-label">Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Lock size={16} /></span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="auth-input auth-input-padded"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={e => update('password', e.target.value)}
                    required
                  />
                  <button type="button" className="auth-toggle-password" onClick={() => setShowPassword(v => !v)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div className="auth-field-group">
                <label className="auth-label">Confirm Password</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon"><Lock size={16} /></span>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="auth-input auth-input-padded"
                    placeholder="••••••••"
                    value={form.confirmPassword}
                    onChange={e => update('confirmPassword', e.target.value)}
                    required
                  />
                  <button type="button" className="auth-toggle-password" onClick={() => setShowConfirmPassword(v => !v)}>
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <span className="auth-btn-loading">
                  <span className="auth-spinner" />
                  Creating account...
                </span>
              ) : (
                <span className="auth-btn-content">
                  Create Free Account <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <div className="auth-form-footer">
            <p className="auth-switch-text">
              Already have an account?{' '}
              <Link to="/login" className="auth-switch-link">Sign in</Link>
            </p>
          </div>

          <div className="auth-secure-note">
            <ShieldCheck size={13} />
            <span>Your data is encrypted and never shared with third parties</span>
          </div>
        </div>
      </div>
    </div>
  );
}

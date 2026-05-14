import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { verifyEmailToken } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

type Status = 'loading' | 'success' | 'error';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check your email link.');
      return;
    }

    verifyEmailToken(token)
      .then(data => {
        login(data.token, data.user);
        setStatus('success');
      })
      .catch(err => {
        const msg = err?.response?.data?.message || 'Verification failed. The link may have expired.';
        setMessage(msg);
        setStatus('error');
      });
  }, []);

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-brand">
          <Shield size={28} strokeWidth={1.5} className="verify-brand-icon" />
          <span>Afya Shield</span>
        </div>

        {status === 'loading' && (
          <div className="verify-state">
            <Loader2 size={48} className="verify-spinner-icon" />
            <h2>Verifying your email...</h2>
            <p>Please wait while we confirm your account.</p>
          </div>
        )}

        {status === 'success' && (
          <div className="verify-state">
            <CheckCircle size={52} className="verify-success-icon" />
            <h2>Email Verified</h2>
            <p>Your account is now fully active. You can start using Afya Shield.</p>
            <button className="verify-cta-btn" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="verify-state">
            <XCircle size={52} className="verify-error-icon" />
            <h2>Verification Failed</h2>
            <p>{message}</p>
            <div className="verify-error-actions">
              <button className="verify-cta-btn" onClick={() => navigate('/login')}>
                Sign In
              </button>
              <button className="verify-secondary-btn" onClick={() => navigate('/signup')}>
                Create Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

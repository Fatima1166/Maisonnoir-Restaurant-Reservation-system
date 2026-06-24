import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './VerifyEmailPage.css';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';
  const tokenParam = searchParams.get('token') || '';

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

  useEffect(() => {
    if (emailParam && tokenParam) {
      const verifyEmail = async () => {
        setIsLoading(true);
        setError('');
        setMessage('Verifying your email, please wait...');

        try {
          const response = await fetch(`${API_BASE}/auth/verify-email`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: emailParam, token: tokenParam }),
          });

          const data = await response.json();

          if (response.ok) {
            setMessage('Email verified successfully! Redirecting to login...');
            setTimeout(() => {
              navigate('/login');
            }, 2500);
          } else {
            setError(data.message || 'Verification failed. The link may have expired or is invalid.');
          }
        } catch (err) {
          console.error(err);
          setError('An error occurred during verification.');
        } finally {
          setIsLoading(false);
        }
      };

      verifyEmail();
    }
  }, [emailParam, tokenParam, navigate, API_BASE]);

  return (
    <div className="verify-page">
      <div className="verify-container animate-scaleIn">
        <div className="verify-card">
          <h2>Email Verification</h2>
          
          {emailParam && tokenParam ? (
            <div className="verification-status">
              {isLoading && (
                <div className="spinner-container">
                  <div className="loading-spinner"></div>
                  <p className="loading-text">{message}</p>
                </div>
              )}
              
              {error && (
                <div className="status-error">
                  <div className="error-icon">❌</div>
                  <p className="error-message">{error}</p>
                  <button onClick={() => navigate('/login')} className="btn-primary" style={{ marginTop: '20px' }}>
                    Go to Login
                  </button>
                </div>
              )}
              
              {!isLoading && message && !error && (
                <div className="status-success">
                  <div className="success-icon">✓</div>
                  <p className="success-message">{message}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="verification-instruction">
              <div className="mail-icon">✉</div>
              <h3>Please Check Your Email</h3>
              <p>
                We've sent a verification link to your registered email address. 
                Please click the link inside the email to verify your account and enable login.
              </p>
              <button onClick={() => navigate('/login')} className="btn-secondary" style={{ marginTop: '20px', width: '100%' }}>
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { login, register } from '../api';
import './Auth.css';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = isLogin
        ? await login(name, password)
        : await register(name, password);

      loginUser(res.data.user, res.data.token);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      {/* Decorative Neo Stickers */}
      <div className="auth-sticker auth-sticker-1">✦ GET SH*T DONE ✦</div>
      <div className="auth-sticker auth-sticker-2">★ 100% FOCUS ★</div>

      <div className="auth-window">
        {/* Retro Window Title Bar */}
        <div className="window-header">
          <div className="window-controls">
            <span className="win-dot win-dot-red"></span>
            <span className="win-dot win-dot-yellow"></span>
            <span className="win-dot win-dot-green"></span>
          </div>
          <span className="window-title">TRACKER.EXE — AUTH</span>
          <div className="window-close-btn">✕</div>
        </div>

        <div className="auth-card-body">
          {/* Main Title Badge */}
          <div className="auth-hero-badge">
            <span className="auth-tag">STUDENT EDITION</span>
            <h1 className="auth-title">CHALLENGE</h1>
            <p className="auth-subtext">
              {isLogin ? 'Welcome back! Ready to crush your tasks?' : 'Create your account to start tracking.'}
            </p>
          </div>

          {/* Neo-brutalist Switcher Tabs */}
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(true); setError(''); }}
            >
              SIGN IN
            </button>
            <button
              type="button"
              className={`auth-tab ${!isLogin ? 'active' : ''}`}
              onClick={() => { setIsLogin(false); setError(''); }}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="neo-field">
              <label htmlFor="auth-name">STUDENT NAME</label>
              <div className="neo-input-wrap">
                <span className="neo-input-icon">👤</span>
                <input
                  id="auth-name"
                  type="text"
                  placeholder="e.g. alex_runner"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  minLength={2}
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="neo-field">
              <label htmlFor="auth-password">PASSWORD</label>
              <div className="neo-input-wrap">
                <span className="neo-input-icon">🔑</span>
                <input
                  id="auth-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={4}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
              </div>
            </div>

            {error && (
              <div className="neo-error-alert">
                <span className="neo-alert-icon">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <button type="submit" className="neo-submit-btn" disabled={loading}>
              {loading ? (
                <span className="neo-spinner">LOADING...</span>
              ) : (
                isLogin ? 'ENTER DASHBOARD ➔' : 'CREATE ACCOUNT ➔'
              )}
            </button>
          </form>

          {/* Footer badge */}
          <div className="auth-footer-note font-mono">
            <span>● 24/7 ONLINE CLOUD DB</span>
          </div>
        </div>
      </div>
    </div>
  );
}

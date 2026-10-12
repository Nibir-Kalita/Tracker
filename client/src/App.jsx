import { AuthProvider, useAuth } from './context/AuthContext';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import './index.css';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-canvas)'
      }}>
        <div style={{
          padding: '16px 28px',
          background: '#ffffff',
          border: '3px solid #000000',
          boxShadow: '6px 6px 0px #000000',
          borderRadius: '12px',
          fontWeight: 800,
          fontFamily: "'Space Mono', monospace",
          fontSize: '0.9rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{
            display: 'inline-block',
            width: '16px',
            height: '16px',
            background: 'var(--neo-yellow)',
            border: '2px solid #000',
            animation: 'neoSpin 1s infinite linear'
          }}></span>
          <span>LOADING SYSTEM...</span>
        </div>
        <style>{`
          @keyframes neoSpin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return user ? <Dashboard /> : <Auth />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

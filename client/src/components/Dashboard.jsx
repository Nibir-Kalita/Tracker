import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks } from '../api';
import Calendar from './Calendar';
import TaskList from './TaskList';
import Progress from './Progress';
import './Dashboard.css';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [activeTab, setActiveTab] = useState('tasks');

  const loadTasks = useCallback(async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch {
      // handled by interceptor
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="neo-dash-container">
      {/* Top Header Card */}
      <header className="neo-dash-header">
        <div className="neo-header-user">
          <div className="neo-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="neo-user-meta">
            <span className="neo-greeting font-mono">{greeting()},</span>
            <h2 className="neo-username">{user?.name}</h2>
          </div>
        </div>

        <div className="neo-header-actions">
          <div className="neo-status-pill font-mono">
            <span className="neo-live-indicator"></span> 24/7 SYNC
          </div>
          <button className="neo-logout-btn" onClick={logout} aria-label="Logout" title="Logout">
            <span className="font-mono">LOGOUT</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </header>

      {/* Hero Banner (like Reference 2: "Save now. Find anytime.") */}
      <div className="neo-banner">
        <div className="neo-banner-left">
          <span className="neo-banner-badge font-mono">DAILY FOCUS</span>
          <h1 className="neo-banner-heading">Track tasks. Stay ahead.</h1>
        </div>
        <div className="neo-banner-right">
          <div className="neo-quick-stat font-mono">
            <span className="neo-quick-val">{tasks.filter(t => !t.completed).length}</span>
            <span className="neo-quick-label">DUE TODAY</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <main className="neo-dash-content">
        {/* Calendar Panel */}
        <div className={`neo-panel neo-panel-calendar ${activeTab === 'calendar' ? 'mobile-visible' : ''}`}>
          <Calendar tasks={tasks} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        {/* Tasks Panel */}
        <div className={`neo-panel neo-panel-tasks ${activeTab === 'tasks' ? 'mobile-visible' : ''}`}>
          <TaskList tasks={tasks} selectedDate={selectedDate} onRefresh={loadTasks} />
        </div>

        {/* Progress Panel */}
        <div className={`neo-panel neo-panel-progress ${activeTab === 'progress' ? 'mobile-visible' : ''}`}>
          <Progress />
        </div>
      </main>

      {/* Mobile Floating Bottom Navigation Dock */}
      <nav className="neo-bottom-nav">
        <button
          className={`neo-nav-item ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <span className="neo-nav-icon">📋</span>
          <span className="neo-nav-text">Tasks</span>
        </button>
        <button
          className={`neo-nav-item ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <span className="neo-nav-icon">📅</span>
          <span className="neo-nav-text">Calendar</span>
        </button>
        <button
          className={`neo-nav-item ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <span className="neo-nav-icon">⚡</span>
          <span className="neo-nav-text">Progress</span>
        </button>
      </nav>
    </div>
  );
}

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
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dash-header">
        <div className="dash-user">
          <div className="dash-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="dash-greeting">{greeting()}</span>
            <h2 className="dash-name">{user?.name}</h2>
          </div>
        </div>
        <button className="dash-logout" onClick={logout} aria-label="Logout">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="dash-tabs">
        <button
          className={`dash-tab ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 11l3 3L22 4"/>
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
          </svg>
          <span>Tasks</span>
        </button>
        <button
          className={`dash-tab ${activeTab === 'calendar' ? 'active' : ''}`}
          onClick={() => setActiveTab('calendar')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span>Calendar</span>
        </button>
        <button
          className={`dash-tab ${activeTab === 'progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('progress')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M18 20V10M12 20V4M6 20v-6"/>
          </svg>
          <span>Progress</span>
        </button>
      </nav>

      {/* Content */}
      <main className="dash-content">
        {/* Desktop: show all panels. Mobile: show active tab */}
        <div className={`dash-panel dash-panel-calendar ${activeTab === 'calendar' || activeTab === 'tasks' ? 'show-mobile' : ''}`}>
          <Calendar tasks={tasks} selectedDate={selectedDate} onDateSelect={setSelectedDate} />
        </div>

        <div className={`dash-panel dash-panel-tasks ${activeTab === 'tasks' ? 'show-mobile' : ''}`}>
          <TaskList tasks={tasks} selectedDate={selectedDate} onRefresh={loadTasks} />
        </div>

        <div className={`dash-panel dash-panel-progress ${activeTab === 'progress' ? 'show-mobile' : ''}`}>
          <Progress />
        </div>
      </main>

      {/* SVG gradient def for progress circle */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="prog-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--purple)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

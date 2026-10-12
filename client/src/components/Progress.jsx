import { useState, useEffect } from 'react';
import { getProgress } from '../api';
import './Progress.css';

export default function Progress() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await getProgress();
      setStats(res.data);
    } catch {
      // handled
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="progress-card">
        <div className="prog-loading">
          <div className="prog-skeleton"></div>
          <div className="prog-skeleton"></div>
          <div className="prog-skeleton"></div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const { totalTasks, completedTasks, pendingTasks, completionRate, dailyStats, priorityStats } = stats;

  // Build last 7 days labels
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    last7Days.push(d.toISOString().split('T')[0]);
  }

  const maxDaily = Math.max(...last7Days.map((day) => {
    const stat = dailyStats.find((s) => s._id === day);
    return stat ? stat.total : 0;
  }), 1);

  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="progress-card">
      <h3 className="prog-title">Progress</h3>

      {/* Circular progress */}
      <div className="prog-circle-wrap">
        <svg className="prog-circle" viewBox="0 0 120 120">
          <circle className="prog-circle-bg" cx="60" cy="60" r="50" />
          <circle
            className="prog-circle-fill"
            cx="60" cy="60" r="50"
            strokeDasharray={`${2 * Math.PI * 50}`}
            strokeDashoffset={`${2 * Math.PI * 50 * (1 - completionRate / 100)}`}
          />
        </svg>
        <div className="prog-circle-text">
          <span className="prog-percent">{completionRate}%</span>
          <span className="prog-label">Done</span>
        </div>
      </div>

      {/* Stats row */}
      <div className="prog-stats">
        <div className="prog-stat">
          <span className="prog-stat-val">{totalTasks}</span>
          <span className="prog-stat-label">Total</span>
        </div>
        <div className="prog-stat-divider"></div>
        <div className="prog-stat">
          <span className="prog-stat-val prog-stat-done">{completedTasks}</span>
          <span className="prog-stat-label">Done</span>
        </div>
        <div className="prog-stat-divider"></div>
        <div className="prog-stat">
          <span className="prog-stat-val prog-stat-pending">{pendingTasks}</span>
          <span className="prog-stat-label">Pending</span>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="prog-chart">
        <h4>This Week</h4>
        <div className="prog-bars">
          {last7Days.map((day) => {
            const stat = dailyStats.find((s) => s._id === day);
            const total = stat ? stat.total : 0;
            const completed = stat ? stat.completed : 0;
            const d = new Date(day + 'T12:00:00');
            const label = dayLabels[d.getDay()];
            const isToday = day === new Date().toISOString().split('T')[0];

            return (
              <div key={day} className={`prog-bar-col ${isToday ? 'prog-bar-today' : ''}`}>
                <div className="prog-bar-track">
                  <div
                    className="prog-bar-fill prog-bar-total"
                    style={{ height: `${(total / maxDaily) * 100}%` }}
                  ></div>
                  <div
                    className="prog-bar-fill prog-bar-completed"
                    style={{ height: `${(completed / maxDaily) * 100}%` }}
                  ></div>
                </div>
                <span className="prog-bar-label">{label}</span>
              </div>
            );
          })}
        </div>
        <div className="prog-legend">
          <span><span className="prog-legend-dot prog-legend-total"></span>Total</span>
          <span><span className="prog-legend-dot prog-legend-completed"></span>Done</span>
        </div>
      </div>

      {/* Priority breakdown */}
      {priorityStats.length > 0 && (
        <div className="prog-priorities">
          <h4>By Priority</h4>
          {['high', 'medium', 'low'].map((p) => {
            const stat = priorityStats.find((s) => s._id === p);
            if (!stat) return null;
            const pct = totalTasks > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
            const colors = { high: 'var(--red)', medium: 'var(--yellow)', low: 'var(--green)' };

            return (
              <div key={p} className="prog-priority-row">
                <span className="prog-priority-label">{p}</span>
                <div className="prog-priority-bar">
                  <div
                    className="prog-priority-fill"
                    style={{ width: `${pct}%`, background: colors[p] }}
                  ></div>
                </div>
                <span className="prog-priority-pct">{pct}%</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

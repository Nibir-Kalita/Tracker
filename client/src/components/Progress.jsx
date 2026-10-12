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
      <div className="neo-card neo-prog-card">
        <div className="neo-card-header">
          <div className="neo-window-dots">
            <span className="neo-dot neo-dot-red"></span>
            <span className="neo-dot neo-dot-yellow"></span>
            <span className="neo-dot neo-dot-green"></span>
          </div>
          <span className="neo-card-title font-mono">PROGRESS.STATS</span>
        </div>
        <div className="neo-prog-loading font-mono">
          <p>FETCHING STATS...</p>
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
    const stat = (dailyStats || []).find((s) => s._id === day);
    return stat ? stat.total : 0;
  }), 1);

  const dayLabels = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="neo-card neo-prog-card">
      {/* Window Header */}
      <div className="neo-card-header neo-prog-header">
        <div className="neo-window-dots">
          <span className="neo-dot neo-dot-red"></span>
          <span className="neo-dot neo-dot-yellow"></span>
          <span className="neo-dot neo-dot-green"></span>
        </div>
        <span className="neo-card-title font-mono">PROGRESS.EXE</span>
        <span className="neo-prog-pill font-mono">{completionRate}% DONE</span>
      </div>

      <div className="neo-prog-body">
        {/* Gauge / Percentage Block */}
        <div className="neo-gauge-box">
          <div className="neo-gauge-ring-wrap">
            <svg className="neo-gauge-svg" viewBox="0 0 120 120">
              <circle className="neo-gauge-bg" cx="60" cy="60" r="48" />
              <circle
                className="neo-gauge-val"
                cx="60" cy="60" r="48"
                strokeDasharray={`${2 * Math.PI * 48}`}
                strokeDashoffset={`${2 * Math.PI * 48 * (1 - completionRate / 100)}`}
              />
            </svg>
            <div className="neo-gauge-inner">
              <span className="neo-gauge-number font-mono">{completionRate}%</span>
              <span className="neo-gauge-label font-mono">COMPLETED</span>
            </div>
          </div>
        </div>

        {/* 3 Metric Scorecards */}
        <div className="neo-metrics-grid">
          <div className="neo-metric-card card-blue">
            <span className="neo-metric-num font-mono">{totalTasks}</span>
            <span className="neo-metric-label font-mono">TOTAL</span>
          </div>
          <div className="neo-metric-card card-green">
            <span className="neo-metric-num font-mono">{completedTasks}</span>
            <span className="neo-metric-label font-mono">DONE</span>
          </div>
          <div className="neo-metric-card card-yellow">
            <span className="neo-metric-num font-mono">{pendingTasks}</span>
            <span className="neo-metric-label font-mono">PENDING</span>
          </div>
        </div>

        {/* 7-Day Weekly Bar Chart */}
        <div className="neo-chart-container">
          <div className="neo-chart-title font-mono">
            <span>WEEKLY ACTIVITY</span>
            <span className="chart-sub">LAST 7 DAYS</span>
          </div>
          <div className="neo-chart-bars">
            {last7Days.map((day) => {
              const stat = (dailyStats || []).find((s) => s._id === day);
              const total = stat ? stat.total : 0;
              const completed = stat ? stat.completed : 0;
              const d = new Date(day + 'T12:00:00');
              const label = dayLabels[d.getDay()];
              const isToday = day === new Date().toISOString().split('T')[0];

              return (
                <div key={day} className={`neo-bar-group ${isToday ? 'today-col' : ''}`}>
                  <div className="neo-bar-track">
                    <div
                      className="neo-bar-total"
                      style={{ height: `${(total / maxDaily) * 100}%` }}
                      title={`Total: ${total}`}
                    ></div>
                    <div
                      className="neo-bar-done"
                      style={{ height: `${(completed / maxDaily) * 100}%` }}
                      title={`Completed: ${completed}`}
                    ></div>
                  </div>
                  <span className="neo-bar-label font-mono">{label}</span>
                </div>
              );
            })}
          </div>
          <div className="neo-chart-legend font-mono">
            <span><span className="legend-indicator legend-total"></span> TOTAL</span>
            <span><span className="legend-indicator legend-done"></span> DONE</span>
          </div>
        </div>

        {/* Priority Breakdown */}
        {priorityStats && priorityStats.length > 0 && (
          <div className="neo-priority-breakdown">
            <span className="neo-pb-title font-mono">BY PRIORITY LEVEL</span>
            <div className="neo-pb-rows">
              {['high', 'medium', 'low'].map((p) => {
                const stat = priorityStats.find((s) => s._id === p);
                if (!stat) return null;
                const pct = stat.total > 0 ? Math.round((stat.completed / stat.total) * 100) : 0;
                const colors = { high: 'var(--neo-pink)', medium: 'var(--neo-yellow)', low: 'var(--neo-green)' };

                return (
                  <div key={p} className="neo-pb-row">
                    <span className="neo-pb-label font-mono">{p.toUpperCase()}</span>
                    <div className="neo-pb-bar-track">
                      <div
                        className="neo-pb-bar-fill"
                        style={{ width: `${pct}%`, background: colors[p] }}
                      ></div>
                    </div>
                    <span className="neo-pb-pct font-mono">{pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

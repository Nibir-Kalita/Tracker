import { useState, useMemo } from 'react';
import './Calendar.css';

export default function Calendar({ tasks, selectedDate, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate || Date.now()));

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ day: daysInPrevMonth - i, type: 'prev', date: new Date(year, month - 1, daysInPrevMonth - i) });
    }

    // Current month days
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, type: 'current', date: new Date(year, month, d) });
    }

    // Next month days to fill grid
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ day: d, type: 'next', date: new Date(year, month + 1, d) });
    }

    return days;
  }, [year, month]);

  const tasksByDate = useMemo(() => {
    const map = {};
    (tasks || []).forEach((task) => {
      const key = new Date(task.date).toDateString();
      if (!map[key]) map[key] = { total: 0, completed: 0, hasPriority: false };
      map[key].total++;
      if (task.completed) map[key].completed++;
      if (task.priority === 'high') map[key].hasPriority = true;
    });
    return map;
  }, [tasks]);

  const today = new Date().toDateString();
  const selectedStr = selectedDate ? new Date(selectedDate).toDateString() : '';

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));
  const goToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    onDateSelect(now.toISOString().split('T')[0]);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  return (
    <div className="neo-card neo-cal-card">
      {/* Window Title Header */}
      <div className="neo-card-header neo-cal-header-bar">
        <div className="neo-window-dots">
          <span className="neo-dot neo-dot-red"></span>
          <span className="neo-dot neo-dot-yellow"></span>
          <span className="neo-dot neo-dot-green"></span>
        </div>
        <span className="neo-card-title font-mono">CALENDAR.APP</span>
        <button className="neo-today-pill font-mono" onClick={goToday}>TODAY</button>
      </div>

      <div className="neo-cal-body">
        {/* Month Navigation Row */}
        <div className="neo-cal-month-nav">
          <button className="neo-cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
            ◀
          </button>
          <div className="neo-cal-month-label">
            <h3>{monthNames[month]} {year}</h3>
          </div>
          <button className="neo-cal-nav-btn" onClick={nextMonth} aria-label="Next month">
            ▶
          </button>
        </div>

        {/* Weekday Names */}
        <div className="neo-cal-weekdays font-mono">
          {dayNames.map((d) => (
            <div key={d} className="neo-cal-weekday">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="neo-cal-grid">
          {calendarDays.map((d, i) => {
            const dateStr = d.date.toDateString();
            const info = tasksByDate[dateStr];
            const isToday = dateStr === today;
            const isSelected = dateStr === selectedStr;

            return (
              <button
                key={i}
                type="button"
                className={`neo-cal-cell ${d.type !== 'current' ? 'neo-cell-other' : ''} ${isToday ? 'neo-cell-today' : ''} ${isSelected ? 'neo-cell-selected' : ''}`}
                onClick={() => onDateSelect(d.date.toISOString().split('T')[0])}
              >
                <span className="neo-cell-number font-mono">{d.day}</span>
                {info && info.total > 0 && (
                  <div className="neo-cell-indicators">
                    <span
                      className={`neo-cell-dot ${info.completed === info.total ? 'dot-done' : info.hasPriority ? 'dot-high' : 'dot-pending'}`}
                    ></span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="neo-cal-legend font-mono">
          <span className="legend-item"><span className="legend-box dot-done"></span> DONE</span>
          <span className="legend-item"><span className="legend-box dot-pending"></span> PENDING</span>
          <span className="legend-item"><span className="legend-box dot-high"></span> HIGH PRIORITY</span>
        </div>
      </div>
    </div>
  );
}

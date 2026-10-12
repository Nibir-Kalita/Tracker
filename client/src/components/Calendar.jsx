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

    // Next month days to fill the grid
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

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="calendar">
      <div className="cal-header">
        <button className="cal-nav" onClick={prevMonth} aria-label="Previous month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <div className="cal-title">
          <h3>{monthNames[month]} {year}</h3>
          <button className="cal-today-btn" onClick={goToday}>Today</button>
        </div>
        <button className="cal-nav" onClick={nextMonth} aria-label="Next month">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      </div>

      <div className="cal-weekdays">
        {dayNames.map((d) => <div key={d} className="cal-weekday">{d}</div>)}
      </div>

      <div className="cal-grid">
        {calendarDays.map((d, i) => {
          const dateStr = d.date.toDateString();
          const info = tasksByDate[dateStr];
          const isToday = dateStr === today;
          const isSelected = dateStr === selectedStr;

          return (
            <button
              key={i}
              className={`cal-day ${d.type !== 'current' ? 'cal-day-other' : ''} ${isToday ? 'cal-day-today' : ''} ${isSelected ? 'cal-day-selected' : ''}`}
              onClick={() => onDateSelect(d.date.toISOString().split('T')[0])}
            >
              <span className="cal-day-num">{d.day}</span>
              {info && (
                <div className="cal-day-dots">
                  {info.total > 0 && (
                    <span
                      className={`cal-dot ${info.completed === info.total ? 'cal-dot-done' : info.hasPriority ? 'cal-dot-high' : 'cal-dot-pending'}`}
                    ></span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

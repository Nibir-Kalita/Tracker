import { useState } from 'react';
import { createTask, updateTask, deleteTask } from '../api';
import './TaskList.css';

export default function TaskList({ tasks, selectedDate, onRefresh }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [loading, setLoading] = useState(false);

  const dayTasks = tasks.filter((t) => {
    const taskDate = new Date(t.date).toDateString();
    const selDate = new Date(selectedDate).toDateString();
    return taskDate === selDate;
  });

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    try {
      await createTask({ title: title.trim(), description: description.trim(), date: selectedDate, priority });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);
      onRefresh();
    } catch {
      // handled by interceptor
    } finally {
      setLoading(false);
    }
  };

  const toggleComplete = async (task) => {
    try {
      await updateTask(task._id, { completed: !task.completed });
      onRefresh();
    } catch {
      // handled
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      onRefresh();
    } catch {
      // handled
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const priorityIcon = (p) => {
    switch (p) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '🟡';
    }
  };

  return (
    <div className="tasklist">
      <div className="tl-header">
        <div>
          <h3>Tasks</h3>
          <span className="tl-date">{formatDate(selectedDate)}</span>
        </div>
        <button className="tl-add-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
          )}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="tl-form">
          <input
            type="text"
            placeholder="Task title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="tl-input"
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="tl-input tl-input-sm"
          />
          <div className="tl-form-row">
            <div className="tl-priority-group">
              {['low', 'medium', 'high'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`tl-priority-btn ${priority === p ? 'active' : ''} tl-priority-${p}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
            <button type="submit" className="tl-submit" disabled={loading}>
              {loading ? '...' : 'Add'}
            </button>
          </div>
        </form>
      )}

      <div className="tl-list">
        {dayTasks.length === 0 ? (
          <div className="tl-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.3">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
            </svg>
            <p>No tasks for this day</p>
            <span>Tap + to add one</span>
          </div>
        ) : (
          dayTasks.map((task) => (
            <div key={task._id} className={`tl-item ${task.completed ? 'tl-item-done' : ''}`}>
              <button
                className={`tl-check ${task.completed ? 'tl-check-done' : ''}`}
                onClick={() => toggleComplete(task)}
                aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
              >
                {task.completed && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                )}
              </button>
              <div className="tl-content">
                <div className="tl-title-row">
                  <span className="tl-title">{task.title}</span>
                  <span className="tl-priority-tag">{priorityIcon(task.priority)}</span>
                </div>
                {task.description && <p className="tl-desc">{task.description}</p>}
              </div>
              <button className="tl-delete" onClick={() => handleDelete(task._id)} aria-label="Delete task">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

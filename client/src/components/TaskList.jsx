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
      await createTask({
        title: title.trim(),
        description: description.trim(),
        date: selectedDate,
        priority
      });
      setTitle('');
      setDescription('');
      setPriority('medium');
      setShowForm(false);
      onRefresh();
    } catch {
      // handled
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
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const priorityColors = {
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low'
  };

  return (
    <div className="neo-card neo-tasklist-card">
      {/* Window Header */}
      <div className="neo-card-header neo-tasks-header">
        <div className="neo-window-dots">
          <span className="neo-dot neo-dot-red"></span>
          <span className="neo-dot neo-dot-yellow"></span>
          <span className="neo-dot neo-dot-green"></span>
        </div>
        <span className="neo-card-title font-mono">TASKS.DB</span>
        <button
          className="neo-add-task-btn"
          onClick={() => setShowForm(!showForm)}
          aria-label={showForm ? 'Close form' : 'Add task'}
        >
          {showForm ? '✕ CANCEL' : '+ ADD TASK'}
        </button>
      </div>

      <div className="neo-tasks-body">
        {/* Date Row & Counter */}
        <div className="neo-tasks-meta-row">
          <div className="neo-date-badge font-mono">
            <span>📅</span> {formatDate(selectedDate)}
          </div>
          <div className="neo-task-count-badge font-mono">
            {dayTasks.filter(t => t.completed).length} / {dayTasks.length} DONE
          </div>
        </div>

        {/* Add Task Form (Fold-out neo card) */}
        {showForm && (
          <form onSubmit={handleAdd} className="neo-task-form">
            <div className="neo-form-header font-mono">
              <span>✦ NEW ASSIGNMENT / TASK</span>
            </div>
            <input
              type="text"
              placeholder="What needs to be done?..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              autoFocus
              className="neo-form-input"
            />
            <input
              type="text"
              placeholder="Notes or description (optional)..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="neo-form-input neo-form-input-sub"
            />
            <div className="neo-form-footer">
              <div className="neo-priority-selector">
                {['low', 'medium', 'high'].map((p) => (
                  <button
                    key={p}
                    type="button"
                    className={`neo-priority-chip ${priority === p ? 'active' : ''} chip-${p} font-mono`}
                    onClick={() => setPriority(p)}
                  >
                    {p.toUpperCase()}
                  </button>
                ))}
              </div>
              <button type="submit" className="neo-form-submit-btn font-mono" disabled={loading}>
                {loading ? 'SAVING...' : 'SAVE ➔'}
              </button>
            </div>
          </form>
        )}

        {/* Task List */}
        <div className="neo-items-container">
          {dayTasks.length === 0 ? (
            <div className="neo-empty-tasks">
              <div className="neo-empty-icon font-mono">★</div>
              <p className="neo-empty-title">NO TASKS ON THIS DAY</p>
              <span className="neo-empty-sub font-mono">Click "+ ADD TASK" to plan something</span>
            </div>
          ) : (
            dayTasks.map((task) => (
              <div
                key={task._id}
                className={`neo-task-item ${task.completed ? 'neo-item-completed' : ''}`}
              >
                {/* Checkbox button */}
                <button
                  type="button"
                  className={`neo-checkbox ${task.completed ? 'checked' : ''}`}
                  onClick={() => toggleComplete(task)}
                  aria-label={task.completed ? 'Mark pending' : 'Mark completed'}
                >
                  {task.completed && <span className="neo-check-icon">✓</span>}
                </button>

                {/* Task Details */}
                <div className="neo-task-content" onClick={() => toggleComplete(task)}>
                  <div className="neo-task-top">
                    <span className="neo-task-title">{task.title}</span>
                    <span className={`neo-task-priority-badge ${priorityColors[task.priority]} font-mono`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                  {task.description && (
                    <p className="neo-task-desc">{task.description}</p>
                  )}
                </div>

                {/* Delete button */}
                <button
                  type="button"
                  className="neo-task-delete-btn"
                  onClick={() => handleDelete(task._id)}
                  aria-label="Delete task"
                  title="Delete task"
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

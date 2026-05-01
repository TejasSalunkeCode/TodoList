import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const TaskFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load existing task when editing
  useEffect(() => {
    if (!isEditing) return;
    const fetchTask = async () => {
      try {
        const res = await api.get('/tasks', { params: { page: 1, limit: 100 } });
        const task = res.data.tasks.find((t) => t.id === parseInt(id));
        if (!task) {
          setError('Task not found.');
          return;
        }
        setForm({
          title: task.title,
          description: task.description || '',
          status: task.status,
          due_date: task.due_date ? task.due_date.substring(0, 10) : '',
        });
      } catch (err) {
        setError('Failed to load task.');
      } finally {
        setFetchLoading(false);
      }
    };
    fetchTask();
  }, [id, isEditing]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim()) {
      return setError('Task title is required.');
    }

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
      due_date: form.due_date || null,
    };

    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/tasks/${id}`, payload);
        setSuccess('Task updated successfully!');
      } else {
        await api.post('/tasks', payload);
        setSuccess('Task created successfully!');
      }
      setTimeout(() => navigate('/dashboard'), 1000);
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.msg ||
        'Failed to save task.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="page-container loading-state">
        <div className="spinner" />
        <p>Loading task...</p>
      </div>
    );
  }

  return (
    <div className="page-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - var(--nav-height))' }}>
      <div className="auth-card" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="form-card-header">
          <Link to="/dashboard" className="back-link">← Workflow</Link>
          <h1 className="form-card-title" style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            {isEditing ? 'Edit Task' : 'Create Task'}
          </h1>
          <p className="form-card-subtitle" style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>
            {isEditing ? 'Refine your mission details.' : 'Define a new mission for your workflow.'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit} className="task-form" noValidate>
          <div className="form-group">
            <label htmlFor="task-title" className="form-label">Mission Title *</label>
            <input
              id="task-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              maxLength={255}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="task-description" className="form-label">Description</label>
            <textarea
              id="task-description"
              name="description"
              className="form-input form-textarea"
              placeholder="Add tactical details..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
            <div className="form-group">
              <label htmlFor="task-status" className="form-label">Status</label>
              <select
                id="task-status"
                name="status"
                className="form-input form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending" style={{ background: '#0F172A' }}>⏳ Pending</option>
                <option value="ongoing" style={{ background: '#0F172A' }}>⚡ Ongoing</option>
                <option value="completed" style={{ background: '#0F172A' }}>✓ Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="task-due-date" className="form-label">Deadline</label>
              <input
                id="task-due-date"
                name="due_date"
                type="date"
                className="form-input"
                value={form.due_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          <div className="form-actions" style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              className="btn btn-glass"
              style={{ flex: 1, padding: '1rem' }}
              onClick={() => navigate('/dashboard')}
            >
              Abort
            </button>
            <button
              id="task-submit-btn"
              type="submit"
              className="btn btn-primary"
              style={{ flex: 2, padding: '1rem' }}
              disabled={loading}
            >
              {loading ? (
                <span className="btn-spinner" />
              ) : isEditing ? (
                'Commit Changes'
              ) : (
                'Initialize Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormPage;

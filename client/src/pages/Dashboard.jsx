import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import Toast from '../components/Toast';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);

  const fetchTasks = useCallback(async (page = 1) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/tasks', {
        params: { search, status, page },
      });
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
    } catch (err) {
      setError('Failed to load tasks. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, status]);

  useEffect(() => {
    fetchTasks(1);
  }, [status]); // re-fetch when filter changes

  const handleSearch = () => fetchTasks(1);

  const handleToggle = (updatedTask) => {
    setTasks((prev) => prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
    setToast({ message: `Task moved to ${updatedTask.status}`, type: 'success' });
  };

  const handleDelete = (id) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    setToast({ message: 'Task deleted successfully', type: 'success' });
  };

  const pendingTasks = tasks.filter((t) => t.status === 'pending');
  const ongoingTasks = tasks.filter((t) => t.status === 'ongoing');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="dashboard-container" style={{ padding: '2rem 3rem' }}>
      {toast && (
        <div className="toast-container">
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        </div>
      )}
      <header className="dashboard-header">
        <div>
          <h1 className="dashboard-title" style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Workflow</h1>
          <p className="dashboard-subtitle" style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>
            Streamline your productivity. {tasks.length} total active tasks.
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/tasks/new')}
          style={{ padding: '0.8rem 2rem', fontSize: '1rem' }}
        >
          + New Task
        </button>
      </header>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="kanban-board">
        {/* Pending Column */}
        <div className="kanban-column">
          <div className="column-header">
            <h3 className="column-title">
              <span className="dot pending"></span>
              Pending
            </h3>
            <span className="column-count">{pendingTasks.length}</span>
          </div>
          <div className="task-list">
            {pendingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
            {pendingTasks.length === 0 && !loading && <p className="empty-msg" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>No pending tasks</p>}
          </div>
        </div>

        {/* Ongoing Column */}
        <div className="kanban-column">
          <div className="column-header">
            <h3 className="column-title">
              <span className="dot ongoing"></span>
              Ongoing
            </h3>
            <span className="column-count">{ongoingTasks.length}</span>
          </div>
          <div className="task-list">
            {ongoingTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
            {ongoingTasks.length === 0 && !loading && <p className="empty-msg" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>No ongoing tasks</p>}
          </div>
        </div>

        {/* Completed Column */}
        <div className="kanban-column">
          <div className="column-header">
            <h3 className="column-title">
              <span className="dot completed"></span>
              Completed
            </h3>
            <span className="column-count">{completedTasks.length}</span>
          </div>
          <div className="task-list">
            {completedTasks.map((task) => (
              <TaskCard key={task.id} task={task} onToggle={handleToggle} onDelete={handleDelete} />
            ))}
            {completedTasks.length === 0 && !loading && <p className="empty-msg" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>No completed tasks</p>}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state" style={{ marginTop: '2rem' }}>
          <div className="spinner" />
          <p>Syncing workflow...</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

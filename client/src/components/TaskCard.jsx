import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const TaskCard = ({ task, onToggle, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const isOverdue = () => {
    if (!task.due_date || task.status === 'completed') return false;
    return new Date(task.due_date) < new Date();
  };

  const handleToggle = async () => {
    let nextStatus = 'pending';
    if (task.status === 'pending') nextStatus = 'ongoing';
    else if (task.status === 'ongoing') nextStatus = 'completed';
    else nextStatus = 'pending';

    try {
      const res = await api.put(`/tasks/${task.id}`, {
        ...task,
        status: nextStatus,
      });
      onToggle(res.data.task);
    } catch (err) {
      console.error('Update failed:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${task.id}`);
      onDelete(task.id);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className={`task-card ${task.status}`}>
      <div className="task-card-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && (
          <p className="task-desc">{task.description}</p>
        )}
        
        <div className="task-footer">
          <div className="task-meta-left">
            <span className={`badge ${task.priority || 'medium'}`}>
              {task.priority || 'Medium'}
            </span>
          </div>
          
          <div className="task-actions-row">
            <button
              className="btn-icon"
              onClick={() => navigate(`/tasks/edit/${task.id}`)}
              title="Edit"
            >
              ✏️
            </button>
            <button
              className="btn-icon"
              onClick={handleDelete}
              title="Delete"
            >
              🗑️
            </button>
            <button
              className="btn-icon"
              onClick={handleToggle}
              title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
            >
              {task.status === 'completed' ? '↩️' : '✅'}
            </button>
          </div>
        </div>
      </div>

      {task.due_date && (
        <div className="task-due-date" style={{ fontSize: '0.75rem', color: isOverdue() ? 'var(--danger)' : 'var(--text-muted)', marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span>⏰</span>
          {formatDate(task.due_date)}
          {isOverdue() && ' (Overdue)'}
        </div>
      )}
    </div>
  );
};

export default TaskCard;

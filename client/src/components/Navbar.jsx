import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/dashboard" className="brand-link">
          <div className="brand-icon">⚡</div>
          <span className="brand-name">TodoFlow</span>
        </Link>
      </div>

      <div className="navbar-actions">
        {user && (
          <span className="nav-greeting">
            Welcome, {user.name.split(' ')[0]}
          </span>
        )}

        {user && (
          <>
            <Link to="/tasks/new" className="btn btn-primary" id="add-task-nav-btn">
              + New Task
            </Link>
            <button
              className="btn btn-glass"
              onClick={handleLogout}
              id="logout-btn"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

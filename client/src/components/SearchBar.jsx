import { useCallback } from 'react';

const SearchBar = ({ search, setSearch, status, setStatus, onSearch }) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') onSearch();
    },
    [onSearch]
  );

  return (
    <div className="search-bar-container">
      <div className="search-input-wrap">
        <span className="search-icon">🔍</span>
        <input
          id="search-input"
          type="text"
          className="search-input"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        {search && (
          <button
            className="search-clear"
            onClick={() => { setSearch(''); onSearch(); }}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <div className="filter-tabs">
        {['all', 'pending', 'completed'].map((s) => (
          <button
            key={s}
            id={`filter-${s}`}
            className={`filter-tab ${status === s ? 'active' : ''}`}
            onClick={() => setStatus(s)}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;

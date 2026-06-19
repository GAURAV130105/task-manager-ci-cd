function FilterBar({ filters, setFilters }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))

  return (
    <div className="filter-bar card">
      <div className="filter-bar__inner">
        {/* Search */}
        <div className="filter-search">
          <span className="filter-search__icon">🔍</span>
          <input
            id="search"
            type="text"
            className="filter-search__input"
            placeholder="Search tasks…"
            value={filters.search}
            onChange={e => update('search', e.target.value)}
          />
          {filters.search && (
            <button className="filter-search__clear" onClick={() => update('search', '')}>×</button>
          )}
        </div>

        {/* Status filter */}
        <div className="filter-group">
          <label className="filter-label">Status</label>
          <div className="filter-pills">
            {['all', 'pending', 'in-progress', 'completed'].map(s => (
              <button
                key={s}
                className={`filter-pill ${filters.status === s ? 'filter-pill--active' : ''}`}
                onClick={() => update('status', s)}
              >
                {s === 'all' ? 'All' : s === 'in-progress' ? 'In Progress' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Priority filter */}
        <div className="filter-group">
          <label className="filter-label">Priority</label>
          <div className="filter-pills">
            {['all', 'high', 'medium', 'low'].map(p => (
              <button
                key={p}
                className={`filter-pill ${filters.priority === p ? 'filter-pill--active' : ''}`}
                onClick={() => update('priority', p)}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Sort controls */}
        <div className="filter-group filter-group--sort">
          <label htmlFor="sort" className="filter-label">Sort By</label>
          <select
            id="sort"
            className="filter-sort-select"
            value={filters.sortBy || 'createdAt-desc'}
            onChange={e => update('sortBy', e.target.value)}
          >
            <option value="createdAt-desc">📅 Newest First</option>
            <option value="createdAt-asc">📅 Oldest First</option>
            <option value="dueDate-asc">⏳ Due Date (Soonest)</option>
            <option value="priority-desc">🔥 Priority (High to Low)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar

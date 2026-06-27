function Sidebar({ stats, filters, setFilters, isOpen, onClose }) {
  const completionPct = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  // SVG ring params
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (completionPct / 100) * circ

  const navItems = [
    { id: 'nav-all', icon: '🏠', label: 'All Tasks', status: 'all', count: stats.total },
    { id: 'nav-pending', icon: '⏳', label: 'To Do', status: 'pending', count: stats.pending },
    { id: 'nav-progress', icon: '🔵', label: 'In Progress', status: 'in-progress', count: stats.inProgress },
    { id: 'nav-done', icon: '✅', label: 'Completed', status: 'completed', count: stats.completed },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="logo-icon">✦</div>
        <div className="logo-text">
          <h1>TaskFlow</h1>
          <p>CI/CD Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar__nav" aria-label="Main navigation">
        <p className="nav-section-title">Navigation</p>
        {navItems.map(item => (
          <button
            key={item.id}
            id={item.id}
            className={`nav-item ${filters.status === item.status ? 'active' : ''}`}
            onClick={() => {
              setFilters(f => ({ ...f, status: item.status }))
              onClose()
            }}
            aria-current={filters.status === item.status ? 'page' : undefined}
          >
            <span className="nav-item__icon">{item.icon}</span>
            <span>{item.label}</span>
            <span className="nav-item__count">{item.count}</span>
          </button>
        ))}
      </nav>

      {/* Stats */}
      <div className="sidebar__stats">
        <p className="nav-section-title">Overview</p>

        {/* Completion ring */}
        <div className="completion-ring">
          <div className="ring-chart" aria-label={`${completionPct}% complete`}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <defs>
                <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0ea5e9" />
                  <stop offset="100%" stopColor="#38bdf8" />
                </linearGradient>
              </defs>
              <circle className="ring-chart__bg" cx="26" cy="26" r={r} />
              <circle
                className="ring-chart__fill"
                cx="26" cy="26" r={r}
                strokeDasharray={circ}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="ring-pct">{completionPct}%</div>
          </div>
          <div className="ring-info">
            <div className="ring-info__label">Completion</div>
            <div className="ring-info__sub">{stats.completed}/{stats.total} tasks done</div>
          </div>
        </div>

        {/* Stat bars */}
        {[
          { label: 'Total',       value: stats.total,      max: stats.total || 1,  fill: 'fill--purple',  pct: 100 },
          { label: 'Pending',     value: stats.pending,    max: stats.total || 1,  fill: 'fill--warning', pct: stats.total ? (stats.pending / stats.total) * 100 : 0 },
          { label: 'In Progress', value: stats.inProgress, max: stats.total || 1,  fill: 'fill--cyan',    pct: stats.total ? (stats.inProgress / stats.total) * 100 : 0 },
          { label: 'Completed',   value: stats.completed,  max: stats.total || 1,  fill: 'fill--success', pct: stats.total ? (stats.completed / stats.total) * 100 : 0 },
        ].map(s => (
          <div className="sidebar-stat" key={s.label}>
            <div className="sidebar-stat__header">
              <span className="sidebar-stat__label">{s.label}</span>
              <span className="sidebar-stat__value">{s.value}</span>
            </div>
            <div className="sidebar-stat__bar">
              <div
                className={`sidebar-stat__fill ${s.fill}`}
                style={{ width: `${s.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar

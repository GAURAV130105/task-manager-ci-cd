function StatsBar({ stats }) {
  const items = [
    { label: 'Total',       value: stats.total,      color: 'stat--total',    icon: '📋' },
    { label: 'Pending',     value: stats.pending,    color: 'stat--pending',  icon: '⏳' },
    { label: 'In Progress', value: stats.inProgress, color: 'stat--progress', icon: '🔄' },
    { label: 'Completed',   value: stats.completed,  color: 'stat--done',     icon: '✅' },
  ]

  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <div className="stats-bar">
      <div className="stats-cards">
        {items.map(item => (
          <div key={item.label} className={`stat-card ${item.color}`}>
            <span className="stat-card__icon">{item.icon}</span>
            <div className="stat-card__info">
              <span className="stat-card__value">{item.value}</span>
              <span className="stat-card__label">{item.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      {stats.total > 0 && (
        <div className="progress-row">
          <span className="progress-label">Overall Progress</span>
          <div className="progress-track">
            <div className="progress-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="progress-pct">{pct}%</span>
        </div>
      )}
    </div>
  )
}

export default StatsBar

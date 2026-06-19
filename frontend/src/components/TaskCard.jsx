const PRIORITY_CONFIG = {
  high:   { label: 'High',   className: 'badge--high',   dot: '🔴' },
  medium: { label: 'Medium', className: 'badge--medium', dot: '🟡' },
  low:    { label: 'Low',    className: 'badge--low',    dot: '🟢' },
}

const STATUS_CONFIG = {
  pending:     { label: 'Pending',     className: 'status--pending' },
  'in-progress': { label: 'In Progress', className: 'status--inprogress' },
  completed:   { label: 'Completed',   className: 'status--completed' },
}

function formatDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'completed') return false
  return new Date(dateStr) < new Date()
}

function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending
  const overdue = isOverdue(task.dueDate, task.status)
  const isCompleted = task.status === 'completed'

  return (
    <div className={`task-card ${isCompleted ? 'task-card--completed' : ''}`}>
      {/* Priority stripe */}
      <div className={`task-card__stripe task-card__stripe--${task.priority}`} />

      <div className="task-card__body">
        {/* Top row: checkbox + title */}
        <div className="task-card__top">
          <button
            className={`checkbox ${isCompleted ? 'checkbox--checked' : ''}`}
            onClick={() => onToggle(task)}
            title={isCompleted ? 'Mark as pending' : 'Mark as completed'}
            aria-label="Toggle task status"
          >
            {isCompleted && <span className="checkbox__check">✓</span>}
          </button>
          <div className="task-card__title-wrap">
            <h3 className={`task-card__title ${isCompleted ? 'task-card__title--done' : ''}`}>
              {task.title}
            </h3>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="task-card__desc">{task.description}</p>
        )}

        {/* Badges row */}
        <div className="task-card__meta">
          <span className={`badge ${priority.className}`}>
            {priority.dot} {priority.label}
          </span>
          <span className={`status-pill ${status.className}`}>
            {status.label}
          </span>
          {task.dueDate && (
            <span className={`due-date ${overdue ? 'due-date--overdue' : ''}`}>
              📅 {formatDate(task.dueDate)} {overdue && '(Overdue)'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="task-card__actions">
          <button className="action-btn action-btn--edit" onClick={() => onEdit(task)} title="Edit task">
            ✏️ Edit
          </button>
          <button className="action-btn action-btn--delete" onClick={() => onDelete(task._id)} title="Delete task">
            🗑 Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

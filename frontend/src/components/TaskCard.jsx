const PRIORITY_CONFIG = {
  high:   { label: 'High',   cls: 'badge--high',   bar: 'priority-bar--high',   dot: '🔴' },
  medium: { label: 'Medium', cls: 'badge--medium', bar: 'priority-bar--medium', dot: '🟡' },
  low:    { label: 'Low',    cls: 'badge--low',    bar: 'priority-bar--low',    dot: '🟢' },
}

const STATUS_CONFIG = {
  pending:       { label: 'Pending',     cls: 'status--pending' },
  'in-progress': { label: 'In Progress', cls: 'status--inprogress' },
  completed:     { label: 'Completed',   cls: 'status--completed' },
}

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
}

function isOverdue(dateStr, status) {
  if (!dateStr || status === 'completed') return false
  return new Date(dateStr) < new Date()
}

function TaskCard({ task, mode = 'board', onToggle, onEdit, onDelete }) {
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const statusConf = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending
  const overdue = isOverdue(task.dueDate, task.status)
  const isCompleted = task.status === 'completed'

  if (mode === 'list') {
    return (
      <div
        className={`list-card list-card--${task.priority} ${isCompleted ? 'list-card--completed' : ''}`}
        role="article"
        aria-label={task.title}
      >
        {/* Checkbox */}
        <button
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggle(task)}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        />

        {/* Info */}
        <div className="list-card__info">
          <p className="list-card__title">{task.title}</p>
          {task.description && (
            <p className="list-card__desc">{task.description}</p>
          )}
        </div>

        {/* Meta */}
        <div className="list-card__meta">
          <span className={`badge ${priority.cls}`}>{priority.dot} {priority.label}</span>
          <span className={`status-pill ${statusConf.cls}`}>{statusConf.label}</span>
          {task.dueDate && (
            <span className={`due-chip ${overdue ? 'due-chip--overdue' : ''}`}>
              📅 {formatDate(task.dueDate)}
              {overdue && ' ⚠️'}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="list-card__actions">
          <button
            id={`list-edit-${task._id}`}
            className="icon-btn icon-btn--edit"
            onClick={() => onEdit(task)}
            title="Edit task"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            id={`list-delete-${task._id}`}
            className="icon-btn icon-btn--delete"
            onClick={() => onDelete(task._id)}
            title="Delete task"
            aria-label="Delete task"
          >
            🗑
          </button>
        </div>
      </div>
    )
  }

  // Board / Kanban card
  return (
    <div
      className={`task-card ${isCompleted ? 'task-card--completed' : ''}`}
      role="article"
      aria-label={task.title}
    >
      {/* Priority top bar */}
      <div className={`task-card__priority-bar ${priority.bar}`} />

      <div className="task-card__top">
        {/* Checkbox */}
        <button
          className={`task-checkbox ${isCompleted ? 'checked' : ''}`}
          onClick={() => onToggle(task)}
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
          title={isCompleted ? 'Mark as pending' : 'Mark as complete'}
        />

        <div className="task-card__body">
          <h3 className="task-card__title">{task.title}</h3>
          {task.description && (
            <p className="task-card__desc">{task.description}</p>
          )}
        </div>
      </div>

      <div className="task-card__footer">
        <div className="task-card__badges">
          <span className={`badge ${priority.cls}`}>{priority.dot} {priority.label}</span>
          {task.dueDate && (
            <span className={`due-chip ${overdue ? 'due-chip--overdue' : ''}`}>
              📅 {formatDate(task.dueDate)}
              {overdue && ' ⚠️'}
            </span>
          )}
        </div>

        <div className="task-card__actions">
          <button
            id={`board-edit-${task._id}`}
            className="icon-btn icon-btn--edit"
            onClick={() => onEdit(task)}
            title="Edit"
            aria-label="Edit task"
          >
            ✏️
          </button>
          <button
            id={`board-delete-${task._id}`}
            className="icon-btn icon-btn--delete"
            onClick={() => onDelete(task._id)}
            title="Delete"
            aria-label="Delete task"
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskCard

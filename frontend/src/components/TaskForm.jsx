import { useState } from 'react'

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
}

function TaskForm({ onSubmit, onClose }) {
  const [form, setForm] = useState(defaultForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) return
    setSubmitting(true)
    await onSubmit({
      ...form,
      title: trimmedTitle,
      description: form.description.trim(),
      dueDate: form.dueDate || null,
    })
    setForm(defaultForm)
    setSubmitting(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Add new task"
      >
        <div className="modal__header">
          <div className="modal__title-group">
            <div className="modal__title-icon">✦</div>
            <h2 className="modal__title">New Task</h2>
          </div>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="task-form" onSubmit={handleSubmit} noValidate>
          {/* Title */}
          <div className="form-group">
            <label htmlFor="add-title" className="form-label">Task Title *</label>
            <input
              id="add-title"
              name="title"
              type="text"
              className="form-input"
              placeholder="What needs to be done?"
              value={form.title}
              onChange={handleChange}
              maxLength={100}
              required
              autoFocus
            />
          </div>

          {/* Description */}
          <div className="form-group">
            <label htmlFor="add-desc" className="form-label">Description</label>
            <textarea
              id="add-desc"
              name="description"
              className="form-input form-textarea"
              placeholder="Add details (optional)…"
              value={form.description}
              onChange={handleChange}
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Priority / Status / Due date */}
          <div className="form-row-3">
            <div className="form-group">
              <label htmlFor="add-priority" className="form-label">Priority</label>
              <select
                id="add-priority"
                name="priority"
                className="form-input form-select"
                value={form.priority}
                onChange={handleChange}
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="add-status" className="form-label">Status</label>
              <select
                id="add-status"
                name="status"
                className="form-input form-select"
                value={form.status}
                onChange={handleChange}
              >
                <option value="pending">⏳ Pending</option>
                <option value="in-progress">🔵 In Progress</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="add-duedate" className="form-label">Due Date</label>
              <input
                id="add-duedate"
                name="dueDate"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => { setForm(defaultForm); onClose() }}
            >
              Cancel
            </button>
            <button
              id="btn-submit-task"
              type="submit"
              className="btn btn--primary"
              disabled={submitting || !form.title.trim()}
            >
              {submitting ? '⏳ Adding…' : '✦ Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskForm

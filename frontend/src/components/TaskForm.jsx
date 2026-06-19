import { useState } from 'react'

const defaultForm = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending',
  dueDate: '',
}

function TaskForm({ onSubmit }) {
  const [form, setForm] = useState(defaultForm)
  const [expanded, setExpanded] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const trimmedTitle = form.title.trim()
    if (!trimmedTitle) return
    setSubmitting(true)
    await onSubmit({
      ...form,
      title: trimmedTitle,
      description: form.description.trim(),
      dueDate: form.dueDate || null
    })
    setForm(defaultForm)
    setExpanded(false)
    setSubmitting(false)
  }

  return (
    <div className="card form-card">
      <div className="form-card__header" onClick={() => setExpanded(!expanded)}>
        <div className="form-card__header-left">
          <span className="form-card__plus">{expanded ? '−' : '+'}</span>
          <span className="form-card__label">Add New Task</span>
        </div>
        <span className="form-card__hint">{expanded ? 'Click to collapse' : 'Click to expand'}</span>
      </div>

      {expanded && (
        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group form-group--full">
              <label htmlFor="title" className="form-label">Task Title * (max 100 chars)</label>
              <input
                id="title"
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
          </div>

          <div className="form-row">
            <div className="form-group form-group--full">
              <label htmlFor="description" className="form-label">Description (max 500 chars)</label>
              <textarea
                id="description"
                name="description"
                className="form-input form-textarea"
                placeholder="Add details (optional)…"
                value={form.description}
                onChange={handleChange}
                maxLength={500}
                rows={3}
              />
            </div>
          </div>

          <div className="form-row form-row--3col">
            <div className="form-group">
              <label htmlFor="priority" className="form-label">Priority</label>
              <select id="priority" name="priority" className="form-input form-select" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status" className="form-label">Status</label>
              <select id="status" name="status" className="form-input form-select" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="dueDate" className="form-label">Due Date</label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={() => { setForm(defaultForm); setExpanded(false) }}>
              Cancel
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting || !form.title.trim()}>
              {submitting ? 'Adding…' : '+ Add Task'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default TaskForm

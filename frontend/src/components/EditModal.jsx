import { useState, useEffect } from 'react'

function EditModal({ task, onSave, onClose }) {
  const [form, setForm] = useState({
    title: task.title || '',
    description: task.description || '',
    priority: task.priority || 'medium',
    status: task.status || 'pending',
    dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
  })
  const [saving, setSaving] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) return
    setSaving(true)
    await onSave(task._id, { ...form, dueDate: form.dueDate || null })
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Edit Task">
        <div className="modal__header">
          <h2 className="modal__title">✏️ Edit Task</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <form className="task-form" onSubmit={handleSubmit}>
          <div className="form-group form-group--full">
            <label htmlFor="edit-title" className="form-label">Task Title *</label>
            <input
              id="edit-title"
              name="title"
              type="text"
              className="form-input"
              value={form.title}
              onChange={handleChange}
              required
              autoFocus
            />
          </div>

          <div className="form-group form-group--full">
            <label htmlFor="edit-description" className="form-label">Description</label>
            <textarea
              id="edit-description"
              name="description"
              className="form-input form-textarea"
              value={form.description}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="form-row form-row--3col">
            <div className="form-group">
              <label htmlFor="edit-priority" className="form-label">Priority</label>
              <select id="edit-priority" name="priority" className="form-input form-select" value={form.priority} onChange={handleChange}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-status" className="form-label">Status</label>
              <select id="edit-status" name="status" className="form-input form-select" value={form.status} onChange={handleChange}>
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="edit-dueDate" className="form-label">Due Date</label>
              <input
                id="edit-dueDate"
                name="dueDate"
                type="date"
                className="form-input"
                value={form.dueDate}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn--primary" disabled={saving || !form.title.trim()}>
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditModal

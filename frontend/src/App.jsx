import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import TaskForm from './components/TaskForm'
import TaskCard from './components/TaskCard'
import FilterBar from './components/FilterBar'
import StatsBar from './components/StatsBar'
import EditModal from './components/EditModal'
import './App.css'

const API_BASE = '/api/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '', sortBy: 'createdAt-desc' })
  const [editingTask, setEditingTask] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const params = {}
      if (filters.status !== 'all') params.status = filters.status
      if (filters.priority !== 'all') params.priority = filters.priority
      if (filters.search) params.search = filters.search
      const res = await axios.get(API_BASE, { params })
      setTasks(res.data.data)
    } catch (err) {
      setError('Could not connect to backend. Make sure the server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.priority, filters.search])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  const handleCreate = async (taskData) => {
    try {
      await axios.post(API_BASE, taskData)
      showToast('Task created successfully!')
      fetchTasks()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error')
    }
  }

  const handleUpdate = async (id, taskData) => {
    try {
      await axios.put(`${API_BASE}/${id}`, taskData)
      setEditingTask(null)
      showToast('Task updated successfully!')
      fetchTasks()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error')
    }
  }

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      await axios.put(`${API_BASE}/${task._id}`, { ...task, status: nextStatus })
      showToast(nextStatus === 'completed' ? '✅ Marked as completed!' : '🔄 Marked as pending')
      fetchTasks()
    } catch (err) {
      showToast('Failed to update status', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    try {
      await axios.delete(`${API_BASE}/${id}`)
      showToast('Task deleted.')
      fetchTasks()
    } catch (err) {
      showToast('Failed to delete task', 'error')
    }
  }

  const getSortedTasks = () => {
    const sorted = [...tasks]
    const sortVal = filters.sortBy || 'createdAt-desc'

    sorted.sort((a, b) => {
      if (sortVal === 'createdAt-desc') {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }
      if (sortVal === 'createdAt-asc') {
        return new Date(a.createdAt) - new Date(b.createdAt)
      }
      if (sortVal === 'dueDate-asc') {
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      }
      if (sortVal === 'priority-desc') {
        const pMap = { high: 3, medium: 2, low: 1 }
        return (pMap[b.priority] || 2) - (pMap[a.priority] || 2)
      }
      return 0
    })
    return sorted
  }

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  }

  const sortedTasksList = getSortedTasks()

  return (
    <div className="app">
      {/* Toast Notification */}
      {toast && (
        <div className={`toast toast--${toast.type}`}>
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <header className="header">
        <div className="header__inner">
          <div className="header__logo">
            <div className="header__icon">✓</div>
            <div>
              <h1 className="header__title">TaskFlow</h1>
              <p className="header__subtitle">Stay organised, stay productivity</p>
            </div>
          </div>
        </div>
      </header>

      <main className="main">
        <div className="container">
          {/* Stats */}
          <StatsBar stats={stats} />

          {/* Add Task Form */}
          <TaskForm onSubmit={handleCreate} />

          {/* Filters */}
          <FilterBar filters={filters} setFilters={setFilters} />

          {/* Task List */}
          <div className="task-section">
            {loading ? (
              <div className="state-box">
                <div className="spinner" />
                <p>Loading tasks…</p>
              </div>
            ) : error ? (
              <div className="state-box state-box--error">
                <span className="state-box__icon">⚠️</span>
                <p>{error}</p>
                <button className="btn btn--primary" onClick={fetchTasks}>Retry</button>
              </div>
            ) : sortedTasksList.length === 0 ? (
              <div className="state-box">
                <span className="state-box__icon">📋</span>
                <p className="state-box__title">No tasks found</p>
                <p className="state-box__sub">Add your first task above to get started</p>
              </div>
            ) : (
              <div className="task-grid">
                {sortedTasksList.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onToggle={handleToggleStatus}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}

export default App

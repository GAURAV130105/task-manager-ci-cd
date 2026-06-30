import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import EditModal from './components/EditModal'
import Sidebar from './components/Sidebar'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import { useAuth } from './context/AuthContext'
import './App.css'

const API_BASE = '/api/tasks'

function App() {
  const { user, loading: authLoading, logout } = useAuth()
  const [authPage, setAuthPage] = useState('login') // 'login' | 'signup'
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({ status: 'all', priority: 'all', search: '', sortBy: 'createdAt-desc' })
  const [editingTask, setEditingTask] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState(null)
  const [view, setView] = useState('board') // 'board' | 'list'
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Show loading spinner while restoring session from localStorage
  if (authLoading) {
    return (
      <div className="auth-page">
        <div className="auth-glow auth-glow--1" />
        <div className="auth-glow auth-glow--2" />
        <div className="auth-card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="auth-spinner" style={{ width: 40, height: 40, margin: '0 auto' }} />
          <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Restoring session…</p>
        </div>
      </div>
    )
  }

  // If not logged in, show Login or Signup page
  if (!user) {
    if (authPage === 'signup') {
      return <SignupPage onSwitchToLogin={() => setAuthPage('login')} />
    }
    return <LoginPage onSwitchToSignup={() => setAuthPage('signup')} />
  }

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3200)
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
    } catch {
      setError('Cannot reach backend. Make sure the server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }, [filters.status, filters.priority, filters.search])

  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleCreate = async (taskData) => {
    try {
      await axios.post(API_BASE, taskData)
      showToast('✅ Task created successfully!')
      setShowForm(false)
      fetchTasks()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to create task', 'error')
    }
  }

  const handleUpdate = async (id, taskData) => {
    try {
      await axios.put(`${API_BASE}/${id}`, taskData)
      setEditingTask(null)
      showToast('✏️ Task updated!')
      fetchTasks()
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update task', 'error')
    }
  }

  const handleToggleStatus = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed'
    try {
      await axios.put(`${API_BASE}/${task._id}`, { ...task, status: nextStatus })
      showToast(nextStatus === 'completed' ? '🎉 Task completed!' : '🔄 Marked as pending')
      fetchTasks()
    } catch {
      showToast('Failed to update status', 'error')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await axios.delete(`${API_BASE}/${id}`)
      showToast('🗑️ Task deleted.')
      fetchTasks()
    } catch {
      showToast('Failed to delete task', 'error')
    }
  }

  // Sorting
  const getSortedTasks = (taskList) => {
    const sorted = [...taskList]
    const sortVal = filters.sortBy
    sorted.sort((a, b) => {
      if (sortVal === 'createdAt-desc') return new Date(b.createdAt) - new Date(a.createdAt)
      if (sortVal === 'createdAt-asc')  return new Date(a.createdAt) - new Date(b.createdAt)
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

  const sortedTasks = getSortedTasks(tasks)

  // Stats
  const stats = {
    total:      tasks.length,
    pending:    tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    completed:  tasks.filter(t => t.status === 'completed').length,
  }

  // Kanban columns
  const todoTasks     = sortedTasks.filter(t => t.status === 'pending')
  const progressTasks = sortedTasks.filter(t => t.status === 'in-progress')
  const doneTasks     = sortedTasks.filter(t => t.status === 'completed')

  const columns = [
    { key: 'todo',     label: 'To Do',       tasks: todoTasks,     dot: 'todo',     count: todoTasks.length },
    { key: 'progress', label: 'In Progress',  tasks: progressTasks, dot: 'progress', count: progressTasks.length },
    { key: 'done',     label: 'Done',         tasks: doneTasks,     dot: 'done',     count: doneTasks.length },
  ]

  return (
    <div className="app">
      {/* Sidebar overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'show' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <Sidebar
        stats={stats}
        filters={filters}
        setFilters={setFilters}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content */}
      <div className="main-content">
        {/* Top bar */}
        <header className="topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            ☰
          </button>

          <span className="topbar__title">Task Board</span>

          {/* Search */}
          <div className="topbar__search">
            <span className="topbar__search-icon">🔍</span>
            <input
              id="search-input"
              className="topbar__search-input"
              type="text"
              placeholder="Search tasks…"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              aria-label="Search tasks"
            />
            {filters.search && (
              <button
                className="topbar__search-clear"
                onClick={() => setFilters(f => ({ ...f, search: '' }))}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* View toggle */}
          <div className="view-toggle" role="group" aria-label="View mode">
            <button
              id="view-board"
              className={`view-btn ${view === 'board' ? 'active' : ''}`}
              onClick={() => setView('board')}
              title="Board view"
              aria-pressed={view === 'board'}
            >
              ▦
            </button>
            <button
              id="view-list"
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="List view"
              aria-pressed={view === 'list'}
            >
              ☰
            </button>
          </div>

          {/* Add task */}
          <button id="btn-add-task" className="btn-add" onClick={() => setShowForm(true)}>
            <span>＋</span> New Task
          </button>

          {/* User avatar + logout */}
          <div className="topbar__user">
            <div className="topbar__avatar" title={user?.name}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="topbar__username">{user?.name}</span>
            <button className="topbar__logout" onClick={logout} title="Logout">
              ⎋ Logout
            </button>
          </div>
        </header>

        {/* Filter strip */}
        <div className="filter-strip">
          <span className="filter-strip__label">Status</span>
          <div className="filter-strip__pills">
            {[
              { val: 'all',         label: 'All',         cls: 'active' },
              { val: 'pending',     label: '⏳ Pending',   cls: 'active-warn' },
              { val: 'in-progress', label: '🔵 Progress',  cls: 'active-cyan' },
              { val: 'completed',   label: '✅ Completed', cls: 'active-success' },
            ].map(({ val, label, cls }) => (
              <button
                key={val}
                id={`filter-status-${val}`}
                className={`pill ${filters.status === val ? cls : ''}`}
                onClick={() => setFilters(f => ({ ...f, status: val }))}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="filter-divider" />
          <span className="filter-strip__label">Priority</span>
          <div className="filter-strip__pills">
            {[
              { val: 'all',    label: 'All',          cls: 'active' },
              { val: 'high',   label: '🔴 High',      cls: 'active-danger' },
              { val: 'medium', label: '🟡 Medium',    cls: 'active-warn' },
              { val: 'low',    label: '🟢 Low',       cls: 'active-success' },
            ].map(({ val, label, cls }) => (
              <button
                key={val}
                id={`filter-priority-${val}`}
                className={`pill ${filters.priority === val ? cls : ''}`}
                onClick={() => setFilters(f => ({ ...f, priority: val }))}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <select
            id="sort-select"
            className="sort-select"
            value={filters.sortBy}
            onChange={e => setFilters(f => ({ ...f, sortBy: e.target.value }))}
            aria-label="Sort tasks"
          >
            <option value="createdAt-desc">Newest first</option>
            <option value="createdAt-asc">Oldest first</option>
            <option value="dueDate-asc">Due date ↑</option>
            <option value="priority-desc">Priority ↓</option>
          </select>
        </div>

        {/* Board / List area */}
        <main className="board-area">
          {loading ? (
            <div className="state-box">
              <div className="spinner" />
              <p className="state-box__title">Loading tasks…</p>
            </div>
          ) : error ? (
            <div className="state-box state-box--error">
              <span className="state-box__icon">⚠️</span>
              <p className="state-box__title">Connection Error</p>
              <p className="state-box__sub">{error}</p>
              <button className="btn btn--primary" onClick={fetchTasks}>↺ Retry</button>
            </div>
          ) : view === 'board' ? (
            /* ── Kanban Board ── */
            <div className="kanban-board">
              {columns.map(col => (
                <div className="kanban-col" key={col.key}>
                  <div className="kanban-col__header">
                    <div className="col-title-group">
                      <span className={`col-dot col-dot--${col.dot}`} />
                      <span className="col-title">{col.label}</span>
                    </div>
                    <span className="col-count">{col.count}</span>
                  </div>
                  <div className="kanban-col__cards">
                    {col.tasks.length === 0 ? (
                      <div className="col-empty">
                        <div className="col-empty__icon">📭</div>
                        <p>No tasks</p>
                      </div>
                    ) : (
                      col.tasks.map(task => (
                        <TaskCard
                          key={task._id}
                          task={task}
                          mode="board"
                          onToggle={handleToggleStatus}
                          onEdit={setEditingTask}
                          onDelete={handleDelete}
                        />
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ── List View ── */
            <div className="list-view">
              {sortedTasks.length === 0 ? (
                <div className="state-box">
                  <span className="state-box__icon">📋</span>
                  <p className="state-box__title">No tasks found</p>
                  <p className="state-box__sub">Add your first task using the button above</p>
                </div>
              ) : (
                sortedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    mode="list"
                    onToggle={handleToggleStatus}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                  />
                ))
              )}
            </div>
          )}
        </main>
      </div>

      {/* Add Task Modal */}
      {showForm && (
        <TaskForm onSubmit={handleCreate} onClose={() => setShowForm(false)} />
      )}

      {/* Edit Modal */}
      {editingTask && (
        <EditModal
          task={editingTask}
          onSave={handleUpdate}
          onClose={() => setEditingTask(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="alert">
          <span className="toast__icon">{toast.type === 'success' ? '✅' : '❌'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default App

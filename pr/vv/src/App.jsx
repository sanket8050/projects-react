import React, { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { useTheme } from './hooks/useTheme'

import Card from './components/Card'
import Button from './components/Button'
import Modal from './components/Modal'
import SearchBar from './components/SearchBar'
import FilterButtons from './components/FilterButtons'
import StatsSection from './components/StatsSection'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import Header from './components/Header'

export default function App() {
  const { theme, toggleTheme } = useTheme()
  const [tasks, setTasks] = useLocalStorage('tasks', [])
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all') // 'all' | 'completed' | 'pending'
  const [isOpen, setIsOpen] = useState(false)
  const [editing, setEditing] = useState(null)

  function createTask(data) {
    const newTask = {
      id: crypto.randomUUID(),
      title: data.title,
      description: data.description,
      priority: data.priority,
      dueDate: data.dueDate || '',
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setTasks(prev => [newTask, ...prev])
  }

  function updateTask(updated) {
    setTasks(prev => prev.map(t => (t.id === updated.id ? { ...t, ...updated } : t)))
  }

  function deleteTask(id) {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  function toggleTask(id) {
    setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
  }

  const filteredTasks = useMemo(() => {
    return tasks
      .filter(t => {
        if (filter === 'completed') return t.completed
        if (filter === 'pending') return !t.completed
        return true
      })
      .filter(t => {
        if (!query.trim()) return true
        const q = query.toLowerCase()
        return (
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
        )
      })
  }, [tasks, filter, query])

  const stats = useMemo(() => {
    const total = tasks.length
    const completed = tasks.filter(t => t.completed).length
    const pending = total - completed
    return { total, completed, pending }
  }, [tasks])

  function handleSubmitTask(data) {
    if (editing) updateTask({ ...editing, ...data })
    else createTask(data)
    setIsOpen(false)
    setEditing(null)
  }

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onAdd={() => {
          setEditing(null)
          setIsOpen(true)
        }}
      />

      <Card className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 justify-between">
        <SearchBar value={query} onChange={setQuery} />
        <FilterButtons value={filter} onChange={setFilter} />
      </Card>

      <StatsSection total={stats.total} completed={stats.completed} pending={stats.pending} />

      <TaskList
        tasks={filteredTasks}
        onToggle={toggleTask}
        onEdit={task => {
          setEditing(task)
          setIsOpen(true)
        }}
        onDelete={deleteTask}
      />

      <Modal isOpen={isOpen} onClose={() => { setIsOpen(false); setEditing(null) }}>
        <TaskForm
          initialTask={editing}
          onSubmit={handleSubmitTask}
          onCancel={() => { setIsOpen(false); setEditing(null) }}
        />
      </Modal>
    </div>
  )
}



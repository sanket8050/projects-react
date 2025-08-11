import { useEffect, useState } from 'react'
import Button from './Button'
import Input from './Input'

export default function TaskForm({ initialTask, onSubmit, onCancel }) {
  const [data, setData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (initialTask) {
      setData({
        title: initialTask.title || '',
        description: initialTask.description || '',
        priority: initialTask.priority || 'medium',
        dueDate: initialTask.dueDate ? initialTask.dueDate.split('T')[0] : '',
      })
    }
  }, [initialTask])

  function validate() {
    const next = {}
    if (!data.title.trim()) next.title = 'Title is required'
    if (data.title.length > 100) next.title = 'Title must be under 100 characters'
    if (data.description.length > 500) next.description = 'Description must be under 500 characters'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!validate()) return
    onSubmit({
      ...initialTask,
      title: data.title.trim(),
      description: data.description.trim(),
      priority: data.priority,
      dueDate: data.dueDate ? new Date(data.dueDate).toISOString() : '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      <h3 className="text-lg font-semibold">{initialTask ? 'Edit Task' : 'Add Task'}</h3>
      <div>
        <label className="block mb-1 text-sm">Title</label>
        <Input
          value={data.title}
          onChange={e => setData(d => ({ ...d, title: e.target.value }))}
          placeholder="Task title"
          aria-invalid={!!errors.title}
        />
        {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
      </div>
      <div>
        <label className="block mb-1 text-sm">Description</label>
        <textarea
          className="input-field min-h-[90px]"
          value={data.description}
          onChange={e => setData(d => ({ ...d, description: e.target.value }))}
          placeholder="Details (optional)"
        />
        {errors.description && <p className="text-sm text-red-600 mt-1">{errors.description}</p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm">Priority</label>
          <select
            className="input-field"
            value={data.priority}
            onChange={e => setData(d => ({ ...d, priority: e.target.value }))}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Due date</label>
          <Input type="date" value={data.dueDate} onChange={e => setData(d => ({ ...d, dueDate: e.target.value }))} />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit">{initialTask ? 'Save Changes' : 'Add Task'}</Button>
      </div>
    </form>
  )
}



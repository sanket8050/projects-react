import { Calendar, CheckCircle, Circle, Edit, Trash2 } from 'lucide-react'
import Card from './Card'
import Button from './Button'

export default function TaskList({ tasks, onToggle, onEdit, onDelete }) {
  if (!tasks.length) {
    return (
      <Card className="p-6 text-center text-gray-500">
        No tasks found. Add your first task!
      </Card>
    )
  }

  return (
    <div className="space-y-3">
      {tasks.map(task => (
        <Card key={task.id} className="p-4">
          <div className="flex items-start gap-3">
            <button
              onClick={() => onToggle(task.id)}
              className="mt-1"
              aria-label={task.completed ? 'Mark as pending' : 'Mark as completed'}
              title={task.completed ? 'Mark as pending' : 'Mark as completed'}
            >
              {task.completed ? <CheckCircle className="text-green-600" /> : <Circle className="text-gray-400" />}
            </button>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>{task.title}</h4>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" onClick={() => onEdit(task)} title="Edit">
                    <Edit size={16} />
                  </Button>
                  <Button variant="secondary" onClick={() => onDelete(task.id)} title="Delete">
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
              {task.description && <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>}
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                <span className="capitalize">Priority: {task.priority}</span>
                {task.dueDate && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} /> {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}



import { Moon, Sun, Plus } from 'lucide-react'
import Button from './Button'

export default function Header({ onAdd, theme, onToggleTheme }) {
  return (
    <header className="flex items-center justify-between gap-2">
      <h1 className="text-2xl font-semibold tracking-tight">Task & Productivity Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button variant="secondary" onClick={onToggleTheme} title="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button onClick={onAdd} className="flex items-center gap-2">
          <Plus size={18} /> Add Task
        </Button>
      </div>
    </header>
  )
}



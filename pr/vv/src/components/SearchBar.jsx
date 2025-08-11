import { Search } from 'lucide-react'
import Input from './Input'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Search tasks..."
        className="pl-9"
      />
    </div>
  )
}



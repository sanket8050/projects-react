import { CheckCircle, Clock, ListChecks } from 'lucide-react'
import Card from './Card'

export default function StatsSection({ total, completed, pending }) {
  const items = [
    { label: 'Total', value: total, icon: ListChecks, color: 'text-blue-600' },
    { label: 'Completed', value: completed, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Pending', value: pending, icon: Clock, color: 'text-amber-600' },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(({ label, value, icon: Icon, color }) => (
        <Card key={label} className="p-4">
          <div className="flex items-center gap-3">
            <Icon className={color} />
            <div>
              <div className="text-2xl font-semibold">{value}</div>
              <div className="text-sm text-gray-500">{label}</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}



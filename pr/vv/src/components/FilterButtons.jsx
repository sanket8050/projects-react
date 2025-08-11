import Button from './Button'

export default function FilterButtons({ value, onChange }) {
  const filters = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
  ]
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(f => (
        <Button
          key={f.key}
          variant={value === f.key ? 'primary' : 'secondary'}
          onClick={() => onChange(f.key)}
          className={value === f.key ? '' : ''}
        >
          {f.label}
        </Button>
      ))}
    </div>
  )
}



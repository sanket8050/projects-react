import { Switch } from './ui/switch'

export default function StatusToggle({ checked, onChange }) {
  return (
    <Switch
      checked={checked}
      onCheckedChange={onChange}
      className="data-[state=checked]:bg-green-600"
    />
  )
}
import { useState } from 'react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import ShopCard from './ShopCard.jsx'

export default function ShopList({ shops, user, addFavorite, removeFavorite }) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')

  return (
    <div className="space-y-4">
      <div className="flex gap-4 flex-col sm:flex-row">
        <Input
          placeholder="Search by name or menu item"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="hotel">Hotel</SelectItem>
            <SelectItem value="mess">Mess</SelectItem>
            <SelectItem value="stall">Stall</SelectItem>
            <SelectItem value="restaurant">Restaurant</SelectItem>
            <SelectItem value="shop">Shop</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-4">
        {shops.map(shop => (
          <ShopCard
            key={shop.id}
            shop={shop}
            user={user}
            addFavorite={addFavorite}
            removeFavorite={removeFavorite}
          />
        ))}
      </div>
    </div>
  )
}
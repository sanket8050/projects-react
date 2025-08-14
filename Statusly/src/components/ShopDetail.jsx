import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/ui'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shadcn/ui'
// import { button } from './common/button.jsx'
import { getShop } from '../services/firebase.jsx'
import { formatTimestamp } from '../utils/helpers.jsx'

export default function ShopDetail({ user, addFavorite, removeFavorite }) {
  const { id } = useParams()
  const [shop, setShop] = useState(null)
  const isFavorite = user?.favorites?.includes(id)

  useEffect(() => {
    const unsubscribe = getShop(id, setShop)
    return unsubscribe
  }, [id])

  const handleFavorite = () => {
    if (!user) return alert('Please log in to favorite shops')
    if (isFavorite) removeFavorite(user.id, id)
    else addFavorite(user.id, id)
  }

  if (!shop) return <div>Loading...</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>{shop.name}</CardTitle>
            <span className={`text-xs px-2 py-1 rounded ${shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {shop.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">Address: {shop.location.address}</p>
          {shop.contact.phone && <p className="text-sm text-gray-600">Phone: {shop.contact.phone}</p>}
          {shop.contact.whatsapp && <p className="text-sm text-gray-600">WhatsApp: {shop.contact.whatsapp}</p>}
          <p className="text-sm text-gray-500">Last updated: {formatTimestamp(shop.lastUpdated)}</p>
          {shop.announcement && (
            <div className="mt-4">
              <h3 className="font-semibold">Announcement</h3>
              <p className="text-sm text-gray-600">{shop.announcement}</p>
            </div>
          )}
          <h3 className="font-semibold mt-4">Today's Menu</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shop.todayMenu.map(item => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.price ? `$${item.price}` : 'N/A'}</TableCell>
                  <TableCell>{item.available ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{item.notes || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <button
            variant={isFavorite ? 'destructive' : 'default'}
            className="mt-4"
            onClick={handleFavorite}
          >
            {isFavorite ? 'Unfollow' : 'Follow'}
          </button>
        </CardContent>
      </Card>
    </div>
  )
}
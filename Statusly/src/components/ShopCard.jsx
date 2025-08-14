import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/ui'
// import { button } from './common/button.jsx'
import { formatTimestamp } from '../utils/helpers.jsx'

export default function ShopCard({ shop, user, addFavorite, removeFavorite }) {
  const isFavorite = user?.favorites?.includes(shop.id)

  const handleFavorite = () => {
    if (!user) return alert('Please log in to favorite shops')
    if (isFavorite) removeFavorite(user.id, shop.id)
    else addFavorite(user.id, shop.id)
  }

  return (
    <Link to={`/shop/${shop.id}`}>
      <Card className="p-4 hover:shadow-md flex items-start gap-4">
        <div className="w-16 h-16 rounded-md bg-gray-100 flex-shrink-0"></div>
        <CardContent className="flex-1 p-0">
          <CardHeader className="p-0">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">{shop.name}</CardTitle>
              <span className={`text-xs px-2 py-1 rounded ${shop.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {shop.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </CardHeader>
          <p className="text-sm text-gray-600">{shop.todayMenu?.slice(0, 2).map(i => i.name).join(' • ')}</p>
          <p className="text-xs text-gray-500">Last updated: {formatTimestamp(shop.lastUpdated)}</p>
          <button
            variant={isFavorite ? 'destructive' : 'default'}
            size="sm"
            className="mt-2"
            onClick={(e) => { e.preventDefault(); handleFavorite() }}
          >
            {isFavorite ? 'Unfollow' : 'Follow'}
          </button>
        </CardContent>
      </Card>
    </Link>
  )
}
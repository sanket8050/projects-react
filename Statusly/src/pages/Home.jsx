import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import ShopList from '../components/ShopList.jsx'
import { useNearbyShops } from '../hooks/useNearbyShops.jsx'
import { addFavorite, removeFavorite } from '../services/firebase.jsx'
// import Loading from './components/common/loading.jsx'

export default function Home() {
  const { user } = useContext(AuthContext)
  const { shops, isLoading, error } = useNearbyShops()

  if (isLoading) return <div>Loading.....</div>   ////////////////////////////////////
  if (error) return <div>Error: {error}</div>
console.log(import.meta.env.VITE_FIREBASE_API_KEY)
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Nearby Shops</h1>
      <ShopList
        shops={shops}
        user={user}
        addFavorite={addFavorite}
        removeFavorite={removeFavorite}
      />
    </div>
  )
}
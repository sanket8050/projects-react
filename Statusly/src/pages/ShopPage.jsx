import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext.jsx'
import ShopDetail from '../components/ShopDetail.jsx'
import { addFavorite, removeFavorite } from '../services/firebase.jsx'

export default function ShopPage() {
  const { user } = useContext(AuthContext)

  return (
    <ShopDetail
      user={user}
      addFavorite={addFavorite}
      removeFavorite={removeFavorite}
    />
  )
}
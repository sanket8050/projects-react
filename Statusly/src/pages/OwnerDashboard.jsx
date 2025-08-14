import { useState, useEffect, useContext } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@shadcn/ui'
import { Input } from '@shadcn/ui'
import { Textarea } from '@shadcn/ui'
// import { button } from '../components/common/button.jsx'
import StatusToggle from '../components/StatusToggle.jsx'
import { AuthContext } from '../context/AuthContext.jsx'
import { getShop, updateShop, createShop } from '../services/firebase.jsx'
import { formatTimestamp } from '../utils/helpers.jsx'
// import {Loading} from './src/components/Loading.jsx'

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [shop, setShop] = useState(null)
  const { register, control, handleSubmit, reset } = useForm({
    defaultValues: {
      isOpen: false,
      announcement: '',
      todayMenu: [{ id: Date.now().toString(), name: '', price: '', available: true, notes: '' }],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'todayMenu',
  })

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    // For MVP, assume owner has one shop; fetch by ownerId
    const mockShopId = user.uid // Replace with actual shop lookup
    const unsubscribe = getShop(mockShopId, (shopData) => {
      if (shopData) {
        setShop(shopData)
        reset({
          isOpen: shopData.isOpen,
          announcement: shopData.announcement || '',
          todayMenu: shopData.todayMenu || [{ id: Date.now().toString(), name: '', price: '', available: true, notes: '' }],
        })
      } else {
        // Onboarding: create new shop
        const newShop = {
          ownerId: user.uid,
          name: `${user.name}'s Shop`,
          type: 'shop',
          location: { lat: 0, lng: 0, address: 'Set your address' },
          contact: { phone: '', whatsapp: '' },
          isOpen: false,
          todayMenu: [],
          followersCount: 0,
          lastUpdated: new Date(),
        }
        createShop(newShop).then(id => setShop({ id, ...newShop }))
      }
    })
    return unsubscribe
  }, [user, navigate, reset])

  const onSubmit = async (data) => {
    if (!shop) return
    await updateShop(shop.id, {
      isOpen: data.isOpen,
      announcement: data.announcement,
      todayMenu: data.todayMenu.map(item => ({
        ...item,
        price: item.price ? parseFloat(item.price) : undefined,
      })),
    })
    alert('Shop updated successfully!')
  }

  if (!shop) return <div>Loading.....</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Manage Your Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <StatusToggle {...register('isOpen')} />
                <span>Open</span>
              </label>
              <div className="text-sm text-gray-500">Last updated: {formatTimestamp(shop.lastUpdated)}</div>
            </div>
            <div>
              <label className="block text-sm font-medium">Today's Menu</label>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-center mt-2">
                  <Input
                    {...register(`todayMenu.${index}.name`)}
                    placeholder="Item name"
                    className="w-full sm:w-1/3"
                  />
                  <Input
                    {...register(`todayMenu.${index}.price`)}
                    placeholder="Price"
                    type="number"
                    className="w-full sm:w-1/6"
                  />
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      {...register(`todayMenu.${index}.available`)}
                    />
                    <span>Available</span>
                  </label>
                  <Input
                    {...register(`todayMenu.${index}.notes`)}
                    placeholder="Notes"
                    className="w-full sm:w-1/3"
                  />
                  <button
                    variant="destructive"
                    size="sm"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                variant="outline"
                className="mt-2"
                onClick={() => append({ id: Date.now().toString(), name: '', price: '', available: true, notes: '' })}
              >
                Add Item
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium">Announcement</label>
              <Textarea
                {...register('announcement')}
                placeholder="Special announcement (e.g., holiday closure)"
                className="mt-1"
              />
            </div>
            <button type="submit">Save</button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
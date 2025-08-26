// AI: Shop page component that displays individual shop details with routing
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { shopsAPI } from '../services/api';
import ShopDetail from '../components/ShopDetail';
import Button from '../components/common/Button';

const ShopPage = () => {
  const { id } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // For demo purposes, we'll create a mock shop
        // In real app, you'd fetch from API: const response = await shopsAPI.getShopById(id);
        const mockShop = {
          _id: id,
          name: 'Delicious Restaurant',
          type: 'restaurant',
          ownerId: 'owner123',
          location: {
            lat: 12.9716,
            lng: 77.5946,
            address: '123 Main Street, Bangalore, Karnataka 560001'
          },
          contact: {
            phone: '+91 98765 43210',
            whatsapp: '+91 98765 43210'
          },
          isOpen: true,
          openTime: '09:00',
          closeTime: '22:00',
          todayMenu: [
            {
              id: '1',
              name: 'Chicken Biryani',
              price: 250,
              available: true,
              notes: 'Spicy and aromatic biryani with tender chicken'
            },
            {
              id: '2',
              name: 'Veg Thali',
              price: 150,
              available: true,
              notes: 'Complete meal with rice, dal, vegetables, and roti'
            },
            {
              id: '3',
              name: 'Butter Chicken',
              price: 300,
              available: false,
              notes: 'Creamy and rich butter chicken curry'
            },
            {
              id: '4',
              name: 'Paneer Tikka',
              price: 200,
              available: true,
              notes: 'Grilled cottage cheese with spices'
            }
          ],
          announcement: 'Special discount of 20% on all items today! Limited time offer.',
          followersCount: 1250,
          lastUpdated: new Date().toISOString()
        };
        
        setShop(mockShop);
      } catch (err) {
        setError('Failed to load shop details');
        console.error('Error fetching shop:', err);
      } finally {
        setLoading(false);
      }
    };

    // Get user location for distance calculation
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.log('Location not available:', error.message);
          }
        );
      }
    };

    fetchShop();
    getLocation();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Shop Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || 'The shop you are looking for does not exist.'}
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link to="/" className="text-green-600 hover:text-green-500">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{shop.name}</h1>
                <p className="text-sm text-gray-600">Shop Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {userLocation && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Your Location:</span> 
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShopDetail shop={shop} userLocation={userLocation} />
        
        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => window.history.back()}
            variant="outline"
            className="flex-1"
          >
            ← Back to Shops
          </Button>
          
          {shop.contact?.phone && (
            <Button
              onClick={() => window.open(`tel:${shop.contact.phone}`)}
              variant="primary"
              className="flex-1"
            >
              📞 Call Shop
            </Button>
          )}
          
          {shop.contact?.whatsapp && (
            <Button
              onClick={() => window.open(`https://wa.me/${shop.contact.whatsapp.replace(/\D/g, '')}`)}
              variant="primary"
              className="flex-1"
            >
              💬 WhatsApp
            </Button>
          )}
        </div>
      </main>
    </div>
  );
};

export default ShopPage;

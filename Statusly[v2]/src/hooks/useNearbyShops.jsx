// AI: Custom hook for fetching nearby shops with Socket.IO real-time updates
import { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import { shopsAPI } from '../services/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const useNearbyShops = (userLocation, radius = 10) => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [socket, setSocket] = useState(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Listen for real-time shop updates
  useEffect(() => {
    if (!socket) return;

    socket.on('shopUpdated', (updatedShop) => {
      setShops(prevShops => 
        prevShops.map(shop => 
          shop._id === updatedShop._id ? { ...shop, ...updatedShop } : shop
        )
      );
    });

    socket.on('shopCreated', (newShop) => {
      setShops(prevShops => [...prevShops, newShop]);
    });

    return () => {
      socket.off('shopUpdated');
      socket.off('shopCreated');
    };
  }, [socket]);

  // Fetch nearby shops
  const fetchShops = useCallback(async () => {
    if (!userLocation) return;

    setLoading(true);
    setError(null);

    try {
      const params = {
        lat: userLocation.lat,
        lng: userLocation.lng,
        radius: radius
      };

      const response = await shopsAPI.getNearbyShops(params);
      setShops(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch shops');
      console.error('Error fetching shops:', err);
    } finally {
      setLoading(false);
    }
  }, [userLocation, radius]);

  // Fetch shops when location changes
  useEffect(() => {
    fetchShops();
  }, [fetchShops]);

  // Get user's current location
  const getCurrentLocation = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error('Unable to get location: ' + error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  }, []);

  // Refresh shops data
  const refreshShops = useCallback(() => {
    fetchShops();
  }, [fetchShops]);

  return {
    shops,
    loading,
    error,
    fetchShops,
    getCurrentLocation,
    refreshShops
  };
};

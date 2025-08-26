// AI: Enhanced owner dashboard with better UX, shop management, and interactive features
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import StatusToggle from '../components/StatusToggle';
import Modal from '../components/common/Modal';
import Button from '../components/common/Button';

const OwnerDashboard = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [shopData, setShopData] = useState({
    isOpen: true,
    announcement: '',
    menu: [
      { id: '1', name: 'Chicken Biryani', price: 250, available: true, notes: 'Spicy and aromatic' },
      { id: '2', name: 'Veg Thali', price: 120, available: true, notes: 'Complete meal with rice, dal, and vegetables' },
      { id: '3', name: 'Butter Chicken', price: 180, available: false, notes: 'Creamy and rich' }
    ],
    openTime: '09:00',
    closeTime: '22:00',
    followersCount: 156,
    lastUpdated: new Date()
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const watchStatus = watch('isOpen', shopData.isOpen);

  useEffect(() => {
    // Show onboarding for new owners
    if (!localStorage.getItem('statusly-owner-onboarded')) {
      setShowOnboarding(true);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem('statusly-owner-onboarded', 'true');
    setShowOnboarding(false);
  };

  const handleStatusToggle = async (newStatus) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShopData(prev => ({
        ...prev,
        isOpen: newStatus,
        lastUpdated: new Date()
      }));
      
      setSuccess(`Shop is now ${newStatus ? 'open' : 'closed'}`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update shop status. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnnouncementUpdate = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShopData(prev => ({
        ...prev,
        announcement: data.announcement,
        lastUpdated: new Date()
      }));
      
      setSuccess('Announcement updated successfully!');
      reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update announcement. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMenuUpdate = async (data) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newMenuItem = {
        id: Date.now().toString(),
        name: data.name,
        price: parseFloat(data.price),
        available: data.available,
        notes: data.notes || ''
      };

      setShopData(prev => ({
        ...prev,
        menu: [...prev.menu, newMenuItem],
        lastUpdated: new Date()
      }));
      
      setSuccess('Menu item added successfully!');
      setIsModalOpen(false);
      reset();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to add menu item. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMenuItemAvailability = (itemId) => {
    setShopData(prev => ({
      ...prev,
      menu: prev.menu.map(item =>
        item.id === itemId ? { ...item, available: !item.available } : item
      ),
      lastUpdated: new Date()
    }));
  };

  const removeMenuItem = (itemId) => {
    setShopData(prev => ({
      ...prev,
      menu: prev.menu.filter(item => item.id !== itemId),
      lastUpdated: new Date()
    }));
  };

  if (showOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Shop Dashboard!</h1>
            <p className="text-gray-600">Manage your shop's status, menu, and announcements in real-time</p>
          </div>

          <div className="space-y-6 mb-8">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Update Shop Status</h3>
                <p className="text-gray-600 text-sm">Toggle between open/closed status to keep customers informed</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Manage Your Menu</h3>
                <p className="text-gray-600 text-sm">Add, edit, and update menu items with prices and availability</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">Post Announcements</h3>
                <p className="text-gray-600 text-sm">Share special offers, events, or important updates with customers</p>
              </div>
            </div>
          </div>

          <Button onClick={handleGetStarted} variant="primary" size="lg" className="w-full">
            Get Started
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shop Dashboard</h1>
              <p className="text-gray-600">Manage your shop's status and information</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Followers</p>
                <p className="text-lg font-semibold text-gray-900">{shopData.followersCount}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {shopData.lastUpdated.toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-green-800 font-medium">{success}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-red-800 font-medium">{error}</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Status Management */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Shop Status</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Status</span>
                  <StatusToggle
                    isOpen={shopData.isOpen}
                    onToggle={handleStatusToggle}
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                    <input
                      type="time"
                      value={shopData.openTime}
                      onChange={(e) => setShopData(prev => ({ ...prev, openTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                    <input
                      type="time"
                      value={shopData.closeTime}
                      onChange={(e) => setShopData(prev => ({ ...prev, closeTime: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Status:</span> {shopData.isOpen ? 'Open' : 'Closed'}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Hours:</span> {shopData.openTime} - {shopData.closeTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Announcements */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h2>
              
              <form onSubmit={handleSubmit(handleAnnouncementUpdate)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Message
                  </label>
                  <textarea
                    {...register('announcement', { maxLength: 200 })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Share special offers, events, or important updates..."
                  />
                  {errors.announcement && (
                    <p className="mt-1 text-sm text-red-600">{errors.announcement.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? 'Updating...' : 'Update Announcement'}
                </Button>
              </form>

              {shopData.announcement && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">{shopData.announcement}</p>
                </div>
              )}
            </div>
          </div>

          {/* Menu Management */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Menu Management</h2>
                <Button
                  onClick={() => setIsModalOpen(true)}
                  variant="primary"
                  size="sm"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Item
                </Button>
              </div>

              {shopData.menu.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No menu items yet</h3>
                  <p className="text-gray-600 mb-4">Add your first menu item to get started</p>
                  <Button onClick={() => setIsModalOpen(true)} variant="primary">
                    Add First Item
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {shopData.menu.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 border rounded-lg transition-all duration-200 ${
                        item.available
                          ? 'border-gray-200 bg-white'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3">
                            <h3 className={`font-medium ${item.available ? 'text-gray-900' : 'text-gray-500'}`}>
                              {item.name}
                            </h3>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.available
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              {item.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">₹{item.price}</p>
                          {item.notes && (
                            <p className="text-xs text-gray-500 mt-1">{item.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => toggleMenuItemAvailability(item.id)}
                            className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                              item.available
                                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            {item.available ? 'Mark Unavailable' : 'Mark Available'}
                          </button>
                          <button
                            onClick={() => removeMenuItem(item.id)}
                            className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Menu Item Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Menu Item</h2>
          
          <form onSubmit={handleSubmit(handleMenuUpdate)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item Name *
              </label>
              <input
                type="text"
                {...register('name', { required: 'Item name is required' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Chicken Biryani"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price (₹) *
              </label>
              <input
                type="number"
                step="0.01"
                {...register('price', { 
                  required: 'Price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes (Optional)
              </label>
              <textarea
                {...register('notes')}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="e.g., Spicy and aromatic, contains nuts"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                {...register('available')}
                defaultChecked={true}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700">
                Available for order
              </label>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? 'Adding...' : 'Add Item'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default OwnerDashboard;

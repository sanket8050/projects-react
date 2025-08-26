// AI: Shop card component with hover effects, status badges, and menu preview
import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistance } from '../utils/helpers';

const ShopCard = ({ shop, userLocation }) => {
  const distance = userLocation 
    ? formatDistance(userLocation.lat, userLocation.lng, shop.location.lat, shop.location.lng)
    : null;

  const topMenuItems = shop.todayMenu?.slice(0, 2) || [];

  return (
    <Link 
      to={`/shop/${shop._id}`}
      className="block group"
    >
      <div className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-105 border border-gray-100 overflow-hidden">
        {/* Header with status */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors duration-200">
              {shop.name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              shop.isOpen 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {shop.isOpen ? 'Open' : 'Closed'}
            </span>
          </div>
          
          {/* Type and distance */}
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span className="capitalize bg-gray-100 px-2 py-1 rounded text-xs">
              {shop.type}
            </span>
            {distance && (
              <span className="text-gray-500">
                {distance} away
              </span>
            )}
          </div>
        </div>

        {/* Menu preview */}
        {topMenuItems.length > 0 && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Today's Menu</h4>
            <div className="space-y-1">
              {topMenuItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 truncate">{item.name}</span>
                  {item.price && (
                    <span className="text-green-600 font-medium">
                      ₹{item.price}
                    </span>
                  )}
                </div>
              ))}
            </div>
            {shop.todayMenu?.length > 2 && (
              <p className="text-xs text-gray-500 mt-2">
                +{shop.todayMenu.length - 2} more items
              </p>
            )}
          </div>
        )}

        {/* Footer with last updated */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              Last updated: {new Date(shop.lastUpdated).toLocaleTimeString()}
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              {shop.followersCount || 0} followers
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;

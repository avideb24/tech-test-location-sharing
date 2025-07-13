'use client';

import { useState } from 'react';
import RealTimeLocationSharing from '../components/RealTimeLocationSharing';
import InfiniteScrollUserFeed from '../components/InfiniteScrollUserFeed';

const HomePage = () => {
  const [activeFeature, setActiveFeature] = useState('location');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-center py-4 gap-5">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tech Test</h1>
              <p className="text-sm text-gray-600">API Integration & Real-Time Features</p>
            </div>
            
            {/* Feature Navigation */}
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveFeature('location')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFeature === 'location'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Real-Time Location
              </button>
              <button
                onClick={() => setActiveFeature('users')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeFeature === 'users'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                User Feed
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-8">
        {activeFeature === 'location' ? (
          <RealTimeLocationSharing />
        ) : (
          <InfiniteScrollUserFeed />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-600">
            <p>Built with Next.js, SignalR, and Leaflet</p>
            <p className="mt-1">API Integration & Real-Time Features Demo</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
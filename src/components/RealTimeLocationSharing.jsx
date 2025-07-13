'use client';

import { useState } from 'react';
import LocationSender from './LocationSender';
import LocationReceiver from './LocationReceiver';

const RealTimeLocationSharing = () => {
  const [activeTab, setActiveTab] = useState('sender');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-xl lg:text-3xl font-bold text-gray-800 mb-2">Real-Time Location Sharing</h1>
        <p className="text-gray-600">
          Use SignalR WebSocket to share and receive real-time location updates between users
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab('sender')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'sender'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Location Sender (User A)
        </button>
        <button
          onClick={() => setActiveTab('receiver')}
          className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'receiver'
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
        >
          Location Receiver (User B)
        </button>
      </div>

      {/* Tab Content */}
      <div className="min-h-[600px]">
        {activeTab === 'sender' ? (
          <LocationSender />
        ) : (
          <LocationReceiver />
        )}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Test</h3>
        <ol className="text-blue-700 space-y-1 text-sm">
          <li>1. Open this page in two different browser tabs/windows</li>
          <li>2. In the first tab, go to "Location Sender" and enter your email</li>
          <li>3. If SignalR connection fails, enable "Demo Mode" to test the interface</li>
          <li>4. Click "Start Sharing Location" (or "Start Demo Mode") to begin</li>
          <li>5. In the second tab, go to "Location Receiver" and enable "Demo Mode" if needed</li>
          <li>6. Click "Start Listening" (or "Start Demo Mode") to receive updates</li>
          <li>7. Watch as real-time location updates appear on the map!</li>
        </ol>
        <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> If you see connection errors, this is due to CORS restrictions.
            Use "Demo Mode" to test the interface functionality without requiring a SignalR connection.
          </p>
        </div>
      </div>


    </div>
  );
};

export default RealTimeLocationSharing; 
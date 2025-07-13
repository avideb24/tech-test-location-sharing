'use client';

import { useState, useEffect, useRef } from 'react';
import { useSignalR } from '../hooks/useSignalR';
import dynamic from 'next/dynamic';

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-gray-600">Loading map...</div>
    </div>
  )
});

const LocationReceiver = () => {
  const [receivedLocations, setReceivedLocations] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { isConnected, onMessage, offMessage, error, connectionState, retryConnection, checkConnectionStatus } = useSignalR('https://tech-test.raintor.com/Hub');

  const handleLocationUpdate = (data) => {
    console.log('Received location update:', data);
    setReceivedLocations(prev => {
      const newLocation = {
        ...data,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now()
      };
      
      // Keep only the last 10 locations
      const updated = [...prev, newLocation].slice(-10);
      return updated;
    });
  };

  const startListening = () => {
    if (!isConnected && !isDemoMode) {
      alert('SignalR connection not established. Please check your internet connection or try demo mode.');
      return;
    }

    setIsListening(true);
    
    if (isConnected) {
      try {
        onMessage('ReceiveLatLon', handleLocationUpdate);
        console.log('Started listening for location updates via SignalR');
      } catch (err) {
        console.error('Failed to start listening:', err);
        setIsListening(false);
      }
    } else if (isDemoMode) {
      // Demo mode: simulate location updates
      console.log('Starting demo mode with simulated location updates');
      const demoInterval = setInterval(() => {
        const demoLocation = {
          userName: 'Demo User',
          lat: 25.73736464 + (Math.random() - 0.5) * 0.01,
          lon: 90.3644747 + (Math.random() - 0.5) * 0.01
        };
        handleLocationUpdate(demoLocation);
      }, 5000);
      
      // Store interval for cleanup
      window.demoInterval = demoInterval;
    }
  };

  const stopListening = () => {
    setIsListening(false);
    offMessage('ReceiveLatLon', handleLocationUpdate);
    
    // Clear demo interval if it exists
    if (window.demoInterval) {
      clearInterval(window.demoInterval);
      window.demoInterval = null;
    }
  };

  useEffect(() => {
    return () => {
      offMessage('ReceiveLatLon', handleLocationUpdate);
    };
  }, [offMessage]);

  const clearLocations = () => {
    setReceivedLocations([]);
  };

  const latestLocation = receivedLocations[receivedLocations.length - 1];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Location Receiver (User B)</h2>
      
      {/* Connection Status */}
      <div className="mb-4">
        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
          isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
          {isConnected ? 'Connected' : 'Disconnected'}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          SignalR State: {connectionState}
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="mb-2">
            <strong>Connection Error:</strong> {error.message}
          </div>
          <div className="text-sm">
            <p>This is likely due to CORS restrictions when connecting to the external SignalR hub.</p>
            <p>To test the real-time features, you may need to:</p>
            <ul className="list-disc list-inside mt-1 ml-2">
              <li>Use a CORS proxy</li>
              <li>Run the app from the same domain as the SignalR hub</li>
              <li>Contact the API provider to enable CORS for your domain</li>
            </ul>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="mb-6 flex gap-2">
        {!isListening ? (
          <button
            onClick={startListening}
            disabled={(!isConnected && !isDemoMode)}
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isDemoMode ? 'Start Demo Mode' : 'Start Listening'}
          </button>
        ) : (
          <button
            onClick={stopListening}
            className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Stop Listening
          </button>
        )}
        
        {error && (
          <div className="flex gap-2">
            <button
              onClick={retryConnection}
              className="bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors"
            >
              Retry Connection
            </button>
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`px-4 py-2 rounded-md transition-colors ${
                isDemoMode 
                  ? 'bg-green-600 text-white' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isDemoMode ? 'Demo Mode ON' : 'Enable Demo Mode'}
            </button>
            <button
              onClick={() => {
                const status = checkConnectionStatus();
                console.log('Current connection status:', status);
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Debug Status
            </button>
          </div>
        )}
        
        <button
          onClick={clearLocations}
          className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Clear History
        </button>
      </div>

      {/* Status */}
      {isListening && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            🎧 {isDemoMode ? 'Demo mode: Simulating location updates every 5 seconds...' : 'Listening for location updates...'}
          </p>
        </div>
      )}

      {/* Map Display */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Live Location Map</h3>
        {latestLocation ? (
          <MapComponent location={latestLocation} />
        ) : (
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-gray-500 text-center">
              <p>No location data received yet</p>
              <p className="text-sm">Start listening to see locations on the map</p>
            </div>
          </div>
        )}
      </div>

      {/* Location History */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-700">
          Location History ({receivedLocations.length})
        </h3>
        {receivedLocations.length > 0 ? (
          <div className="max-h-64 overflow-y-auto space-y-2">
            {receivedLocations.slice().reverse().map((location) => (
              <div
                key={location.id}
                className="p-3 bg-gray-50 rounded-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{location.userName}</p>
                    <p className="text-sm text-gray-600">
                      Lat: {location.lat.toFixed(6)}, Lon: {location.lon.toFixed(6)}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">{location.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-4 bg-gray-50 rounded-md text-center text-gray-500">
            No location history available
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationReceiver; 
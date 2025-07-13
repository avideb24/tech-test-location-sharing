'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSignalR } from '../hooks/useSignalR';

const LocationSender = () => {
  const [userName, setUserName] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isSharing, setIsSharing] = useState(false);
  const [locationInterval, setLocationInterval] = useState(null);
  const [simulatedLocation, setSimulatedLocation] = useState({
    lat: 25.73736464,
    lon: 90.3644747
  });

  const { isConnected, sendMessage, error, connectionState, retryConnection, checkConnectionStatus } = useSignalR('https://tech-test.raintor.com/Hub');
  const [isDemoMode, setIsDemoMode] = useState(false);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.error('Error getting location:', error);
          // Fallback to simulated location
          setCurrentLocation(simulatedLocation);
        }
      );
    } else {
      console.log('Geolocation not supported, using simulated location');
      setCurrentLocation(simulatedLocation);
    }
  }, [simulatedLocation]);

  const startSharing = useCallback(() => {
    if (!userName.trim()) {
      alert('Please enter your email as username');
      return;
    }

    if (!isConnected && !isDemoMode) {
      alert('SignalR connection not established. Please check your internet connection or try demo mode.');
      return;
    }

    setIsSharing(true);
    getCurrentLocation();

    // Send location every 5 seconds
    const interval = setInterval(() => {
      const location = currentLocation || simulatedLocation;
      if (isConnected) {
        try {
          // Test the API call format
          console.log('Attempting to send location via SignalR...');
          console.log('Method: SendLatLon');
          console.log('Parameters:', { lat: location.lat, lon: location.lon, userName });
          
          sendMessage('SendLatLon', location.lat, location.lon, userName);
          console.log('Sent location via SignalR:', location);
        } catch (err) {
          console.error('Failed to send location:', err);
        }
      } else if (isDemoMode) {
        console.log('Demo mode: Simulating location send:', location);
      }
    }, 5000);

    setLocationInterval(interval);
  }, [userName, isConnected, isDemoMode, currentLocation, simulatedLocation, sendMessage, getCurrentLocation]);

  const stopSharing = useCallback(() => {
    setIsSharing(false);
    if (locationInterval) {
      clearInterval(locationInterval);
      setLocationInterval(null);
    }
  }, [locationInterval]);

  const updateSimulatedLocation = useCallback((field, value) => {
    setSimulatedLocation(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  }, []);

  useEffect(() => {
    if (isSharing && currentLocation) {
      sendMessage('SendLatLon', currentLocation.lat, currentLocation.lon, userName);
    }
  }, [isSharing, currentLocation, userName, sendMessage]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Location Sender (User A)</h2>
      
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
          Connection Error: {error.message}
        </div>
      )}

      {/* User Name Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your Email (Username)
        </label>
        <input
          type="email"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isSharing}
        />
      </div>

      {/* Current Location Display */}
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Current Location</h3>
        {currentLocation ? (
          <div className="text-sm text-gray-600">
            <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
            <p>Longitude: {currentLocation.lon.toFixed(6)}</p>
          </div>
        ) : (
          <p className="text-sm text-gray-500">No location available</p>
        )}
      </div>

      {/* Simulated Location Controls */}
      <div className="mb-4 p-3 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Simulated Location</h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs text-gray-600">Latitude</label>
            <input
              type="number"
              step="any"
              value={simulatedLocation.lat}
              onChange={(e) => updateSimulatedLocation('lat', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-600">Longitude</label>
            <input
              type="number"
              step="any"
              value={simulatedLocation.lon}
              onChange={(e) => updateSimulatedLocation('lon', e.target.value)}
              className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Demo Mode Toggle */}
              {error && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-sm text-yellow-800">
                  SignalR connection failed. You can try demo mode to test the interface.
                </p>
              </div>
              <button
                onClick={() => setIsDemoMode(!isDemoMode)}
                className={`px-3 py-1 text-xs rounded-md transition-colors ${
                  isDemoMode 
                    ? 'bg-green-600 text-white' 
                    : 'bg-yellow-600 text-white hover:bg-yellow-700'
                }`}
              >
                {isDemoMode ? 'Demo Mode ON' : 'Enable Demo Mode'}
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={retryConnection}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Retry Connection
              </button>
              <button
                onClick={() => {
                  const status = checkConnectionStatus();
                  console.log('Current connection status:', status);
                }}
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
              >
                Debug Status
              </button>
            </div>
          </div>
        )}

      {/* Control Buttons */}
      <div className="space-y-2">
        {!isSharing ? (
          <button
            onClick={startSharing}
            disabled={(!isConnected && !isDemoMode) || !userName.trim()}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {isDemoMode ? 'Start Demo Mode' : 'Start Sharing Location'}
          </button>
        ) : (
          <button
            onClick={stopSharing}
            className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
          >
            Stop Sharing Location
          </button>
        )}
        
        <button
          onClick={getCurrentLocation}
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors"
        >
          Update Current Location
        </button>
        
        {isConnected && (
          <button
            onClick={() => {
              const location = currentLocation || simulatedLocation;
              console.log('Testing SignalR API call...');
              sendMessage('SendLatLon', location.lat, location.lon, userName || 'test@example.com');
            }}
            className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
          >
            Test SignalR API Call
          </button>
        )}
      </div>

      {/* Status */}
      {isSharing && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✅ {isDemoMode ? 'Demo mode: Simulating location sharing every 5 seconds...' : 'Sharing location every 5 seconds...'}
          </p>
        </div>
      )}
    </div>
  );
};

export default LocationSender; 
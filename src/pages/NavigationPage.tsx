import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavigationSteps } from '../components/NavigationSteps';
import { useApp } from '../context/AppContext';
import { locations, generateMockRoute } from '../data/locations';
import { Navigation, MapPin, ArrowRight, AlertCircle } from 'lucide-react';

export const NavigationPage = () => {
  const navigate = useNavigate();
  const {
    currentLocation,
    setCurrentLocation,
    selectedDestination,
    setSelectedDestination,
    navigationSteps,
    setNavigationSteps,
  } = useApp();

  const [startLocationId, setStartLocationId] = useState<number>(
    currentLocation?.id || 0
  );
  const [destinationId, setDestinationId] = useState<number>(
    selectedDestination?.id || 0
  );
  const [showRoute, setShowRoute] = useState(false);

  useEffect(() => {
    if (currentLocation) {
      setStartLocationId(currentLocation.id);
    }
  }, [currentLocation]);

  useEffect(() => {
    if (selectedDestination) {
      setDestinationId(selectedDestination.id);
    }
  }, [selectedDestination]);

  const handleFindRoute = () => {
    if (startLocationId === 0 || destinationId === 0) {
      return;
    }

    if (startLocationId === destinationId) {
      return;
    }

    const startLoc = locations.find((loc) => loc.id === startLocationId);
    const destLoc = locations.find((loc) => loc.id === destinationId);

    if (startLoc && destLoc) {
      const steps = generateMockRoute(startLoc.name, destLoc.name);
      setNavigationSteps(steps);
      setCurrentLocation(startLoc);
      setSelectedDestination(destLoc);
      setShowRoute(true);
    }
  };

  const handleReset = () => {
    setShowRoute(false);
    setNavigationSteps([]);
  };

  const canFindRoute = startLocationId !== 0 && destinationId !== 0 && startLocationId !== destinationId;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Navigation className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Navigation
            </h2>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Select your start location and destination to get directions
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Start Location
              </label>
              <select
                value={startLocationId}
                onChange={(e) => setStartLocationId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white"
              >
                <option value={0}>Select start location...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} - {loc.floor}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <ArrowRight className="w-6 h-6 text-gray-400 dark:text-gray-600" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Destination
              </label>
              <select
                value={destinationId}
                onChange={(e) => setDestinationId(Number(e.target.value))}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white"
              >
                <option value={0}>Select destination...</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name} - {loc.floor}
                  </option>
                ))}
              </select>
            </div>

            {startLocationId === destinationId && startLocationId !== 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  Start location and destination cannot be the same
                </p>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={handleFindRoute}
                disabled={!canFindRoute}
                className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                  canFindRoute
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Find Route
              </button>

              {showRoute && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {showRoute && navigationSteps.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Your Route
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {navigationSteps.length} steps
              </div>
            </div>
            <NavigationSteps steps={navigationSteps} />
          </div>
        )}

        {!showRoute && (
          <div className="text-center py-16">
            <div className="text-gray-300 dark:text-gray-700 mb-4">
              <Navigation className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Ready to navigate
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select your locations and click "Find Route" to get started
            </p>
            <button
              onClick={() => navigate('/qr-scan')}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              Or scan a QR code to set your location
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

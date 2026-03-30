import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, MapPin, CheckCircle, Scan, Navigation } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { locations } from '../data/locations';

export const QRScanPage = () => {
  const navigate = useNavigate();
  const { setCurrentLocation, currentLocation, setSelectedDestination } = useApp();
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number>(0);

  const handleSimulateScan = () => {
    setIsScanning(true);

    setTimeout(() => {
      const randomLocation = locations[Math.floor(Math.random() * locations.length)];
      setCurrentLocation(randomLocation);
      setIsScanning(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 2000);
  };

  const handleOpenARMap = () => {
    if (currentLocation && selectedDestinationId) {
      const destination = locations.find(loc => loc.id === selectedDestinationId);
      if (destination) {
        setSelectedDestination(destination);
        navigate('/ar-map');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <QrCode className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              QR Code Scanner
            </h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Scan a QR code to set your current location
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col items-center">
            <div
              className={`w-64 h-64 rounded-2xl flex items-center justify-center mb-8 transition-all ${
                isScanning
                  ? 'bg-blue-100 dark:bg-blue-900/30 animate-pulse'
                  : showSuccess
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {isScanning ? (
                <Scan className="w-32 h-32 text-blue-600 dark:text-blue-400 animate-pulse" />
              ) : showSuccess ? (
                <CheckCircle className="w-32 h-32 text-green-600 dark:text-green-400" />
              ) : (
                <QrCode className="w-32 h-32 text-gray-400 dark:text-gray-600" />
              )}
            </div>

            {isScanning && (
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-6 animate-pulse">
                Scanning QR Code...
              </p>
            )}

            {showSuccess && currentLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 w-full">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
                    Location Set Successfully!
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-1">You are now at:</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {currentLocation.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {currentLocation.floor}
                  </p>
                </div>
              </div>
            )}

            {currentLocation && !showSuccess && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6 w-full">
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Current Location (FROM)</p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {currentLocation.name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={handleSimulateScan}
              disabled={isScanning}
              className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
                isScanning
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
              }`}
            >
              {isScanning ? 'Scanning...' : 'Simulate QR Scan'}
            </button>

            {currentLocation && !isScanning && (
              <>
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <MapPin className="w-4 h-4 inline mr-1" />
                    Select Destination (TO)
                  </label>
                  <select
                    value={selectedDestinationId}
                    onChange={(e) => setSelectedDestinationId(Number(e.target.value))}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white"
                  >
                    <option value={0}>Select a destination...</option>
                    {locations
                      .filter(loc => loc.id !== currentLocation.id)
                      .map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} - {loc.floor}
                        </option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={handleOpenARMap}
                  disabled={selectedDestinationId === 0}
                  className={`w-full mt-4 py-4 rounded-xl font-semibold text-lg transition-all flex items-center justify-center ${
                    selectedDestinationId !== 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95'
                      : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Navigation className="w-5 h-5 mr-2" />
                  Open AR Map
                </button>
              </>
            )}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
            How it works
          </h3>
          <ul className="space-y-3 text-gray-600 dark:text-gray-400">
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </span>
              <span>Locate a QR code placed throughout the building</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </span>
              <span>Click "Simulate QR Scan" to set your position</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </span>
              <span>Your current location will be automatically updated</span>
            </li>
            <li className="flex items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                4
              </span>
              <span>Navigate to your destination with precise directions</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

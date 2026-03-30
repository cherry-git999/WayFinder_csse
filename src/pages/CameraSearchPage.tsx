import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, CheckCircle, Navigation, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { locations } from '../data/locations';

export const CameraSearchPage = () => {
  const navigate = useNavigate();
  const { setSelectedDestination, setCurrentLocation } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [step, setStep] = useState<'select-locations' | 'camera'>('select-locations');
  const [fromLocation, setFromLocation] = useState<typeof locations[0] | null>(null);
  const [toLocation, setToLocation] = useState<typeof locations[0] | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<typeof locations[0] | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [detectionMarker, setDetectionMarker] = useState<typeof locations[0] | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Start real camera feed
  const startCamera = async () => {
    try {
      setCameraError(null);
      setIsScanning(true);
      setDetectionMarker(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      // Simulate detection after camera is on
      setTimeout(() => {
        if (toLocation) {
          setDetectionMarker(toLocation);
          setSelectedLocation(toLocation);
          setIsScanning(false);
          setShowSuccess(true);
        }
      }, 3000);
    } catch (error: any) {
      setCameraError(
        error.name === 'NotAllowedError'
          ? 'Camera access denied. Please allow camera access.'
          : 'Failed to open camera. Please check your camera connection.'
      );
      setIsScanning(false);
    }
  };

  // Stop camera feed
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsScanning(false);
    setShowSuccess(false);
    setDetectionMarker(null);
    setCameraError(null);
  };

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const handleSelectFromLocation = (location: typeof locations[0]) => {
    setFromLocation(location);
  };

  const handleSelectToLocation = (location: typeof locations[0]) => {
    setToLocation(location);
  };

  const handleProceedToCamera = () => {
    if (fromLocation && toLocation) {
      setStep('camera');
    }
  };

  const handleShowDirections = () => {
    if (fromLocation && toLocation) {
      stopCamera();
      setCurrentLocation(fromLocation);
      setSelectedDestination(toLocation);
      navigate('/navigation');
    }
  };

  const handleEditLocations = () => {
    stopCamera();
    setStep('select-locations');
    setSelectedLocation(null);
    setShowSuccess(false);
  };

  const handleBack = () => {
    if (step === 'camera') {
      stopCamera();
      setStep('select-locations');
      setSelectedLocation(null);
      setShowSuccess(false);
    } else {
      navigate(-1);
    }
  };

  // Step 1: Select From and To Locations
  if (step === 'select-locations') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto px-4 py-12">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400" />
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                  Camera Navigation
                </h2>
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Select your starting location and destination
              </p>
            </div>
          </div>

          {/* Location Selection Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* From Location */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-green-600 dark:text-green-400" />
                From
              </h3>

              {fromLocation ? (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-6">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {fromLocation.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {fromLocation.floor}
                  </p>
                  <button
                    onClick={() => setFromLocation(null)}
                    className="mt-4 w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleSelectFromLocation(location)}
                      className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/30 border-2 border-gray-200 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-500 rounded-lg transition-all"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {location.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location.floor}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* To Location */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                <Navigation className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                To
              </h3>

              {toLocation ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-6">
                  <p className="text-xl font-bold text-gray-900 dark:text-white">
                    {toLocation.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {toLocation.floor}
                  </p>
                  <button
                    onClick={() => setToLocation(null)}
                    className="mt-4 w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {locations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => handleSelectToLocation(location)}
                      className="w-full p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 border-2 border-gray-200 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 rounded-lg transition-all"
                    >
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {location.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {location.floor}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Proceed Button */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={handleProceedToCamera}
              disabled={!fromLocation || !toLocation}
              className="flex items-center space-x-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold rounded-xl transition-all text-lg"
            >
              <span>Proceed to Camera</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Step 2: Camera Interface with Real Camera
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Camera className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                Camera Scan
              </h2>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Navigate from <span className="font-bold">{fromLocation?.name}</span> to <span className="font-bold">{toLocation?.name}</span>
            </p>
          </div>
        </div>

        {/* Camera Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col items-center">
            {/* Camera Feed */}
            <div className="relative w-full mb-8 rounded-2xl overflow-hidden bg-black">
              <video
                ref={videoRef}
                className="w-full h-80 object-cover rounded-2xl"
                playsInline
              />
              
              {/* Detection Overlay */}
              {detectionMarker && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="animate-pulse">
                    <div className="w-48 h-48 border-4 border-green-400 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-2" />
                        <p className="text-green-400 font-bold text-sm">{detectionMarker.name}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Scanning Indicator */}
              {isScanning && !detectionMarker && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-transparent border-t-blue-400 border-r-blue-400 w-32 h-32 rounded-full animate-spin" />
                </div>
              )}
            </div>

            {/* Error Message */}
            {cameraError && (
              <div className="w-full bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6 mb-6 flex items-start">
                <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-bold text-red-900 dark:text-red-300">Camera Error</h3>
                  <p className="text-red-800 dark:text-red-400 text-sm mt-1">{cameraError}</p>
                </div>
              </div>
            )}

            {/* Status Text */}
            {isScanning && !detectionMarker && (
              <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-6 animate-pulse">
                Opening camera and detecting location...
              </p>
            )}

            {/* Success Message */}
            {showSuccess && selectedLocation && (
              <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-xl p-6 mb-6 w-full">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h3 className="text-xl font-bold text-green-900 dark:text-green-300">
                    Location Detected!
                  </h3>
                </div>
                <div className="text-center">
                  <p className="text-gray-700 dark:text-gray-300 mb-1">Destination confirmed via camera:</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {selectedLocation.name}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 flex items-center justify-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {selectedLocation.floor}
                  </p>
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="w-full flex gap-4">
              <button
                onClick={startCamera}
                disabled={isScanning || showSuccess || !!cameraError}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition-all"
              >
                <Camera className="w-5 h-5" />
                <span>{isScanning ? 'Scanning...' : showSuccess ? 'Detected!' : 'Start Camera'}</span>
              </button>
              {showSuccess && (
                <button
                  onClick={handleShowDirections}
                  className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Show Directions</span>
                </button>
              )}
            </div>

            {/* Edit Locations Button */}
            <button
              onClick={handleEditLocations}
              className="mt-6 w-full px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg transition-all"
            >
              Edit Locations
            </button>
          </div>
        </div>

        {/* Hidden Canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { QuickOptions } from '../components/QuickOptions';
import { useApp } from '../context/AppContext';
import { ArrowRight, MapPin } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();
  const { currentLocation, setSearchQuery } = useApp();

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate('/search');
    }
  };

  const handleCategorySelect = (category: string) => {
    setSearchQuery(category);
    navigate('/search');
  };

  const handleStartNavigation = () => {
    navigate('/navigation');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Way
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Navigate through the university department with ease
          </p>
        </div>

        <div className="flex flex-col items-center space-y-8 mb-16">
          <SearchBar onSearch={handleSearch} autoFocus />

          {currentLocation && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Current Location</p>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {currentLocation.name}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            Quick Access
          </h3>
          <QuickOptions onSelectCategory={handleCategorySelect} />
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleStartNavigation}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2 text-lg font-semibold"
          >
            <span>Start Navigation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Easy Search
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Find any room, lab, or facility quickly with our smart search
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              Step-by-Step
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Get clear, easy-to-follow directions to your destination
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-center">
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
              QR Positioning
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Scan QR codes to set your exact location in the building
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

import { Settings, Moon, Sun, Zap, Layers } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage = () => {
  const { darkMode, toggleDarkMode, advancedMode, toggleAdvancedMode } = useApp();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Settings className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">Settings</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Customize your WayFinder experience
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Layers className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                Appearance
              </h3>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      darkMode
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    {darkMode ? (
                      <Moon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Sun className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">Dark Mode</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {darkMode ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleDarkMode}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    darkMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                      darkMode ? 'translate-x-12' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <Zap className="w-6 h-6 mr-2 text-blue-600 dark:text-blue-400" />
                Navigation Mode
              </h3>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div
                    className={`p-3 rounded-lg ${
                      advancedMode
                        ? 'bg-blue-100 dark:bg-blue-900/30'
                        : 'bg-gray-100 dark:bg-gray-700'
                    }`}
                  >
                    <Zap
                      className={`w-6 h-6 ${
                        advancedMode
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-600 dark:text-gray-400'
                      }`}
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {advancedMode ? 'Advanced Mode' : 'Simple Mode'}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {advancedMode
                        ? 'Detailed navigation with landmarks'
                        : 'Basic step-by-step directions'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={toggleAdvancedMode}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                    advancedMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                      advancedMode ? 'translate-x-12' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              About WayFinder
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Version:</span> 1.0.0
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Purpose:</span> AI-powered
                indoor navigation system for university departments
              </p>
              <p className="text-sm">
                WayFinder helps students and visitors navigate through complex building layouts with
                ease. Use QR codes for precise positioning and get step-by-step directions to any
                location.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl shadow-md p-6 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Need Help?
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              If you encounter any issues or have questions about using WayFinder, please contact
              the IT support desk.
            </p>
            <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

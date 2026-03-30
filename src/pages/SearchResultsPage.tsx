import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/SearchBar';
import { LocationCard } from '../components/LocationCard';
import { useApp } from '../context/AppContext';
import { locations, Location } from '../data/locations';
import { Filter, X } from 'lucide-react';

export const SearchResultsPage = () => {
  const navigate = useNavigate();
  const { searchQuery, setSelectedDestination } = useApp();
  const [filteredLocations, setFilteredLocations] = useState<Location[]>([]);
  const [selectedFloor, setSelectedFloor] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showFilters, setShowFilters] = useState(false);

  const floors = ['All', '1st Floor', '2nd Floor', '3rd Floor'];
  const categories = ['All', 'Lab', 'Classroom', 'Faculty Room', 'Facility'];

  useEffect(() => {
    filterLocations();
  }, [searchQuery, selectedFloor, selectedCategory]);

  const filterLocations = () => {
    let results = locations;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = results.filter(
        (loc) =>
          loc.name.toLowerCase().includes(query) ||
          loc.category.toLowerCase().includes(query) ||
          loc.floor.toLowerCase().includes(query) ||
          loc.description?.toLowerCase().includes(query)
      );
    }

    if (selectedFloor !== 'All') {
      results = results.filter((loc) => loc.floor === selectedFloor);
    }

    if (selectedCategory !== 'All') {
      results = results.filter((loc) => loc.category === selectedCategory);
    }

    setFilteredLocations(results);
  };

  const handleLocationClick = (location: Location) => {
    setSelectedDestination(location);
    navigate('/navigation');
  };

  const clearFilters = () => {
    setSelectedFloor('All');
    setSelectedCategory('All');
  };

  const hasActiveFilters = selectedFloor !== 'All' || selectedCategory !== 'All';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-center space-y-4">
          <SearchBar />

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <span className="text-gray-700 dark:text-gray-300">Filters</span>
              {hasActiveFilters && (
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                <span>Clear filters</span>
              </button>
            )}
          </div>

          {showFilters && (
            <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Floor
                </label>
                <div className="flex flex-wrap gap-2">
                  {floors.map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedFloor === floor
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {floor}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-4 py-2 rounded-lg transition-all ${
                        selectedCategory === category
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mb-6">
          <p className="text-gray-600 dark:text-gray-400">
            Found <span className="font-semibold text-gray-900 dark:text-white">{filteredLocations.length}</span> results
          </p>
        </div>

        {filteredLocations.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 dark:text-gray-600 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No results found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                onClick={() => handleLocationClick(location)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

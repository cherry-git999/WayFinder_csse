import { Search, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  showCamera?: boolean;
}

export const SearchBar = ({
  placeholder = 'Search for labs, rooms, facilities...',
  onSearch,
  autoFocus = false,
  showCamera = true
}: SearchBarProps) => {
  const navigate = useNavigate();
  const { searchQuery, setSearchQuery } = useApp();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleCameraClick = () => {
    navigate('/camera-search');
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
        <Search className="w-5 h-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full pl-12 pr-14 py-4 text-lg bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
      />
      {showCamera && (
        <button
          onClick={handleCameraClick}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          title="Search with camera"
          aria-label="Camera search"
        >
          <Camera className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

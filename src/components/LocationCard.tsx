import { MapPin, Building2, FlaskConical, Users, Wifi } from 'lucide-react';
import { Location } from '../data/locations';

interface LocationCardProps {
  location: Location;
  onClick?: () => void;
  isSelected?: boolean;
}

export const LocationCard = ({ location, onClick, isSelected }: LocationCardProps) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Lab':
        return <FlaskConical className="w-5 h-5" />;
      case 'Classroom':
        return <Building2 className="w-5 h-5" />;
      case 'Faculty Room':
        return <Users className="w-5 h-5" />;
      case 'Facility':
        return <Wifi className="w-5 h-5" />;
      default:
        return <MapPin className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Lab':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Classroom':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Faculty Room':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
      case 'Facility':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
        isSelected
          ? 'border-blue-500 dark:border-blue-400 ring-4 ring-blue-500/20'
          : 'border-transparent hover:border-blue-200 dark:hover:border-gray-700'
      }`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {location.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {location.floor}
            </p>
          </div>
          <div className={`p-2 rounded-lg ${getCategoryColor(location.category)}`}>
            {getCategoryIcon(location.category)}
          </div>
        </div>
        {location.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {location.description}
          </p>
        )}
        <span
          className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
            location.category
          )}`}
        >
          {location.category}
        </span>
      </div>
    </div>
  );
};

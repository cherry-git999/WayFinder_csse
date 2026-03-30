import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Location, NavigationStep } from '../data/locations';

interface AppContextType {
  currentLocation: Location | null;
  setCurrentLocation: (location: Location | null) => void;
  selectedDestination: Location | null;
  setSelectedDestination: (location: Location | null) => void;
  navigationSteps: NavigationStep[];
  setNavigationSteps: (steps: NavigationStep[]) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  advancedMode: boolean;
  toggleAdvancedMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [selectedDestination, setSelectedDestination] = useState<Location | null>(null);
  const [navigationSteps, setNavigationSteps] = useState<NavigationStep[]>([]);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [advancedMode, setAdvancedMode] = useState(() => {
    const saved = localStorage.getItem('advancedMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('advancedMode', JSON.stringify(advancedMode));
  }, [advancedMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleAdvancedMode = () => setAdvancedMode(!advancedMode);

  return (
    <AppContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        selectedDestination,
        setSelectedDestination,
        navigationSteps,
        setNavigationSteps,
        darkMode,
        toggleDarkMode,
        advancedMode,
        toggleAdvancedMode,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { SearchResultsPage } from './pages/SearchResultsPage';
import { NavigationPage } from './pages/NavigationPage';
import { QRScanPage } from './pages/QRScanPage';
import { SettingsPage } from './pages/SettingsPage';
import { Navigation3DPage } from './pages/Navigation3DPage';
import { ARMapPage } from './pages/ARMapPage';
import { Test3DPage } from './pages/Test3DPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/navigation" element={<NavigationPage />} />
              <Route path="/test-3d" element={<Test3DPage />} />
              <Route path="/navigation-3d" element={<Navigation3DPage />} />
              <Route path="/ar-map" element={<ARMapPage />} />
              <Route path="/qr-scan" element={<QRScanPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

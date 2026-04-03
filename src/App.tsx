import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';

// Lazy load pages for code splitting
const SearchResultsPage = lazy(() => import('./pages/SearchResultsPage').then(m => ({ default: m.SearchResultsPage })));
const NavigationPage = lazy(() => import('./pages/NavigationPage').then(m => ({ default: m.NavigationPage })));
const QRScanPage = lazy(() => import('./pages/QRScanPage').then(m => ({ default: m.QRScanPage })));
const CameraSearchPage = lazy(() => import('./pages/CameraSearchPage').then(m => ({ default: m.CameraSearchPage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const Navigation3DPage = lazy(() => import('./pages/Navigation3DPage').then(m => ({ default: m.Navigation3DPage })));
const ARMapPage = lazy(() => import('./pages/ARMapPage').then(m => ({ default: m.ARMapPage })));
const Test3DPage = lazy(() => import('./pages/Test3DPage').then(m => ({ default: m.Test3DPage })));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center h-full">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="h-screen bg-gray-50 dark:bg-gray-900 transition-colors flex flex-col">
          <Header />
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/navigation" element={<NavigationPage />} />
                <Route path="/camera-search" element={<CameraSearchPage />} />
                <Route path="/test-3d" element={<Test3DPage />} />
                <Route path="/navigation-3d" element={<Navigation3DPage />} />
                <Route path="/ar-map" element={<ARMapPage />} />
                <Route path="/qr-scan" element={<QRScanPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </Suspense>
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;

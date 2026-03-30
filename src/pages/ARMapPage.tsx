/**
 * AR Map Page
 * Displays the 3D AR view for navigation
 * Shows the route from current location to destination
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { MapPin, X, ArrowLeft } from 'lucide-react';
import Navigation3D from '../components/Navigation3D';

export const ARMapPage = () => {
  const navigate = useNavigate();
  const { currentLocation, selectedDestination } = useApp();
  const [showInfo, setShowInfo] = useState(true);

  useEffect(() => {
    // Redirect if no from/to locations are set
    if (!currentLocation || !selectedDestination) {
      navigate('/qr-scan');
    }
  }, [currentLocation, selectedDestination, navigate]);

  if (!currentLocation || !selectedDestination) {
    return null;
  }

  return (
    <div style={{ display: 'flex', height: '100vh', width: '100%', position: 'relative' }}>
      {/* 3D Canvas */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        <Navigation3D 
          destination={selectedDestination.name}
          currentRoom={currentLocation.name}
        />

        {/* Info Panel - Top Left */}
        {showInfo && (
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              padding: '20px',
              borderRadius: '12px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              maxWidth: '350px',
              zIndex: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: '#1f2937' }}>
                Navigation
              </h3>
              <button
                onClick={() => setShowInfo(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={20} color="#6b7280" />
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#f3f4f6',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <MapPin size={16} color="#2563eb" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>FROM</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {currentLocation.name}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                {currentLocation.floor}
              </p>
            </div>

            <div
              style={{
                backgroundColor: '#dcfce7',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '12px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                <MapPin size={16} color="#16a34a" style={{ marginRight: '8px' }} />
                <span style={{ fontSize: '12px', color: '#6b7280' }}>TO</span>
              </div>
              <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#1f2937' }}>
                {selectedDestination.name}
              </p>
              <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}>
                {selectedDestination.floor}
              </p>
            </div>

            <small style={{ color: '#9ca3af', fontSize: '11px', display: 'block' }}>
              This is a dummy AR map. Use your device camera to scan the real environment.
            </small>
          </div>
        )}

        {/* Show Info Button - Top Left (when hidden) */}
        {!showInfo && (
          <button
            onClick={() => setShowInfo(true)}
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: '600',
              color: '#2563eb',
              zIndex: 10,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            Show Info
          </button>
        )}

        {/* Navigation Controls - Bottom Right */}
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            gap: '12px',
            zIndex: 10,
          }}
        >
          <button
            onClick={() => navigate('/qr-scan')}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              padding: '12px 16px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '600',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

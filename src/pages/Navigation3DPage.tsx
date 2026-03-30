/**
 * Navigation3D Demo Page
 * Showcases the 3D indoor navigation system
 */

import { useState } from 'react';
import Navigation3D from '../components/Navigation3D';
import { getAvailableRooms } from '../utils/navigationGraph';

export const Navigation3DPage = () => {
  const [selectedDestination, setSelectedDestination] = useState<string | undefined>(undefined);
  const [currentRoom] = useState('entrance');
  const rooms = getAvailableRooms();

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%' }}>
      {/* Left sidebar - Controls */}
      <div
        style={{
          width: '250px',
          padding: '20px',
          backgroundColor: '#f9f9f9',
          borderRight: '1px solid #ddd',
          overflowY: 'auto',
        }}
      >
        <h2 style={{ marginTop: 0 }}>WayFinder Navigation</h2>

        {/* Current location display */}
        <div
          style={{
            padding: '12px',
            backgroundColor: '#E8F5E9',
            borderRadius: '4px',
            marginBottom: '20px',
          }}
        >
          <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#666' }}>Current Location</p>
          <p style={{ margin: 0, fontWeight: 'bold', color: '#2E7D32' }}>
            {rooms.find((r) => r.id === currentRoom)?.name || 'Unknown'}
          </p>
        </div>

        {/* Destination selector */}
        <div>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
            Select Destination:
          </label>
          <select
            value={selectedDestination || ''}
            onChange={(e) => setSelectedDestination(e.target.value || undefined)}
            style={{
              width: '100%',
              padding: '8px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              marginBottom: '12px',
              fontSize: '14px',
            }}
          >
            <option value="">-- Choose a room --</option>
            {rooms
              .filter((r) => r.id !== currentRoom)
              .map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name}
                </option>
              ))}
          </select>
        </div>

        {/* Quick buttons */}
        <div style={{ marginBottom: '20px' }}>
          <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Quick Navigation:</p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
            }}
          >
            {rooms
              .filter((r) => r.id !== currentRoom)
              .map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedDestination(room.id)}
                  style={{
                    padding: '8px 12px',
                    backgroundColor: selectedDestination === room.id ? room.color : '#eee',
                    border: selectedDestination === room.id ? '2px solid #333' : '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: selectedDestination === room.id ? 'bold' : 'normal',
                    color: selectedDestination === room.id ? '#fff' : '#333',
                    transition: 'all 0.2s',
                  }}
                >
                  {room.name}
                </button>
              ))}
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            padding: '12px',
            backgroundColor: '#FFFFE0',
            borderRadius: '4px',
            fontSize: '12px',
            lineHeight: '1.5',
          }}
        >
          <strong>Controls:</strong>
          <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
            <li>Drag to rotate</li>
            <li>Scroll to zoom</li>
            <li>Right-click to pan</li>
          </ul>
        </div>

        {/* Selected destination info */}
        {selectedDestination && (
          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#E3F2FD',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <p style={{ margin: '0 0 5px 0', color: '#666' }}>Navigating to:</p>
            <p
              style={{
                margin: 0,
                fontWeight: 'bold',
                color: '#1565C0',
              }}
            >
              {rooms.find((r) => r.id === selectedDestination)?.name}
            </p>
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#666' }}>
              The golden path shows your route. Follow the rooms in order.
            </p>
          </div>
        )}
      </div>

      {/* Right side - 3D Scene */}
      <div style={{ flex: 1, position: 'relative' }}>
        <Navigation3D destination={selectedDestination} currentRoom={currentRoom} />
      </div>
    </div>
  );
};

export default Navigation3DPage;

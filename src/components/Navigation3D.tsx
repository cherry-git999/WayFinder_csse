/**
 * 3D Navigation Scene Component
 * Displays an interactive 3D floor plan with room navigation
 */

import { useEffect, useRef, ReactNode } from 'react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';
import { findPath, pathTo3DCoordinates, getAvailableRooms } from '../utils/navigationGraph';

interface Navigation3DProps {
  destination?: string; // Room ID of the destination
  currentRoom?: string; // Room ID of current location (defaults to 'entrance')
}

/**
 * Error Boundary - catches errors in 3D scene
 */
class ErrorBoundary extends React.Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('3D Scene Error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#666',
          fontSize: '16px',
          flexDirection: 'column',
        }}>
          <p>⚠️ Error loading 3D scene</p>
          <button onClick={() => this.setState({ hasError: false })} style={{
            marginTop: '10px',
            padding: '8px 16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
          }}>
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Floor component - renders the ground plane
 */
const Floor: React.FC = () => {
  return (
    <mesh position={[0, -0.1, -3]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[25, 20]} />
      <meshStandardMaterial color="#E8E8E8" />
    </mesh>
  );
};

/**
 * Room component - renders a single room as a box with a label
 */
interface RoomProps {
  roomId: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
  isDestination?: boolean;
}

const Room: React.FC<RoomProps> = ({ roomId, name, position, size, color, isDestination }) => {
  const [x, y, z] = position;
  const [width, height, depth] = size;

  return (
    <group position={[x, y, z]}>
      {/* Room box */}
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={isDestination ? new THREE.Color(color).multiplyScalar(0.5) : '#000000'}
          emissiveIntensity={isDestination ? 0.8 : 0}
        />
      </mesh>

      {/* Room label */}
      <Text
        position={[0, height / 2 + 0.5, 0]}
        fontSize={0.6}
        color="black"
        anchorY="bottom"
      >
        {name}
      </Text>

      {/* Room ID label below name */}
      <Text
        position={[0, height / 2 + 0.1, 0]}
        fontSize={0.35}
        color="#666"
        anchorY="bottom"
      >
        ({roomId})
      </Text>
    </group>
  );
};

/**
 * Navigation Path component - renders a line showing the path to destination
 */
interface NavigationPathProps {
  pathPoints: [number, number, number][];
}

const NavigationPath: React.FC<NavigationPathProps> = ({ pathPoints }) => {
  const geometryRef = useRef<THREE.BufferGeometry>(null);

  useEffect(() => {
    if (!geometryRef.current || pathPoints.length < 2) {
      return;
    }

    const points: THREE.Vector3[] = pathPoints.map(([x, y, z]) => new THREE.Vector3(x, y, z));
    const positions = new Float32Array(points.flatMap((p) => [p.x, p.y, p.z]));

    geometryRef.current.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  }, [pathPoints]);

  if (pathPoints.length < 2) {
    return null;
  }

  return (
    <line>
      <bufferGeometry ref={geometryRef} />
      <lineBasicMaterial color="#FFD700" linewidth={5} />
    </line>
  );
};

/**
 * Lights component - ambient and directional lighting
 */
const Lights: React.FC = () => {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.6} />

      {/* Directional light for shadows and contrast */}
      <directionalLight
        position={[10, 15, 10]}
        intensity={0.8}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />
    </>
  );
};

/**
 * Scene Content - contains all 3D objects
 */
interface SceneContentProps {
  destination?: string;
  currentRoom?: string;
}

const SceneContent: React.FC<SceneContentProps> = ({ destination, currentRoom = 'entrance' }) => {
  const pathPointsRef = useRef<[number, number, number][]>([]);

  // Calculate path whenever destination changes
  useEffect(() => {
    if (!destination || destination === currentRoom) {
      pathPointsRef.current = [];
      return;
    }

    const roomPath = findPath(currentRoom, destination);
    const coordPath = pathTo3DCoordinates(roomPath);
    pathPointsRef.current = coordPath;
  }, [destination, currentRoom]);

  return (
    <>
      <Lights />
      <Floor />

      {/* Render all rooms */}
      {getAvailableRooms().map((room) => (
        <Room
          key={room.id}
          roomId={room.id}
          name={room.name}
          position={room.position}
          size={room.size}
          color={room.color}
          isDestination={room.id === destination}
        />
      ))}

      {/* Render navigation path */}
      <NavigationPath pathPoints={pathPointsRef.current} />

      {/* Orbit controls for camera */}
      <OrbitControls
        makeDefault
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        autoRotate={false}
      />
    </>
  );
};

/**
 * Main Navigation3D Component
 */
export const Navigation3D: React.FC<Navigation3DProps> = ({
  destination,
  currentRoom = 'entrance',
}) => {
  return (
    <ErrorBoundary>
      <div style={{ width: '100%', height: '100%' }}>
        <Canvas
          camera={{
            position: [10, 12, 15],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <SceneContent destination={destination} currentRoom={currentRoom} />
        </Canvas>
      </div>
    </ErrorBoundary>
  );
};

export default Navigation3D;

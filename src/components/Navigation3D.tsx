/**
 * 3D Navigation Scene Component
 * Displays an interactive 3D floor plan with room navigation
 */

import { useEffect, useRef, ReactNode, useState } from 'react';
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Line } from '@react-three/drei';
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
  const floorRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    if (floorRef.current) {
      floorRef.current.receiveShadow = true;
    }
  }, []);

  return (
    <mesh ref={floorRef} position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[20, 14]} />
      <meshStandardMaterial
        color="#E8E8E8"
        side={THREE.DoubleSide}
        roughness={0.8}
        metalness={0}
      />
    </mesh>
  );
};

/**
 * Staircase component - renders visible stairs
 */
const Staircase: React.FC = () => {
  const stepCount = 8;
  const stepHeight = 0.25;
  const stepDepth = 0.25;

  return (
    <group position={[0, 0, 1.5]}>
      {/* Staircase structure */}
      {Array.from({ length: stepCount }).map((_, i) => (
        <mesh
          key={`step-${i}`}
          position={[0, stepHeight * (i + 0.5), stepDepth * (i - stepCount / 2)]}
          castShadow
          receiveShadow
        >
          <boxGeometry args={[2, stepHeight, stepDepth]} />
          <meshStandardMaterial
            color="#888888"
            roughness={0.6}
            metalness={0.3}
          />
        </mesh>
      ))}

      {/* Staircase label */}
      <Text position={[0, 1.5, 0]} fontSize={0.5} color="black" anchorY="middle">
        Stairs
      </Text>
    </group>
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
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (meshRef.current) {
      meshRef.current.castShadow = true;
      meshRef.current.receiveShadow = true;
    }
  }, []);

  return (
    <group position={[x, y, z]}>
      {/* Room box */}
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          emissive={isDestination ? new THREE.Color('#00FF00').multiplyScalar(0.3) : hovered ? new THREE.Color(color).multiplyScalar(0.3) : '#000000'}
          emissiveIntensity={isDestination ? 0.8 : hovered ? 0.5 : 0}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Room label */}
      <Text
        position={[0, height / 2 + 0.5, 0]}
        fontSize={0.6}
        color="black"
        anchorY="bottom"
        maxWidth={width}
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

      {/* Destination indicator - green highlight */}
      {isDestination && (
        <mesh position={[0, height / 2 + 0.02, 0]}>
          <boxGeometry args={[width + 0.3, 0.05, depth + 0.3]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={0.6}
          />
        </mesh>
      )}
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
  if (pathPoints.length < 2) {
    return null;
  }

  return (
    <Line
      points={pathPoints}
      color="#FF0000"
      lineWidth={4}
      dashed={false}
    />
  );
};

/**
 * Lights component - ambient and directional lighting
 */
const Lights: React.FC = () => {
  return (
    <>
      {/* Ambient light for overall illumination */}
      <ambientLight intensity={0.75} />

      {/* Directional light for shadows and contrast */}
      <directionalLight
        position={[8, 12, 8]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
        shadow-camera-far={50}
      />

      {/* Fill light for better room visibility */}
      <pointLight position={[-8, 10, -8]} intensity={0.5} />
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

      {/* Render Staircase */}
      <Staircase />

      {/* Render all rooms */}
      {getAvailableRooms().map((room) => {
        // Skip stairs - rendered separately with Staircase component
        if (room.id === 'stairs') {
          return null;
        }
        return (
          <Room
            key={room.id}
            roomId={room.id}
            name={room.name}
            position={room.position}
            size={room.size}
            color={room.color}
            isDestination={room.id === destination}
          />
        );
      })}

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
            position: [8, 10, 8],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          shadows="basic"
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

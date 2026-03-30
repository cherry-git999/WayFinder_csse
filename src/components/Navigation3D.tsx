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
    <mesh ref={floorRef} position={[0, -0.1, 1.75]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[22, 16]} />
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
    <group position={[-4.5, 0, -1.5]}>
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
 * Entrance component - renders realistic entrance with doors
 */
const Entrance: React.FC<{ isDestination?: boolean }> = ({ isDestination }) => {
  const doorWidth = 0.6;
  const doorHeight = 2;

  return (
    <group position={[0, 0, 5]}>
      {/* Entrance frame */}
      <mesh position={[0, doorHeight / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, doorHeight + 0.3, 0.2]} />
        <meshStandardMaterial
          color="#8B4513"
          roughness={0.5}
          metalness={0.4}
          emissive={isDestination ? new THREE.Color('#00FF00').multiplyScalar(0.2) : '#000000'}
          emissiveIntensity={isDestination ? 0.6 : 0}
        />
      </mesh>

      {/* Left door */}
      <mesh position={[-doorWidth / 2, doorHeight / 2, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
        <meshStandardMaterial
          color="#4A4A4A"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Right door */}
      <mesh position={[doorWidth / 2, doorHeight / 2, 0.1]} castShadow receiveShadow>
        <boxGeometry args={[doorWidth, doorHeight, 0.05]} />
        <meshStandardMaterial
          color="#4A4A4A"
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>

      {/* Door handles - left */}
      <mesh position={[-doorWidth / 2 - 0.08, doorHeight / 2, 0.15]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>

      {/* Door handles - right */}
      <mesh position={[doorWidth / 2 + 0.08, doorHeight / 2, 0.15]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.02, 16]} />
        <meshStandardMaterial color="#FFD700" metalness={1} roughness={0.1} />
      </mesh>

      {/* Threshold/step */}
      <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.5, 0.1, 0.3]} />
        <meshStandardMaterial
          color="#696969"
          roughness={0.7}
          metalness={0}
        />
      </mesh>

      {/* Entrance label */}
      <Text position={[0, doorHeight + 0.6, 0]} fontSize={0.5} color="black" anchorY="bottom">
        Entrance
      </Text>

      {/* Green indicator for destination */}
      {isDestination && (
        <mesh position={[0, 0.02, -0.15]}>
          <boxGeometry args={[2.7, 0.04, 0.5]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={0.7}
          />
        </mesh>
      )}
    </group>
  );
};

/**
 * Lift (Elevator) component - renders modern lift/elevator
 */
const Lift: React.FC<{ isDestination?: boolean }> = ({ isDestination }) => {
  return (
    <group position={[4.5, 0, -1.5]}>
      {/* Lift cabin outer frame */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.8, 2, 1.8]} />
        <meshStandardMaterial
          color="#C0C0C0"
          roughness={0.3}
          metalness={0.8}
          emissive={isDestination ? new THREE.Color('#00FF00').multiplyScalar(0.2) : '#000000'}
          emissiveIntensity={isDestination ? 0.6 : 0}
        />
      </mesh>

      {/* Lift doors - left */}
      <mesh position={[-0.45, 0.8, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.6, 0.05]} />
        <meshStandardMaterial
          color="#404040"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Lift doors - right */}
      <mesh position={[0.45, 0.8, 0.05]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 1.6, 0.05]} />
        <meshStandardMaterial
          color="#404040"
          roughness={0.2}
          metalness={0.9}
        />
      </mesh>

      {/* Button panel */}
      <mesh position={[-0.85, 0.8, 0]} castShadow>
        <boxGeometry args={[0.2, 0.6, 0.15]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.6} />
      </mesh>

      {/* Lift buttons */}
      {[0, -0.2, -0.4].map((y, i) => (
        <mesh key={`button-${i}`} position={[-0.8, 1 + y, 0.05]} castShadow>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial
            color="#FFD700"
            metalness={1}
            roughness={0.1}
          />
        </mesh>
      ))}

      {/* Lift label */}
      <Text position={[0, 1.3, 0]} fontSize={0.4} color="white" anchorY="middle">
        Lift
      </Text>

      {/* Green indicator for destination */}
      {isDestination && (
        <mesh position={[0, 0.02, -1]}>
          <boxGeometry args={[2, 0.04, 0.4]} />
          <meshStandardMaterial
            color="#00FF00"
            emissive="#00FF00"
            emissiveIntensity={0.7}
          />
        </mesh>
      )}
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

      {/* Render Entrance */}
      <Entrance isDestination={destination === 'entrance'} />

      {/* Render Staircase */}
      <Staircase />

      {/* Render Lift */}
      <Lift isDestination={destination === 'lift'} />

      {/* Render all rooms */}
      {getAvailableRooms().map((room) => {
        // Skip entrance, stairs, and lift - rendered separately with special components
        if (room.id === 'entrance' || room.id === 'stairs' || room.id === 'lift') {
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

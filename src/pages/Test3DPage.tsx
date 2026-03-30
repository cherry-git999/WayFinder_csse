import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

const SimpleBox = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#FF6B6B" />
    </mesh>
  );
};

export const Test3DPage = () => {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ flex: '0 0 auto', padding: '10px', backgroundColor: '#222', color: '#fff' }}>
        <h3 style={{ margin: '0 0 5px 0' }}>🔴 3D Test Page</h3>
        <p style={{ margin: '0', fontSize: '12px' }}>You should see a red box below</p>
      </div>
      <div style={{ flex: '1 1 0', position: 'relative', overflow: 'hidden' }}>
        <Canvas camera={{ position: [2, 2, 2], fov: 50 }}>
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <SimpleBox />
          <OrbitControls makeDefault />
        </Canvas>
      </div>
    </div>
  );
};

export default Test3DPage;

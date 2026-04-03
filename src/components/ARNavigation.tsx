/**
 * AR Navigation Component
 * Uses WebXR to display floor-anchored navigation arrows
 */

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { requestARSession } from '../utils/webXRUtils';
import {
  createArrowPath,
  createArrowLighting,
  createFloorPlane,
  updateArrowGlow,
} from '../utils/arrowGeometries';

interface ARNavigationProps {
  directions?: ('forward' | 'left' | 'right')[];
  onClose?: () => void;
  enabled?: boolean;
}

export const ARNavigation: React.FC<ARNavigationProps> = ({
  directions = ['forward', 'forward', 'left', 'forward', 'right', 'forward'],
  onClose,
  enabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sessionRef = useRef<XRSession | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const arrowGroupRef = useRef<THREE.Group | null>(null);
  const [isARReady, setIsARReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize AR session and Three.js scene
  useEffect(() => {
    if (!enabled) return;

    const initializeAR = async () => {
      try {
        // Check WebXR support
        const supported = await navigator.xr?.isSessionSupported('immersive-ar');
        if (!supported) {
          setError(
            'WebXR AR is not supported on this device. Use an AR-capable phone (iPhone 12+ or Android with ARCore).'
          );
          return;
        }

        // Request AR session
        const session = await requestARSession();
        if (!session) {
          setError('Failed to start AR session. Please try again.');
          return;
        }

        sessionRef.current = session;
        console.log('AR Session acquired:', session);

        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.setAttribute('style', 'display: block; width: 100%; height: 100%;');
        containerRef.current?.appendChild(canvas);
        canvasRef.current = canvas;

        // Initialize WebGL context (this must be done with XR device)
        const gl = canvas.getContext('webgl2', { xrCompatible: true }) as any;
        if (!gl) {
          setError('Failed to create WebGL context');
          return;
        }

        // Make the canvas fill the screen
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Create WebGL renderer with existing context
        const renderer = new THREE.WebGLRenderer({
          canvas: canvas,
          context: gl,
          antialias: true,
          alpha: true,
        } as any);
        
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        
        // Enable XR rendering
        (renderer.xr as any).enabled = true;
        (renderer.xr as any).setSession(session);
        rendererRef.current = renderer;

        console.log('Renderer initialized');

        // Create scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        sceneRef.current = scene;

        // Add lighting
        createArrowLighting(scene);

        // Create arrow path
        const arrowGroup = createArrowPath(directions);
        arrowGroup.position.z = -1.5; // 1.5 meters ahead
        arrowGroup.position.y = -0.2; // Slightly below eye level
        arrowGroup.position.x = 0;
        scene.add(arrowGroup);
        arrowGroupRef.current = arrowGroup;

        // Add floor reference (semi-transparent)
        const floor = createFloorPlane();
        floor.position.y = -0.5; // Below the arrows
        scene.add(floor);

        console.log('Scene objects created');

        // Get reference space for floor-relative positioning
        let referenceSpace;
        try {
          referenceSpace = await (session as any).requestReferenceSpace('local-floor');
        } catch {
          referenceSpace = await (session as any).requestReferenceSpace('local');
        }

        // Create a default camera
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 0;

        // Animation loop
        const renderFrame = (time: number, frame: XRFrame) => {
          try {
            const session = frame.session;
            const baseLayer = session.renderState.baseLayer as any;
            
            if (!baseLayer) {
              console.warn('No base layer available');
              return;
            }

            const pose = frame.getViewerPose(referenceSpace);

            if (pose && pose.views && pose.views.length > 0) {
              // Update arrow glow animation
              if (arrowGroupRef.current) {
                updateArrowGlow(arrowGroupRef.current, time / 1000);
              }

              // Simple render for all views
              const view = pose.views[0];
              camera.projectionMatrix.fromArray(view.projectionMatrix);
              
              // Apply view pose to camera
              const viewMatrix = new THREE.Matrix4().fromArray(
                view.transform.inverse.matrix
              );
              camera.matrix.copy(viewMatrix);
              camera.matrix.decompose(
                camera.position,
                camera.quaternion,
                camera.scale
              );

              // Render the scene
              renderer.render(scene, camera);
            }
          } catch (err) {
            console.error('Render frame error:', err);
          }
        };

        console.log('Setting animation loop');
        (renderer.xr as any).setAnimationLoop(renderFrame);
        setIsARReady(true);
      } catch (err: any) {
        console.error('AR initialization error:', err);
        setError(`AR Error: ${err.message || err}`);
      }
    };

    initializeAR();

    return () => {
      // Cleanup
      if (sessionRef.current) {
        sessionRef.current.end().catch((err) => {
          console.log('AR session ended:', err);
        });
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, [enabled, directions]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">AR Not Available</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
          >
            Back to Navigation
          </button>
        </div>
      </div>
    );
  }

  if (!isARReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="mb-4">
            <div className="animate-spin w-12 h-12 mx-auto">
              <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full" />
            </div>
          </div>
          <p className="text-lg">Initializing AR...</p>
          <p className="text-sm text-gray-400 mt-2">
            Allow camera access when prompted
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-screen overflow-hidden bg-black"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg font-semibold backdrop-blur-sm transition-all"
      >
        ← Exit AR
      </button>

      {/* AR Status */}
      <div className="absolute bottom-4 left-4 z-10 px-4 py-2 bg-green-500/20 border-2 border-green-400 rounded-lg text-green-300 font-semibold backdrop-blur-sm">
        ✓ AR Active - Look at the floor
      </div>
    </div>
  );
};

/**
 * AR Navigation Component
 * Displays camera feed with animated arrow overlay for navigation
 * No WebXR - uses getUserMedia for real camera feed
 */

import { useEffect, useRef, useState } from 'react';
import { ArrowDirection } from '../utils/arrowUtils';

interface ARNavigationProps {
  directions?: ArrowDirection[];
  onClose?: () => void;
  enabled?: boolean;
}

interface AnimatedArrow {
  id: string;
  direction: ArrowDirection;
  depth: number; // 0 (bottom) to 1 (top)
  createdAt: number;
}

export const ARNavigation: React.FC<ARNavigationProps> = ({
  directions = ['forward', 'forward', 'left', 'forward', 'right', 'forward'],
  onClose,
  enabled = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const arrowsRef = useRef<AnimatedArrow[]>([]);
  const directionIndexRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const nextArrowTimeRef = useRef<number>(0);
  
  const [isARReady, setIsARReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize camera and overlay
  useEffect(() => {
    if (!enabled) return;

    const initializeCamera = async () => {
      try {
        // Request camera access
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment', // Rear camera
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
        });

        streamRef.current = stream;

        // Create video element
        const video = document.createElement('video');
        video.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          z-index: 10;
        `;
        video.setAttribute('playsinline', 'true');
        video.setAttribute('autoplay', 'true');
        video.setAttribute('muted', 'true');
        video.srcObject = stream;

        await new Promise<void>((resolve, reject) => {
          video.onloadedmetadata = () => {
            video.play().then(resolve).catch(reject);
          };
          video.onerror = () => reject(new Error('Video error'));
          setTimeout(() => reject(new Error('Video timeout')), 5000);
        });

        videoRef.current = video;
        containerRef.current?.appendChild(video);

        // Create canvas overlay
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 20;
        `;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        canvasRef.current = canvas;
        containerRef.current?.appendChild(canvas);

        setIsARReady(true);
        console.log('Camera and overlay initialized successfully');
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.error('Camera initialization error:', errorMsg);
        setError(
          `Failed to access camera: ${errorMsg}. Please grant camera permissions.`
        );
      }
    };

    initializeCamera();

    return () => {
      // Cleanup
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [enabled]);

  // Arrow animation and rendering
  useEffect(() => {
    if (!isARReady || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    directionIndexRef.current = 0;
    arrowsRef.current = [];
    nextArrowTimeRef.current = Date.now();

    const ARROW_SPEED = 1.5; // pixels per frame
    const ARROW_SPAWN_INTERVAL = 300; // ms between arrows
    const GLOW_COLOR = '#00ff41'; // Neon green
    const GLOW_COLOR_TURN = '#00e5ff'; // Neon cyan

    const drawArrow = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      direction: ArrowDirection,
      scale: number,
      opacity: number
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const arrowSize = 40;
      const color = direction === 'forward' ? GLOW_COLOR : GLOW_COLOR_TURN;

      // Draw glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = 15;
      ctx.fillStyle = color;
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;

      switch (direction) {
        case 'forward':
          // Upward arrow
          ctx.beginPath();
          ctx.moveTo(0, -arrowSize);
          ctx.lineTo(-arrowSize * 0.4, arrowSize * 0.2);
          ctx.lineTo(-arrowSize * 0.15, arrowSize * 0.2);
          ctx.lineTo(-arrowSize * 0.15, arrowSize * 0.7);
          ctx.lineTo(arrowSize * 0.15, arrowSize * 0.7);
          ctx.lineTo(arrowSize * 0.15, arrowSize * 0.2);
          ctx.lineTo(arrowSize * 0.4, arrowSize * 0.2);
          ctx.closePath();
          break;

        case 'left':
          // Left arrow
          ctx.beginPath();
          ctx.moveTo(-arrowSize, 0);
          ctx.lineTo(arrowSize * 0.2, -arrowSize * 0.4);
          ctx.lineTo(arrowSize * 0.2, -arrowSize * 0.15);
          ctx.lineTo(arrowSize * 0.7, -arrowSize * 0.15);
          ctx.lineTo(arrowSize * 0.7, arrowSize * 0.15);
          ctx.lineTo(arrowSize * 0.2, arrowSize * 0.15);
          ctx.lineTo(arrowSize * 0.2, arrowSize * 0.4);
          ctx.closePath();
          break;

        case 'right':
          // Right arrow
          ctx.beginPath();
          ctx.moveTo(arrowSize, 0);
          ctx.lineTo(-arrowSize * 0.2, -arrowSize * 0.4);
          ctx.lineTo(-arrowSize * 0.2, -arrowSize * 0.15);
          ctx.lineTo(-arrowSize * 0.7, -arrowSize * 0.15);
          ctx.lineTo(-arrowSize * 0.7, arrowSize * 0.15);
          ctx.lineTo(-arrowSize * 0.2, arrowSize * 0.15);
          ctx.lineTo(-arrowSize * 0.2, arrowSize * 0.4);
          ctx.closePath();
          break;
      }

      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const animate = (timestamp: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new arrow if interval elapsed
      const now = Date.now();
      if (now - nextArrowTimeRef.current > ARROW_SPAWN_INTERVAL) {
        const dir = directions[directionIndexRef.current % directions.length];
        const arrowId = `arrow-${timestamp}`;
        arrowsRef.current.push({
          id: arrowId,
          direction: dir,
          depth: -0.5, // Start above top
          createdAt: timestamp,
        });
        directionIndexRef.current++;
        nextArrowTimeRef.current = now;
      }

      // Update and draw arrows
      const centerX = canvas.width / 2;
      const arrowsToRemove: string[] = [];

      arrowsRef.current.forEach((arrow) => {
        // Move arrow downward
        arrow.depth += ARROW_SPEED / canvas.height;

        // Calculate perspective effect
        const screenDepth = arrow.depth;
        const perspective = 0.3 + (1 - Math.max(0, screenDepth) ** 2) * 0.7;
        const opacity = Math.max(0, 0.4 + (1 - Math.max(0, screenDepth)) * 0.6);

        // Calculate screen position
        const screenY = canvas.height * (0.5 + screenDepth * 0.4);
        const scale = perspective;

        if (screenY > canvas.height + 100) {
          arrowsToRemove.push(arrow.id);
          return;
        }

        drawArrow(ctx, centerX, screenY, arrow.direction, scale, opacity);
      });

      // Remove off-screen arrows
      arrowsRef.current = arrowsRef.current.filter(
        (a) => !arrowsToRemove.includes(a.id)
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    // Handle window resize
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [isARReady, directions]);

  if (error) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">Camera Access Required</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-all"
          >
            Back
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
          <p className="text-lg">Starting camera...</p>
          <p className="text-sm text-gray-400 mt-2">
            Grant camera access when prompted
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
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-30 px-4 py-2 bg-black/50 hover:bg-black/70 text-white rounded-lg font-semibold backdrop-blur-sm transition-all"
      >
        ← Exit
      </button>

      {/* AR Status */}
      <div className="absolute bottom-4 left-4 z-30 px-4 py-2 bg-green-500/20 border-2 border-green-400 rounded-lg text-green-300 font-semibold backdrop-blur-sm">
        ✓ Navigation Active
      </div>
    </div>
  );
};

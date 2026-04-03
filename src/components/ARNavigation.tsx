/**
 * AR Navigation Component - Lightweight Arrow Overlay System
 * Features:
 * - Real camera feed (getUserMedia)
 * - Smooth arrow overlay on top
 * - Perspective-based depth scaling
 * - Direction support (forward, left, right)
 * - No WebXR or Three.js dependencies
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
  const lastDirectionRef = useRef<ArrowDirection>('forward');

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

    // Configuration
    const ARROW_SPEED = 1.8; // pixels per frame (smooth movement)
    const ARROW_SPAWN_INTERVAL = 280; // ms between arrows
    const FORWARD_COLOR = '#00ff41'; // Neon green
    const TURN_COLOR = '#00e5ff'; // Neon cyan
    const MIN_GLOW = 8;
    const MAX_GLOW = 25;

    /**
     * Draw a thick chevron arrow with glow effect
     */
    const drawChevronArrow = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      direction: ArrowDirection,
      scale: number,
      opacity: number,
      blur: number
    ) => {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(x, y);
      ctx.scale(scale, scale);

      const baseSize = 50; // Base arrow size
      const thickness = 8; // Thickness of the chevron lines
      const isTurn = direction !== 'forward';
      const color = isTurn ? TURN_COLOR : FORWARD_COLOR;

      // Set drawing properties
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
      ctx.lineWidth = thickness;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Apply glow effect
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Rotation for turn directions
      let rotation = 0;
      if (direction === 'left') rotation = Math.PI / 2;
      if (direction === 'right') rotation = -Math.PI / 2;

      if (rotation !== 0) {
        ctx.translate(0, 0);
        ctx.rotate(rotation);
      }

      // Draw thick chevron arrow pointing UP
      ctx.beginPath();

      // Left line of chevron
      ctx.moveTo(-baseSize * 0.35, baseSize * 0.3);
      ctx.lineTo(0, baseSize * 0.55);

      // Right line of chevron
      ctx.lineTo(baseSize * 0.35, baseSize * 0.3);

      ctx.stroke();

      // Optional: Add a subtle fill for extra glow effect
      ctx.globalAlpha = opacity * 0.15;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.moveTo(-baseSize * 0.35, baseSize * 0.3);
      ctx.lineTo(0, baseSize * 0.55);
      ctx.lineTo(baseSize * 0.35, baseSize * 0.3);
      ctx.quadraticCurveTo(0, baseSize * 0.2, -baseSize * 0.35, baseSize * 0.3);
      ctx.fill();

      ctx.restore();
    };

    /**
     * Animation loop - render and update arrows
     */
    const animate = () => {
      // Clear canvas for next frame
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new arrow if spawn interval elapsed
      const now = Date.now();
      if (now - nextArrowTimeRef.current > ARROW_SPAWN_INTERVAL) {
        const dir = directions[directionIndexRef.current % directions.length];
        lastDirectionRef.current = dir;
        arrowsRef.current.push({
          id: `arrow-${now}-${directionIndexRef.current}`,
          direction: dir,
          depth: -0.4, // Start above top
          createdAt: now,
        });
        directionIndexRef.current++;
        nextArrowTimeRef.current = now;
      }

      // Update and draw arrows
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const arrowsToRemove: string[] = [];

      arrowsRef.current.forEach((arrow) => {
        // Move arrow downward continuously
        arrow.depth += ARROW_SPEED / (canvas.height * 0.25);

        // Calculate perspective effect - arrows scale up as they approach bottom
        const normalizedDepth = Math.max(0, Math.min(1, arrow.depth)); // Clamp 0-1
        const perspectiveScale = 0.45 + normalizedDepth * 0.8; // Scale from 0.45 to 1.25

        // Opacity decreases for far (top) arrows
        const opacity = Math.max(0, Math.min(1, 0.35 + normalizedDepth * 0.75));

        // Calculate blur - top arrows more blurred
        const glowBlur = MIN_GLOW + (1 - normalizedDepth) * (MAX_GLOW - MIN_GLOW);

        // Calculate screen Y position (bottom = close, top = far)
        const screenY = centerY + (normalizedDepth - 0.5) * canvas.height * 0.55;

        // Remove arrows that have scrolled past bottom
        if (screenY > canvas.height + 200) {
          arrowsToRemove.push(arrow.id);
          return;
        }

        // Draw the arrow
        drawChevronArrow(
          ctx,
          centerX,
          screenY,
          arrow.direction,
          perspectiveScale,
          opacity,
          glowBlur
        );
      });

      // Remove off-screen arrows
      arrowsRef.current = arrowsRef.current.filter(
        (a) => !arrowsToRemove.includes(a.id)
      );

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation
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
      {/* Instruction Label - Top Center */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-30 px-6 py-2 rounded-full bg-black/40 backdrop-blur-md border border-cyan-400/30 text-cyan-300 font-semibold text-sm">
        📱 Point camera at the floor
      </div>

      {/* AR Status - Bottom Left */}
      <div className="absolute bottom-6 left-6 z-30 px-4 py-3 bg-green-500/20 border-2 border-green-400 rounded-lg text-green-300 font-semibold backdrop-blur-sm flex items-center space-x-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span>⚡ AR Navigation Active</span>
      </div>

      {/* Exit Button - Top Left */}
      <button
        onClick={onClose}
        className="absolute top-6 left-6 z-30 px-4 py-2 bg-black/60 hover:bg-black/80 text-white rounded-lg font-semibold backdrop-blur-sm transition-all border border-gray-600/50"
      >
        ← Exit
      </button>

      {/* Arrow sequence indicator - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-30 px-4 py-2 bg-black/40 backdrop-blur-md border border-gray-600/30 rounded-lg text-gray-300 text-xs font-mono">
        {lastDirectionRef.current === 'forward' && '◀ Continue Forward'}
        {lastDirectionRef.current === 'left' && '◀ Turn Left'}
        {lastDirectionRef.current === 'right' && '▶ Turn Right'}
      </div>
    </div>
  );
};

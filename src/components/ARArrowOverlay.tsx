/**
 * AR Arrow Overlay Component
 * Renders animated directional arrows on top of camera feed
 * Creates pseudo-AR effect with perspective scaling
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  ARArrow,
  ArrowDirection,
  createArrow,
  generateDirectionSequence,
  getPerspectiveOpacity,
  getPerspectiveScale,
  getArrowScreenPosition,
  shouldRemoveArrow,
  updateArrowDepth,
} from '../utils/arrowUtils';

interface ARArrowOverlayProps {
  isActive: boolean;
  pathNodes?: number; // Number of navigation nodes, defaults to 10
  animationSpeed?: number; // pixels per frame, default 2
  perspectiveIntensity?: number; // 0-2, default 1
}

export const ARArrowOverlay: React.FC<ARArrowOverlayProps> = ({
  isActive,
  pathNodes = 10,
  animationSpeed = 2,
  perspectiveIntensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const arrowsRef = useRef<ARArrow[]>([]);
  const directionSequenceRef = useRef<ArrowDirection[]>([]);
  const nextDirectionIndexRef = useRef(0);
  const animationFrameRef = useRef<number>();
  const lastUpdateRef = useRef<number>(Date.now());
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize direction sequence
  useEffect(() => {
    directionSequenceRef.current = generateDirectionSequence(pathNodes);
    nextDirectionIndexRef.current = 0;
    arrowsRef.current = [];
  }, [pathNodes]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get next direction in sequence
  const getNextDirection = useCallback((): ArrowDirection => {
    const dir =
      directionSequenceRef.current[
        nextDirectionIndexRef.current % directionSequenceRef.current.length
      ];
    nextDirectionIndexRef.current++;
    return dir;
  }, []);

  // Add new arrow at top
  const addNewArrow = useCallback(() => {
    if (arrowsRef.current.length < 8) {
      const direction = getNextDirection();
      const newArrow = createArrow(
        `arrow-${Date.now()}-${Math.random()}`,
        direction,
        -0.15, // Start slightly before the top (for fade-in)
        Math.random() * 0.3 - 0.15 // Slight horizontal offset
      );
      arrowsRef.current.push(newArrow);
    }
  }, [getNextDirection]);

  // Draw arrows on canvas
  const drawArrows = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate time-based horizontal sway for bonus effect
    const currentTime = Date.now() / 1000;
    const swayAmount = Math.sin(currentTime * 0.8) * 20; // ±20px sway

    // Draw each arrow
    arrowsRef.current.forEach((arrow, index) => {
      const scale = getPerspectiveScale(arrow.depth, perspectiveIntensity);
      const opacity = getPerspectiveOpacity(arrow.depth);
      const pos = getArrowScreenPosition(arrow, canvas.height, 8);

      let x = pos.x * canvas.width + swayAmount;
      const y = pos.y;

      // Clamp x to screen bounds with generous margins
      const arrowSize = 50 * scale;
      const minX = arrowSize * 1.5;
      const maxX = canvas.width - arrowSize * 1.5;
      x = Math.max(minX, Math.min(maxX, x));

      // Calculate pulsing effect based on depth
      const pulsePhase = currentTime * 3 + index * 0.5;
      const pulseAmount = Math.sin(pulsePhase) * 0.15;
      const animatedOpacity = opacity * (0.85 + pulseAmount);

      // Save context
      ctx.save();

      // Apply opacity with pulsing
      ctx.globalAlpha = Math.max(0.35, animatedOpacity);

      // Enhanced glow effect - more intense
      const glowColor = getArrowGlowColor(arrow.direction);
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 25 * scale + pulseAmount * 15; // Bigger, pulsing glow
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Draw arrow shape using smooth geometry
      drawArrowGeometry(ctx, arrow.direction, x, y, scale);

      ctx.restore();
    });
  }, [perspectiveIntensity]);

  // Animate arrows
  const animate = useCallback(() => {
    const now = Date.now();
    const deltaTime = (now - lastUpdateRef.current) / 16; // Normalize to 60fps
    lastUpdateRef.current = now;

    if (!isActive) {
      animationFrameRef.current = requestAnimationFrame(animate);
      return;
    }

    // Update arrow positions
    arrowsRef.current = arrowsRef.current
      .map((arrow) => updateArrowDepth(arrow, animationSpeed * deltaTime * 0.001))
      .filter((arrow) => !shouldRemoveArrow(arrow.depth));

    // Add new arrow periodically
    if (
      arrowsRef.current.length < 7 &&
      (arrowsRef.current.length === 0 ||
        arrowsRef.current[arrowsRef.current.length - 1].depth > 0.15)
    ) {
      addNewArrow();
    }

    // Draw arrows
    drawArrows();

    animationFrameRef.current = requestAnimationFrame(animate);
  }, [isActive, animationSpeed, addNewArrow, drawArrows]);

  // Start animation loop
  useEffect(() => {
    if (isActive && dimensions.width > 0) {
      // Initialize arrows - start with 4 for demo
      for (let i = 0; i < 4; i++) {
        addNewArrow();
      }

      lastUpdateRef.current = Date.now();
      animationFrameRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      };
    }
  }, [isActive, dimensions, animate, addNewArrow]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl"
      style={{ background: 'transparent' }}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 w-full h-full"
        style={{ display: isActive ? 'block' : 'none' }}
      />
    </div>
  );
};

/**
 * Draw arrow geometry using canvas primitives
 * Creates wavy/curved arrows like in reference images
 */
function drawArrowGeometry(
  ctx: CanvasRenderingContext2D,
  direction: 'forward' | 'left' | 'right',
  x: number,
  y: number,
  scale: number
): void {
  const arrowSize = 50 * scale;
  const color = getArrowColor(direction);

  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3 * scale;
  ctx.lineJoin = 'round';
  ctx.lineCap = 'round';

  // Draw smooth wavy arrow using Bezier curves
  ctx.beginPath();

  switch (direction) {
    case 'forward':
      // Large smooth upward-pointing arrow with curves
      // Main point at top
      ctx.moveTo(x, y - arrowSize * 1.2);
      
      // Left side - smooth curve
      ctx.bezierCurveTo(
        x - arrowSize * 0.6, y - arrowSize * 0.8,
        x - arrowSize * 0.8, y - arrowSize * 0.3,
        x - arrowSize * 0.4, y + arrowSize * 0.2
      );
      
      // Left inner edge
      ctx.lineTo(x - arrowSize * 0.15, y + arrowSize * 0.2);
      
      // Bottom-left inner
      ctx.bezierCurveTo(
        x - arrowSize * 0.15, y + arrowSize * 0.4,
        x - arrowSize * 0.15, y + arrowSize * 0.6,
        x - arrowSize * 0.15, y + arrowSize * 0.8
      );
      
      // Bottom right inner
      ctx.lineTo(x + arrowSize * 0.15, y + arrowSize * 0.8);
      
      // Right inner upper
      ctx.bezierCurveTo(
        x + arrowSize * 0.15, y + arrowSize * 0.6,
        x + arrowSize * 0.15, y + arrowSize * 0.4,
        x + arrowSize * 0.15, y + arrowSize * 0.2
      );
      
      // Right outer edge
      ctx.lineTo(x + arrowSize * 0.4, y + arrowSize * 0.2);
      
      // Right side - smooth curve
      ctx.bezierCurveTo(
        x + arrowSize * 0.8, y - arrowSize * 0.3,
        x + arrowSize * 0.6, y - arrowSize * 0.8,
        x, y - arrowSize * 1.2
      );
      break;

    case 'left':
      // Left turn arrow with smooth curves
      ctx.moveTo(x - arrowSize * 1.2, y);
      
      // Top curve
      ctx.bezierCurveTo(
        x - arrowSize * 0.8, y - arrowSize * 0.6,
        x - arrowSize * 0.3, y - arrowSize * 0.8,
        x + arrowSize * 0.2, y - arrowSize * 0.4
      );
      
      // Right top inner
      ctx.lineTo(x + arrowSize * 0.2, y - arrowSize * 0.15);
      
      // Right edge inner
      ctx.bezierCurveTo(
        x + arrowSize * 0.4, y - arrowSize * 0.15,
        x + arrowSize * 0.6, y - arrowSize * 0.15,
        x + arrowSize * 0.8, y - arrowSize * 0.15
      );
      
      // Right bottom inner
      ctx.lineTo(x + arrowSize * 0.8, y + arrowSize * 0.15);
      
      // Right edge inner lower
      ctx.bezierCurveTo(
        x + arrowSize * 0.6, y + arrowSize * 0.15,
        x + arrowSize * 0.4, y + arrowSize * 0.15,
        x + arrowSize * 0.2, y + arrowSize * 0.15
      );
      
      // Right lower outer
      ctx.lineTo(x + arrowSize * 0.2, y + arrowSize * 0.4);
      
      // Bottom curve
      ctx.bezierCurveTo(
        x - arrowSize * 0.3, y + arrowSize * 0.8,
        x - arrowSize * 0.8, y + arrowSize * 0.6,
        x - arrowSize * 1.2, y
      );
      break;

    case 'right':
      // Right turn arrow with smooth curves
      ctx.moveTo(x + arrowSize * 1.2, y);
      
      // Top curve
      ctx.bezierCurveTo(
        x + arrowSize * 0.8, y - arrowSize * 0.6,
        x + arrowSize * 0.3, y - arrowSize * 0.8,
        x - arrowSize * 0.2, y - arrowSize * 0.4
      );
      
      // Left top inner
      ctx.lineTo(x - arrowSize * 0.2, y - arrowSize * 0.15);
      
      // Left edge inner
      ctx.bezierCurveTo(
        x - arrowSize * 0.4, y - arrowSize * 0.15,
        x - arrowSize * 0.6, y - arrowSize * 0.15,
        x - arrowSize * 0.8, y - arrowSize * 0.15
      );
      
      // Left bottom inner
      ctx.lineTo(x - arrowSize * 0.8, y + arrowSize * 0.15);
      
      // Left edge inner lower
      ctx.bezierCurveTo(
        x - arrowSize * 0.6, y + arrowSize * 0.15,
        x - arrowSize * 0.4, y + arrowSize * 0.15,
        x - arrowSize * 0.2, y + arrowSize * 0.15
      );
      
      // Left lower outer
      ctx.lineTo(x - arrowSize * 0.2, y + arrowSize * 0.4);
      
      // Bottom curve
      ctx.bezierCurveTo(
        x + arrowSize * 0.3, y + arrowSize * 0.8,
        x + arrowSize * 0.8, y + arrowSize * 0.6,
        x + arrowSize * 1.2, y
      );
      break;
  }

  ctx.closePath();
  ctx.fill();
  ctx.stroke();
}

/**
 * Get arrow color based on direction
 */
function getArrowColor(direction: 'forward' | 'left' | 'right'): string {
  switch (direction) {
    case 'forward':
      return '#00FF41'; // Bright neon green
    case 'left':
      return '#00E5FF'; // Bright cyan
    case 'right':
      return '#FFD700'; // Bright gold/yellow
    default:
      return '#00FF41';
  }
}

/**
 * Get arrow glow color
 */
function getArrowGlowColor(direction: 'forward' | 'left' | 'right'): string {
  switch (direction) {
    case 'forward':
      return 'rgba(0, 255, 65, 1)';
    case 'left':
      return 'rgba(0, 229, 255, 1)';
    case 'right':
      return 'rgba(255, 215, 0, 1)';
    default:
      return 'rgba(0, 255, 65, 1)';
  }
}

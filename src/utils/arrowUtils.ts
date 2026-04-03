/**
 * AR Arrow Navigation Utilities
 * Handles perspective scaling, directional arrows, and pseudo-AR positioning
 */

export type ArrowDirection = 'forward' | 'left' | 'right';

export interface ARArrow {
  id: string;
  direction: ArrowDirection;
  depth: number; // 0 = closest (bottom), 1 = farthest (top)
  offsetX: number; // -1 to 1, center is 0
  createdAt: number;
}

export interface ArrowConfig {
  screenWidth: number;
  screenHeight: number;
  arrowCount: number; // How many arrows visible at once
  animationSpeed: number; // pixels per frame
  perspectiveIntensity: number; // How much size changes with distance
}

/**
 * Generate a sequence of directional arrows from a path
 * Simulates navigation through a series of locations
 * @param pathLength - Number of nodes in the path
 * @returns Array of directions: forward, left, right
 */
export function generateDirectionSequence(pathLength: number): ArrowDirection[] {
  const directions: ArrowDirection[] = [];
  
  // Simple simulation: mostly forward with occasional turns
  let currentDirection = 'forward' as ArrowDirection;
  
  for (let i = 0; i < pathLength; i++) {
    if (i > 0 && i % 3 === 0) {
      // Every 3 steps, add a turn
      currentDirection = Math.random() > 0.5 ? 'left' : 'right';
    } else {
      currentDirection = 'forward';
    }
    directions.push(currentDirection);
  }
  
  return directions;
}

/**
 * Calculate perspective scale based on depth
 * Depth 0 = closest = largest scale
 * Depth 1 = farthest = smallest scale
 */
export function getPerspectiveScale(depth: number, intensity: number = 1): number {
  // Quadratic scaling for more dramatic effect
  return 0.3 + (1 - depth * depth) * 0.7 * intensity;
}

/**
 * Calculate opacity based on depth
 * Farthest arrows are more transparent
 */
export function getPerspectiveOpacity(depth: number): number {
  // Fade out as we go far
  return 0.4 + (1 - depth) * 0.6;
}

/**
 * Get screen position for an arrow
 */
export function getArrowScreenPosition(
  arrow: ARArrow,
  screenHeight: number,
  arrowCount: number
): { x: number; y: number } {
  // Vertical position: bottom = depth 0, top = depth ~1
  const yPercent = arrow.depth / arrowCount;
  const y = screenHeight - screenHeight * yPercent;
  
  // Horizontal offset with perspective (further arrows are more centered)
  const offsetInfluence = (1 - arrow.depth) * 0.3; // Further = more centered
  const x = 0.5 + arrow.offsetX * offsetInfluence;
  
  return { x, y };
}

/**
 * Create a new arrow
 */
export function createArrow(
  id: string,
  direction: ArrowDirection,
  depthOffset: number = 0,
  offsetX: number = 0
): ARArrow {
  return {
    id,
    direction,
    depth: depthOffset,
    offsetX,
    createdAt: Date.now(),
  };
}

/**
 * Update arrow position (move downward)
 */
export function updateArrowDepth(arrow: ARArrow, delta: number): ARArrow {
  return {
    ...arrow,
    depth: Math.min(arrow.depth + delta, 1),
  };
}

/**
 * Check if arrow should be removed
 */
export function shouldRemoveArrow(depth: number): boolean {
  return depth >= 0.95; // Remove when nearly at bottom
}

/**
 * Draw SVG arrow shape
 */
export function drawArrowShape(
  direction: ArrowDirection,
  scale: number = 1
): string {
  const baseSize = 40 * scale;
  const centerX = 0;
  const centerY = 0;
  
  switch (direction) {
    case 'forward':
      // Upward pointing arrow (toward top of screen)
      return `
        M ${centerX} ${centerY - baseSize}
        L ${centerX - baseSize * 0.5} ${centerY + baseSize * 0.3}
        L ${centerX - baseSize * 0.2} ${centerY + baseSize * 0.3}
        L ${centerX - baseSize * 0.2} ${centerY + baseSize * 0.8}
        L ${centerX + baseSize * 0.2} ${centerY + baseSize * 0.8}
        L ${centerX + baseSize * 0.2} ${centerY + baseSize * 0.3}
        L ${centerX + baseSize * 0.5} ${centerY + baseSize * 0.3}
        Z
      `;
    
    case 'left':
      // Left pointing arrow
      return `
        M ${centerX - baseSize} ${centerY}
        L ${centerX + baseSize * 0.3} ${centerY - baseSize * 0.5}
        L ${centerX + baseSize * 0.3} ${centerY - baseSize * 0.2}
        L ${centerX + baseSize * 0.8} ${centerY - baseSize * 0.2}
        L ${centerX + baseSize * 0.8} ${centerY + baseSize * 0.2}
        L ${centerX + baseSize * 0.3} ${centerY + baseSize * 0.2}
        L ${centerX + baseSize * 0.3} ${centerY + baseSize * 0.5}
        Z
      `;
    
    case 'right':
      // Right pointing arrow
      return `
        M ${centerX + baseSize} ${centerY}
        L ${centerX - baseSize * 0.3} ${centerY - baseSize * 0.5}
        L ${centerX - baseSize * 0.3} ${centerY - baseSize * 0.2}
        L ${centerX - baseSize * 0.8} ${centerY - baseSize * 0.2}
        L ${centerX - baseSize * 0.8} ${centerY + baseSize * 0.2}
        L ${centerX - baseSize * 0.3} ${centerY + baseSize * 0.2}
        L ${centerX - baseSize * 0.3} ${centerY + baseSize * 0.5}
        Z
      `;
    
    default:
      return '';
  }
}

/**
 * Get arrow color based on direction
 */
export function getArrowColor(direction: ArrowDirection): string {
  switch (direction) {
    case 'forward':
      return '#00FF41'; // Bright green
    case 'left':
      return '#00D9FF'; // Cyan
    case 'right':
      return '#FFB700'; // Gold
    default:
      return '#00FF41';
  }
}

/**
 * Get arrow glow color
 */
export function getArrowGlowColor(direction: ArrowDirection): string {
  switch (direction) {
    case 'forward':
      return 'rgba(0, 255, 65, 0.8)';
    case 'left':
      return 'rgba(0, 217, 255, 0.8)';
    case 'right':
      return 'rgba(255, 183, 0, 0.8)';
    default:
      return 'rgba(0, 255, 65, 0.8)';
  }
}

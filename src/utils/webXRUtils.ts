/**
 * WebXR Utilities for AR Floor Navigation
 * Handles session setup, hit testing, and floor plane detection
 */

/**
 * Check if WebXR is supported
 */
export function isWebXRSupported(): boolean {
  return !!(
    navigator.xr && 
    navigator.xr.isSessionSupported('immersive-ar')
  );
}

/**
 * Request AR session
 */
export async function requestARSession(): Promise<XRSession | null> {
  try {
    if (!navigator.xr) {
      console.warn('WebXR not available');
      return null;
    }

    // Check if immersive-ar is supported
    const supported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!supported) {
      console.warn('immersive-ar is not supported on this device');
      return null;
    }

    // Request AR session with minimal required features
    const session = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: [],
      optionalFeatures: ['hit-test', 'dom-overlay-for-handheld-ar'],
    } as any);

    console.log('AR Session started successfully');
    return session;
  } catch (error) {
    console.error('Failed to request AR session:', error);
    return null;
  }
}

/**
 * Get viewer position from XR frame
 */
export function getViewerPosition(
  frame: XRFrame,
  referenceSpace: XRReferenceSpace
): { x: number; y: number; z: number } | null {
  try {
    const pose = frame.getViewerPose(referenceSpace);
    if (!pose) return null;

    const position = pose.transform.position;
    return {
      x: position.x,
      y: position.y,
      z: position.z,
    };
  } catch (error) {
    console.error('Failed to get viewer position:', error);
    return null;
  }
}


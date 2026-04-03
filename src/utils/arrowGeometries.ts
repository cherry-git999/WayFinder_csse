/**
 * 3D Arrow Geometries for AR Floor Navigation
 * Creates glowing arrow shapes in Three.js
 */

import * as THREE from 'three';

/**
 * Create forward-pointing arrow geometry
 */
export function createForwardArrow(): THREE.Group {
  const group = new THREE.Group();

  // Arrow shaft (vertical)
  const shaftGeometry = new THREE.BoxGeometry(0.5, 1.8, 0.2);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff41,
    emissive: 0x00ff41,
    emissiveIntensity: 1.2,
    metalness: 0.4,
    roughness: 0.1,
  });
  const shaft = new THREE.Mesh(shaftGeometry, material);
  shaft.position.y = 0.5;
  shaft.castShadow = true;
  group.add(shaft);

  // Arrow head (triangle)
  const headGeometry = new THREE.ConeGeometry(0.6, 1.0, 32);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.y = 1.7;
  head.castShadow = true;
  group.add(head);

  // Add bright glow
  const glowGeometry = new THREE.BoxGeometry(0.6, 2.0, 0.25);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff41,
    transparent: true,
    opacity: 0.4,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = 0.5;
  group.add(glow);

  return group;
}

/**
 * Create left-turn arrow geometry
 */
export function createLeftArrow(): THREE.Group {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: 0x00e5ff,
    emissive: 0x00e5ff,
    emissiveIntensity: 1.2,
    metalness: 0.4,
    roughness: 0.1,
  });

  // Left arrow shaft
  const shaftGeometry = new THREE.BoxGeometry(1.8, 0.5, 0.2);
  const shaft = new THREE.Mesh(shaftGeometry, material);
  shaft.position.x = -0.6;
  shaft.castShadow = true;
  group.add(shaft);

  // Arrow head (left point)
  const headGeometry = new THREE.ConeGeometry(0.6, 1.0, 32);
  headGeometry.rotateZ(Math.PI / 2);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.x = -1.8;
  head.castShadow = true;
  group.add(head);

  // Curved part (vertical segment)
  const curveGeometry = new THREE.BoxGeometry(0.5, 1.2, 0.2);
  const curve = new THREE.Mesh(curveGeometry, material);
  curve.position.x = 0.2;
  curve.position.y = 0.6;
  curve.castShadow = true;
  group.add(curve);

  // Add bright glow
  const glowGeometry = new THREE.BoxGeometry(2.0, 0.6, 0.25);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.4,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.x = -0.6;
  group.add(glow);

  return group;
}

/**
 * Create right-turn arrow geometry
 */
export function createRightArrow(): THREE.Group {
  const group = new THREE.Group();

  const material = new THREE.MeshStandardMaterial({
    color: 0xffd700,
    emissive: 0xffd700,
    emissiveIntensity: 1.2,
    metalness: 0.4,
    roughness: 0.1,
  });

  // Right arrow shaft
  const shaftGeometry = new THREE.BoxGeometry(1.8, 0.5, 0.2);
  const shaft = new THREE.Mesh(shaftGeometry, material);
  shaft.position.x = 0.6;
  shaft.castShadow = true;
  group.add(shaft);

  // Arrow head (right point)
  const headGeometry = new THREE.ConeGeometry(0.6, 1.0, 32);
  headGeometry.rotateZ(-Math.PI / 2);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.x = 1.8;
  head.castShadow = true;
  group.add(head);

  // Curved part (vertical segment)
  const curveGeometry = new THREE.BoxGeometry(0.5, 1.2, 0.2);
  const curve = new THREE.Mesh(curveGeometry, material);
  curve.position.x = -0.2;
  curve.position.y = 0.6;
  curve.castShadow = true;
  group.add(curve);

  // Add bright glow
  const glowGeometry = new THREE.BoxGeometry(2.0, 0.6, 0.25);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.4,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.x = 0.6;
  group.add(glow);

  return group;
}

/**
 * Create multiple arrows in a line (showing path)
 */
export function createArrowPath(
  directions: ('forward' | 'left' | 'right')[],
  spacing: number = 2.5
): THREE.Group {
  const group = new THREE.Group();

  directions.forEach((direction, index) => {
    let arrow: THREE.Group;

    switch (direction) {
      case 'forward':
        arrow = createForwardArrow();
        break;
      case 'left':
        arrow = createLeftArrow();
        break;
      case 'right':
        arrow = createRightArrow();
        break;
    }

    // Position arrows in a line
    arrow.position.z = -(index * spacing);
    group.add(arrow);
  });

  return group;
}

/**
 * Add lighting for arrows
 */
export function createArrowLighting(scene: THREE.Scene): void {
  // Remove existing lights (if any)
  scene.children.forEach((child) => {
    if (child instanceof THREE.Light) {
      scene.remove(child);
    }
  });

  // Strong ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
  scene.add(ambientLight);

  // Point light above to make arrows glow
  const pointLight = new THREE.PointLight(0xffffff, 2.0, 100);
  pointLight.position.set(0, 5, 0);
  scene.add(pointLight);

  // Directional light for strong illumination
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Front light to face camera
  const frontLight = new THREE.DirectionalLight(0xffffff, 0.8);
  frontLight.position.set(0, 0, 10);
  scene.add(frontLight);
}

/**
 * Create floor plane for reference
 */
export function createFloorPlane(width: number = 10, depth: number = 10): THREE.Mesh {
  const geometry = new THREE.PlaneGeometry(width, depth);
  const material = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.8,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = Math.PI / 2; // Rotate to lie flat
  plane.receiveShadow = true;
  return plane;
}

/**
 * Update arrow glow animation
 */
export function updateArrowGlow(group: THREE.Group, time: number): void {
  const pulse = Math.sin(time * 2) * 0.3 + 0.7;
  
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material;
      if (material instanceof THREE.MeshStandardMaterial && material.emissive) {
        // Pulsing glow effect
        material.emissiveIntensity = ((material.emissive.getHex() !== 0x000000) ? 0.8 : 0) * pulse;
      } else if (material instanceof THREE.MeshBasicMaterial && material.color) {
        // Subtle opacity pulse for glow meshes
        material.opacity = Math.max(0.2, 0.3 * pulse);
      }
    }
  });
}

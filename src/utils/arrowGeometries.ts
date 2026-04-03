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
  const shaftGeometry = new THREE.BoxGeometry(0.3, 1.2, 0.1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x00ff41,
    emissive: 0x00ff41,
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.2,
  });
  const shaft = new THREE.Mesh(shaftGeometry, material);
  shaft.position.y = 0.4;
  group.add(shaft);

  // Arrow head (triangle)
  const headGeometry = new THREE.ConeGeometry(0.4, 0.6, 32);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.y = 1.3;
  group.add(head);

  // Add glow
  const glowGeometry = new THREE.BoxGeometry(0.35, 1.4, 0.15);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff41,
    transparent: true,
    opacity: 0.3,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.y = 0.4;
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
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.2,
  });

  // Left arrow shaft
  const shaftGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.1);
  const shaft = new THREE.Mesh(shaftGeometry, material);
  shaft.position.x = -0.4;
  group.add(shaft);

  // Arrow head (left point)
  const headGeometry = new THREE.ConeGeometry(0.4, 0.6, 32);
  headGeometry.rotateZ(Math.PI / 2);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.x = -1.3;
  group.add(head);

  // Curved part (vertical segment)
  const curveGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.1);
  const curve = new THREE.Mesh(curveGeometry, material);
  curve.position.x = 0.1;
  curve.position.y = 0.4;
  group.add(curve);

  // Add glow
  const glowGeometry = new THREE.BoxGeometry(1.4, 0.35, 0.15);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0x00e5ff,
    transparent: true,
    opacity: 0.3,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.x = -0.4;
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
    emissiveIntensity: 0.8,
    metalness: 0.3,
    roughness: 0.2,
  });

  // Right arrow shaft
  const shaftGeometry = new THREE.BoxGeometry(1.2, 0.3, 0.1);
  const shaft = new THREE.Mesh(shaftGeometry, material);
  shaft.position.x = 0.4;
  group.add(shaft);

  // Arrow head (right point)
  const headGeometry = new THREE.ConeGeometry(0.4, 0.6, 32);
  headGeometry.rotateZ(-Math.PI / 2);
  const head = new THREE.Mesh(headGeometry, material);
  head.position.x = 1.3;
  group.add(head);

  // Curved part (vertical segment)
  const curveGeometry = new THREE.BoxGeometry(0.3, 0.8, 0.1);
  const curve = new THREE.Mesh(curveGeometry, material);
  curve.position.x = -0.1;
  curve.position.y = 0.4;
  group.add(curve);

  // Add glow
  const glowGeometry = new THREE.BoxGeometry(1.4, 0.35, 0.15);
  const glowMaterial = new THREE.MeshBasicMaterial({
    color: 0xffd700,
    transparent: true,
    opacity: 0.3,
  });
  const glow = new THREE.Mesh(glowGeometry, glowMaterial);
  glow.position.x = 0.4;
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

  // Ambient light for overall illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
  scene.add(ambientLight);

  // Point light above to make arrows glow
  const pointLight = new THREE.PointLight(0xffffff, 1.5, 50);
  pointLight.position.set(0, 3, 0);
  scene.add(pointLight);

  // Directional light for shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 10, 5);
  directionalLight.castShadow = true;
  scene.add(directionalLight);
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
  group.children.forEach((child) => {
    if (child instanceof THREE.Mesh) {
      const material = child.material;
      if (material instanceof THREE.MeshStandardMaterial) {
        // Pulsing glow effect
        const pulse = Math.sin(time * 2) * 0.3 + 0.7;
        material.emissiveIntensity = 0.8 * pulse;
      }
    }
  });
}

# WayFinder 3D Indoor Navigation System

## Overview

The 3D indoor navigation system provides an interactive, visually clear indoor floor plan with dynamic pathfinding. It uses Three.js via `@react-three/fiber` to render a 3D scene with rooms, navigation paths, and intuitive controls.

## Architecture

### Components

#### `Navigation3D.tsx`
Main component that renders the 3D scene. Includes:
- **Canvas**: Three.js rendering surface
- **Lights**: Ambient and directional lighting for visual clarity
- **Floor**: Ground plane reference
- **Rooms**: 3D box representations with labels
- **NavigationPath**: Golden line visualization of the route
- **OrbitControls**: Interactive camera controls (rotate, pan, zoom)

### Utilities

#### `navigationGraph.ts`
Handles navigation logic and data:
- **ROOMS**: Room definitions with positions, sizes, and colors
- **NAVIGATION_GRAPH**: Graph structure defining room connections
- **findPath()**: BFS algorithm to find shortest route between rooms
- **pathTo3DCoordinates()**: Converts room IDs to 3D coordinates

## Usage

### Basic Integration

```tsx
import { Navigation3D } from './components/Navigation3D';

export const MyPage = () => {
  const [destination, setDestination] = useState<string>();

  return (
    <Navigation3D
      destination={destination}
      currentRoom="entrance"
    />
  );
};
```

### Props

- **destination** (optional): Room ID of the selected destination
- **currentRoom** (optional): Room ID of current location (defaults to 'entrance')

## Customization Guide

### 1. Adding/Modifying Rooms

Edit `src/utils/navigationGraph.ts`:

```typescript
export const ROOMS: Record<string, Room> = {
  entrance: {
    id: 'entrance',
    name: 'Entrance',
    position: [0, 0, 0],      // [x, y, z] coordinates
    size: [3, 2, 3],          // [width, height, depth]
    color: '#FF6B6B',         // Hex color
  },
  // Add more rooms...
};
```

**Tips:**
- Keep `y` (height) at `0` for ground-level rooms
- Adjust `position` to space rooms apart visually
- Use distinct colors for visual differentiation
- The `name` property appears as the room label in the scene

### 2. Updating Navigation Connections

Edit the `NAVIGATION_GRAPH`:

```typescript
export const NAVIGATION_GRAPH: Record<string, GraphNode> = {
  entrance: {
    roomId: 'entrance',
    neighbors: ['lab', 'washroom', 'faculty'], // Which rooms connect here
  },
  // Update connections...
};
```

The algorithm finds the shortest path between any two connected rooms.

### 3. Changing Colors and Styling

For room colors, edit the `color` field in ROOMS:
```typescript
color: '#FF6B6B',  // Use any valid hex color
```

For visual styling in the component (`Navigation3D.tsx`):
- **Destination highlighting**: Modify the `emissive` property in Room component
- **Path color**: Change `#FFD700` in NavigationPath lineBasicMaterial
- **Floor color**: Update in Floor component

### 4. Adjusting Camera Position

In `Navigation3D.tsx`, modify the Canvas camera prop:

```tsx
<Canvas
  camera={{
    position: [10, 12, 15],  // [x, y, z] - adjust to zoom in/out
    fov: 50,                 // Field of view (larger = wider)
    near: 0.1,
    far: 1000,
  }}
>
```

### 5. Modifying Lighting

In `Lights.tsx`:
- **ambientLight intensity**: Controls overall brightness (0-1)
- **directionalLight position**: Adjust shadow direction
- **directionalLight intensity**: Adjust shadow strength

## File Structure

```
src/
├── components/
│   └── Navigation3D.tsx          # Main 3D scene component
├── pages/
│   └── Navigation3DPage.tsx      # Demo page with UI controls
└── utils/
    └── navigationGraph.ts         # Navigation logic & room data
```

## How It Works

### Pathfinding Algorithm

The system uses **BFS (Breadth-First Search)** to find the shortest path:

1. User selects a destination from the dropdown
2. `findPath()` is called with current room and destination
3. Returns array of room IDs representing the route
4. `pathTo3DCoordinates()` converts room IDs to 3D points
5. NavigationPath component renders a line connecting these points

### Rendering Flow

1. **SceneContent** renders all rooms from ROOMS object
2. Each **Room** component draws a box and label
3. **NavigationPath** draws a line between path coordinates
4. **OrbitControls** allows user interaction with camera
5. Three.js renders everything to the Canvas

## Features

✅ **Interactive 3D Scene** - Rotate, pan, zoom with mouse
✅ **Dynamic Pathfinding** - Shows route updates instantly
✅ **Clear Visual Hierarchy** - Destination room glows
✅ **Easy Customization** - Modify rooms without changing component logic
✅ **No Backend Required** - Entirely client-side
✅ **Mobile Friendly** - Canvas-based rendering works on touch devices

## Browser Compatibility

Works on modern browsers with WebGL support:
- Chrome/Edge 90+
- Firefox 88+
- Safari 14.1+

## Performance Notes

- Scene renders smoothly with up to 20-30 rooms
- OrbitControls provides ~60fps on modern hardware
- For larger indoor spaces, consider implementing room culling or LOD

## Future Enhancements

- **Multi-floor support**: Add floor selector
- **Real-time user position**: Integrate with location APIs
- **Turn-by-turn directions**: Text instructions alongside visual path
- **Room search**: Search by name or type
- **Accessibility**: Support keyboard navigation
- **Mobile optimization**: Touch gestures and mobile UI

## Troubleshooting

**Scene looks dark:**
- Increase `ambientLight intensity` or `directionalLight intensity`

**Path not showing:**
- Verify rooms are connected in NAVIGATION_GRAPH
- Check that destination room ID matches exactly

**Controls not working:**
- Ensure OrbitControls is inside Canvas
- Try different mouse buttons (left-drag, right-drag, scroll)

**Rooms not visible:**
- Check room positions don't overlap excessively
- Adjust camera position in Canvas props
- Verify room sizes are larger than 0

## License

Part of the WayFinder hackathon project.

/**
 * Navigation Graph for WayFinder 3D Indoor Navigation
 * Defines rooms, their positions, and navigation paths
 */

export interface Room {
  id: string;
  name: string;
  position: [number, number, number];
  size: [number, number, number];
  color: string;
}

export interface GraphNode {
  roomId: string;
  neighbors: string[];
}

// Define all rooms with positions and sizes - ACCURATE based on floor plan sketch
export const ROOMS: Record<string, Room> = {
  entrance: {
    id: 'entrance',
    name: 'Entrance',
    position: [0, 0, 4.5],
    size: [2.5, 2, 2],
    color: '#FF6B6B',
  },
  'lunch hall': {
    id: 'lunch hall',
    name: 'Lunch Hall',
    position: [-4, 0, 3],
    size: [4, 2.5, 4],
    color: '#FFC107',
  },
  stairs: {
    id: 'stairs',
    name: 'Stairs',
    position: [0, 0, 1.5],
    size: [2, 2, 2],
    color: '#B0C4DE',
  },
  'small office': {
    id: 'small office',
    name: 'Small Office',
    position: [-2, 0, 4.5],
    size: [1.8, 2, 2],
    color: '#95E1D3',
  },
  washroom: {
    id: 'washroom',
    name: 'Washroom',
    position: [2.5, 0, 4.5],
    size: [1.5, 2, 1.8],
    color: '#FFA07A',
  },
  'class 1': {
    id: 'class 1',
    name: 'Class 1',
    position: [-5, 0, -1.5],
    size: [2, 2.5, 1.8],
    color: '#45B7D1',
  },
  'class 2': {
    id: 'class 2',
    name: 'Class 2',
    position: [-2.5, 0, -1.5],
    size: [2, 2.5, 1.8],
    color: '#45B7D1',
  },
  'class 3': {
    id: 'class 3',
    name: 'Class 3',
    position: [0, 0, -1.5],
    size: [2, 2.5, 1.8],
    color: '#45B7D1',
  },
  'class (large)': {
    id: 'class (large)',
    name: 'Class (Large)',
    position: [3.5, 0, 0.5],
    size: [2.5, 2.5, 4.5],
    color: '#4ECDC4',
  },
};

// Navigation graph - defines which rooms connect to which (based on floor plan adjacency)
export const NAVIGATION_GRAPH: Record<string, GraphNode> = {
  entrance: {
    roomId: 'entrance',
    neighbors: ['lunch hall', 'stairs'],
  },
  'lunch hall': {
    roomId: 'lunch hall',
    neighbors: ['entrance', 'small office'],
  },
  stairs: {
    roomId: 'stairs',
    neighbors: ['entrance', 'washroom', 'small office', 'class 3'],
  },
  washroom: {
    roomId: 'washroom',
    neighbors: ['stairs', 'class (large)'],
  },
  'small office': {
    roomId: 'small office',
    neighbors: ['lunch hall', 'stairs', 'class 2'],
  },
  'class 1': {
    roomId: 'class 1',
    neighbors: ['class 2'],
  },
  'class 2': {
    roomId: 'class 2',
    neighbors: ['class 1', 'small office', 'class 3'],
  },
  'class 3': {
    roomId: 'class 3',
    neighbors: ['class 2', 'stairs', 'class (large)'],
  },
  'class (large)': {
    roomId: 'class (large)',
    neighbors: ['washroom', 'class 3'],
  },
};

/**
 * Find shortest path between two rooms using BFS
 */
export const findPath = (startRoomId: string, endRoomId: string): string[] => {
  if (startRoomId === endRoomId) {
    return [startRoomId];
  }

  const queue: Array<{ roomId: string; path: string[] }> = [
    { roomId: startRoomId, path: [startRoomId] },
  ];
  const visited = new Set<string>();
  visited.add(startRoomId);

  while (queue.length > 0) {
    const { roomId, path } = queue.shift()!;

    const neighbors = NAVIGATION_GRAPH[roomId]?.neighbors || [];
    for (const neighbor of neighbors) {
      if (neighbor === endRoomId) {
        return [...path, neighbor];
      }

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({
          roomId: neighbor,
          path: [...path, neighbor],
        });
      }
    }
  }

  // No path found, return empty array
  return [];
};

/**
 * Convert a path of room IDs to 3D coordinates
 * Returns points along the center of each room
 */
export const pathTo3DCoordinates = (roomPath: string[]): [number, number, number][] => {
  return roomPath.map((roomId) => {
    const room = ROOMS[roomId];
    if (!room) {
      return [0, 0.1, 0]; // Fallback
    }
    // Return center points slightly above ground
    return [room.position[0], 0.1, room.position[2]];
  });
};

/**
 * Get all available room destinations
 */
export const getAvailableRooms = (): Room[] => {
  return Object.values(ROOMS);
};

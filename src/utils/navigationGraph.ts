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

// Define all rooms with positions and sizes
export const ROOMS: Record<string, Room> = {
  entrance: {
    id: 'entrance',
    name: 'Entrance',
    position: [0, 0, 0],
    size: [3, 2, 3],
    color: '#FF6B6B',
  },
  lab: {
    id: 'lab',
    name: 'Lab',
    position: [6, 0, 0],
    size: [4, 2.5, 4],
    color: '#4ECDC4',
  },
  classroom: {
    id: 'classroom',
    name: 'Classroom',
    position: [6, 0, -8],
    size: [5, 2.5, 4],
    color: '#45B7D1',
  },
  washroom: {
    id: 'washroom',
    name: 'Washroom',
    position: [0, 0, -6],
    size: [2, 2, 2],
    color: '#FFA07A',
  },
  faculty: {
    id: 'faculty',
    name: 'Faculty Room',
    position: [-6, 0, 0],
    size: [4, 2.5, 3],
    color: '#95E1D3',
  },
  cafeteria: {
    id: 'cafeteria',
    name: 'Cafeteria',
    position: [8, 0, 5],
    size: [5, 2.5, 4],
    color: '#FFC107',
  },
};

// Navigation graph - defines which rooms connect to which
export const NAVIGATION_GRAPH: Record<string, GraphNode> = {
  entrance: {
    roomId: 'entrance',
    neighbors: ['lab', 'washroom', 'faculty'],
  },
  lab: {
    roomId: 'lab',
    neighbors: ['entrance', 'classroom', 'washroom'],
  },
  classroom: {
    roomId: 'classroom',
    neighbors: ['lab'],
  },
  washroom: {
    roomId: 'washroom',
    neighbors: ['entrance', 'lab'],
  },
  faculty: {
    roomId: 'faculty',
    neighbors: ['entrance'],
  },
  cafeteria: {
    roomId: 'cafeteria',
    neighbors: ['entrance', 'lab', 'classroom'],
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

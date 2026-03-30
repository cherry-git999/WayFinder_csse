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

// Define all rooms with positions and sizes - CLEAR LAYOUT based on floor description
export const ROOMS: Record<string, Room> = {
  entrance: {
    id: 'entrance',
    name: 'Entrance',
    position: [0, 0, 5],
    size: [3, 2, 2.5],
    color: '#FF6B6B',
  },
  'seminar hall': {
    id: 'seminar hall',
    name: 'Seminar Hall',
    position: [-4.5, 0, 3],
    size: [3.5, 2.5, 4],
    color: '#FFC107',
  },
  'a01': {
    id: 'a01',
    name: 'A01',
    position: [4.5, 0, 3],
    size: [2.5, 2.5, 3],
    color: '#45B7D1',
  },
  'a02': {
    id: 'a02',
    name: 'A02',
    position: [4.5, 0, 0.5],
    size: [2.5, 2.5, 3],
    color: '#45B7D1',
  },
  'small office': {
    id: 'small office',
    name: 'Small Office',
    position: [-1.5, 0, 5],
    size: [2, 2, 2],
    color: '#95E1D3',
  },
  washroom: {
    id: 'washroom',
    name: 'Washroom',
    position: [1.5, 0, 5],
    size: [2, 2, 2],
    color: '#FFA07A',
  },
  stairs: {
    id: 'stairs',
    name: 'Stairs',
    position: [-4.5, 0, -1.5],
    size: [2.5, 2, 2.5],
    color: '#B0C4DE',
  },
  lift: {
    id: 'lift',
    name: 'Lift',
    position: [4.5, 0, -1.5],
    size: [1.8, 2, 1.8],
    color: '#C0C0C0',
  },
  'class room': {
    id: 'class room',
    name: 'Class Room',
    position: [0, 0, -1.5],
    size: [3, 2.5, 4],
    color: '#4ECDC4',
  },
};

// Navigation graph - defines which rooms connect to which (based on clear spatial layout)
export const NAVIGATION_GRAPH: Record<string, GraphNode> = {
  entrance: {
    roomId: 'entrance',
    neighbors: ['small office', 'washroom', 'seminar hall', 'a01', 'class room'],
  },
  'seminar hall': {
    roomId: 'seminar hall',
    neighbors: ['entrance', 'small office', 'stairs', 'class room'],
  },
  'a01': {
    roomId: 'a01',
    neighbors: ['entrance', 'a02', 'washroom', 'lift', 'class room'],
  },
  'a02': {
    roomId: 'a02',
    neighbors: ['a01', 'lift', 'class room'],
  },
  'small office': {
    roomId: 'small office',
    neighbors: ['entrance', 'seminar hall', 'stairs'],
  },
  washroom: {
    roomId: 'washroom',
    neighbors: ['entrance', 'a01', 'lift'],
  },
  stairs: {
    roomId: 'stairs',
    neighbors: ['seminar hall', 'small office', 'class room'],
  },
  lift: {
    roomId: 'lift',
    neighbors: ['a01', 'a02', 'washroom', 'class room'],
  },
  'class room': {
    roomId: 'class room',
    neighbors: ['entrance', 'seminar hall', 'a01', 'a02', 'stairs', 'lift'],
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

/**
 * CLEAN FLOOR PLAN (BASED ON YOUR DRAWING)
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

// ================= ROOMS =================
export const ROOMS: Record<string, Room> = {
  entrance: {
    id: "entrance",
    name: "Entrance",
    position: [0, 0, 8],
    size: [3, 2, 2],
    color: "#FF6B6B",
  },

  seminar: {
    id: "seminar",
    name: "Seminar Hall",
    position: [-5, 0, 2],
    size: [5, 2.5, 6],
    color: "#FFC107",
  },

  stairs: {
    id: "stairs",
    name: "Stairs",
    position: [0, 0, 0],
    size: [2, 2, 2],
    color: "#B0C4DE",
  },

  washroom: {
    id: "washroom",
    name: "Washroom",
    position: [2, 0, -3],
    size: [3, 2, 3],
    color: "#FFA07A",
  },

  class1: {
    id: "class1",
    name: "Class 1",
    position: [-6, 0, -5],
    size: [2, 2, 2],
    color: "#45B7D1",
  },

  class2: {
    id: "class2",
    name: "Class 2",
    position: [-3.5, 0, -5],
    size: [2, 2, 2],
    color: "#45B7D1",
  },

  class3: {
    id: "class3",
    name: "Class 3",
    position: [6, 0, -3],
    size: [3, 2, 3],
    color: "#45B7D1",
  },

  class4: {
    id: "class4",
    name: "Class 4",
    position: [6, 0, 2],
    size: [3, 2, 3],
    color: "#45B7D1",
  },

  emergency: {
    id: "emergency",
    name: "Emergency Exit",
    position: [0, 0, -8],
    size: [2, 2, 1],
    color: "#ff0000",
  },
};

// ================= GRAPH =================
export const NAVIGATION_GRAPH: Record<string, GraphNode> = {
  entrance: {
    roomId: "entrance",
    neighbors: ["stairs", "seminar"],
  },

  seminar: {
    roomId: "seminar",
    neighbors: ["entrance", "stairs"],
  },

  stairs: {
    roomId: "stairs",
    neighbors: [
      "entrance",
      "seminar",
      "washroom",
      "class1",
      "class2",
      "class3",
      "class4",
      "emergency",
    ],
  },

  washroom: {
    roomId: "washroom",
    neighbors: ["stairs", "class3"],
  },

  class1: {
    roomId: "class1",
    neighbors: ["stairs", "class2"],
  },

  class2: {
    roomId: "class2",
    neighbors: ["class1", "stairs"],
  },

  class3: {
    roomId: "class3",
    neighbors: ["stairs", "class4", "washroom"],
  },

  class4: {
    roomId: "class4",
    neighbors: ["class3", "stairs"],
  },

  emergency: {
    roomId: "emergency",
    neighbors: ["stairs"],
  },
};

// ================= PATH FINDING =================
export const findPath = (start: string, end: string): string[] => {
  if (start === end) return [start];

  const queue = [{ room: start, path: [start] }];
  const visited = new Set([start]);

  while (queue.length) {
    const { room, path } = queue.shift()!;
    for (const neighbor of NAVIGATION_GRAPH[room]?.neighbors || []) {
      if (neighbor === end) return [...path, neighbor];
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ room: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return [];
};

// ================= PATH → 3D =================
export const pathTo3DCoordinates = (path: string[]): [number, number, number][] => {
  return path.map((id) => {
    const room = ROOMS[id];
    return [room.position[0], 0.2, room.position[2]] as [number, number, number];
  });
};

// ================= UTILITIES =================
export const getAvailableRooms = (): Room[] => {
  return Object.values(ROOMS);
};
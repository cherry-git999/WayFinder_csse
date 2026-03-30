export interface Location {
  id: number;
  name: string;
  floor: string;
  category: 'Lab' | 'Classroom' | 'Faculty Room' | 'Facility';
  description?: string;
}

export const locations: Location[] = [
  {
    id: 1,
    name: 'IoT Lab',
    floor: '2nd Floor',
    category: 'Lab',
    description: 'Internet of Things Laboratory'
  },
  {
    id: 2,
    name: 'Computer Science Lab',
    floor: '2nd Floor',
    category: 'Lab',
    description: 'Main CS Laboratory'
  },
  {
    id: 3,
    name: 'AI & ML Lab',
    floor: '3rd Floor',
    category: 'Lab',
    description: 'Artificial Intelligence and Machine Learning Lab'
  },
  {
    id: 4,
    name: 'Room 101',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'General Classroom'
  },
  {
    id: 5,
    name: 'Room 102',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Large Lecture Hall'
  },
  {
    id: 6,
    name: 'Room 201',
    floor: '2nd Floor',
    category: 'Classroom',
    description: 'Seminar Room'
  },
  {
    id: 7,
    name: 'Room 301',
    floor: '3rd Floor',
    category: 'Classroom',
    description: 'Tutorial Room'
  },
  {
    id: 8,
    name: 'Dr. Smith Office',
    floor: '2nd Floor',
    category: 'Faculty Room',
    description: 'Computer Science Department Head'
  },
  {
    id: 9,
    name: 'Dr. Johnson Office',
    floor: '3rd Floor',
    category: 'Faculty Room',
    description: 'AI Research Professor'
  },
  {
    id: 10,
    name: 'Faculty Lounge',
    floor: '2nd Floor',
    category: 'Faculty Room',
    description: 'Common Area for Faculty'
  },
  {
    id: 11,
    name: 'Main Entrance',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Department Main Entrance'
  },
  {
    id: 12,
    name: 'Library',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Department Library'
  },
  {
    id: 13,
    name: 'Washroom - M',
    floor: '1st Floor',
    category: 'Facility',
    description: "Men's Washroom"
  },
  {
    id: 14,
    name: 'Washroom - W',
    floor: '1st Floor',
    category: 'Facility',
    description: "Women's Washroom"
  },
  {
    id: 15,
    name: 'Cafeteria',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Student Cafeteria'
  },
  {
    id: 16,
    name: 'Server Room',
    floor: '3rd Floor',
    category: 'Facility',
    description: 'IT Infrastructure'
  },
  {
    id: 17,
    name: 'Robotics Lab',
    floor: '3rd Floor',
    category: 'Lab',
    description: 'Robotics and Automation Lab'
  },
  {
    id: 18,
    name: 'Network Lab',
    floor: '2nd Floor',
    category: 'Lab',
    description: 'Computer Networks Laboratory'
  }
];

export interface NavigationStep {
  instruction: string;
  distance?: string;
  landmark?: string;
}

export const generateMockRoute = (from: string, to: string): NavigationStep[] => {
  return [
    {
      instruction: `Starting from ${from}`,
      distance: '0m'
    },
    {
      instruction: 'Head straight down the corridor',
      distance: '15m',
      landmark: 'Pass by the notice board'
    },
    {
      instruction: 'Turn left at the intersection',
      distance: '5m',
      landmark: 'Near the water fountain'
    },
    {
      instruction: 'Continue straight',
      distance: '20m',
      landmark: 'Pass Room 201 on your right'
    },
    {
      instruction: 'Take the stairs up/down as needed',
      distance: '10m',
      landmark: 'Staircase at the end of corridor'
    },
    {
      instruction: 'Turn right after exiting stairs',
      distance: '8m'
    },
    {
      instruction: `${to} will be on your left`,
      distance: '0m'
    }
  ];
};

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
    name: 'Entrance',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Main Building Entrance'
  },
  {
    id: 2,
    name: 'Small Office',
    floor: '1st Floor',
    category: 'Faculty Room',
    description: 'Administrative Office'
  },
  {
    id: 3,
    name: 'Washroom',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Washroom'
  },
  {
    id: 4,
    name: 'Seminar Hall',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Seminar Room'
  },
  {
    id: 5,
    name: 'A01',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Classroom A01'
  },
  {
    id: 6,
    name: 'A02',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Classroom A02'
  },
  {
    id: 7,
    name: 'Stairs',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Staircase'
  },
  {
    id: 8,
    name: 'Lift',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Elevator'
  },
  {
    id: 9,
    name: 'Class Room',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Main Classroom'
  },
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

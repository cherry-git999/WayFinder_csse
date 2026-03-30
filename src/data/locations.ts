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
    name: 'Stairs',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Staircase'
  },
  {
    id: 3,
    name: 'Lunch Hall',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Cafeteria & Dining Area'
  },
  {
    id: 4,
    name: 'Washroom',
    floor: '1st Floor',
    category: 'Facility',
    description: 'Washroom'
  },
  {
    id: 5,
    name: 'Small Office',
    floor: '1st Floor',
    category: 'Faculty Room',
    description: 'Administrative Office'
  },
  {
    id: 6,
    name: 'Class 1',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Classroom 1'
  },
  {
    id: 7,
    name: 'Class 2',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Classroom 2'
  },
  {
    id: 8,
    name: 'Class 3',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Classroom 3'
  },
  {
    id: 9,
    name: 'Class (Large)',
    floor: '1st Floor',
    category: 'Classroom',
    description: 'Large Lecture Hall'
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

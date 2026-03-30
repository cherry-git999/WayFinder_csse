import { FlaskConical, Building2, Users, Wifi } from 'lucide-react';

interface QuickOptionsProps {
  onSelectCategory: (category: string) => void;
}

export const QuickOptions = ({ onSelectCategory }: QuickOptionsProps) => {
  const options = [
    { name: 'Labs', icon: FlaskConical, color: 'bg-blue-500 hover:bg-blue-600', category: 'Lab' },
    { name: 'Classrooms', icon: Building2, color: 'bg-green-500 hover:bg-green-600', category: 'Classroom' },
    { name: 'Faculty Rooms', icon: Users, color: 'bg-amber-500 hover:bg-amber-600', category: 'Faculty Room' },
    { name: 'Facilities', icon: Wifi, color: 'bg-gray-500 hover:bg-gray-600', category: 'Facility' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {options.map((option) => (
        <button
          key={option.name}
          onClick={() => onSelectCategory(option.category)}
          className={`${option.color} text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
        >
          <option.icon className="w-8 h-8 mx-auto mb-2" />
          <p className="font-semibold text-sm">{option.name}</p>
        </button>
      ))}
    </div>
  );
};

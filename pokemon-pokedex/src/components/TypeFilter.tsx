import { TYPE_COLORS } from '../utils/typeColors';

interface TypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

export default function TypeFilter({ selectedType, onChange }: TypeFilterProps) {
  const types = Object.keys(TYPE_COLORS);

  return (
    <select
      value={selectedType || ''}
      onChange={(e) => onChange(e.target.value || null)}
      className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
    >
      <option value="">All Types</option>
      {types.map((type) => (
        <option key={type} value={type} className="capitalize">
          {type}
        </option>
      ))}
    </select>
  );
}

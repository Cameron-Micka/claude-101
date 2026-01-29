import { useState, useEffect } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(localValue);
    }, 300);

    return () => clearTimeout(timeout);
  }, [localValue, onChange]);

  return (
    <input
      type="text"
      placeholder="Search Pokemon..."
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  );
}

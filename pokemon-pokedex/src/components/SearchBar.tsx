import { useState, useEffect } from 'react';
import { Input } from '@fluentui/react-components';
import { Search24Regular } from '@fluentui/react-icons';

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
    <Input
      contentBefore={<Search24Regular />}
      placeholder="Search Pokemon..."
      value={localValue}
      onChange={(_, data) => setLocalValue(data.value)}
      size="large"
      className="flex-1"
    />
  );
}

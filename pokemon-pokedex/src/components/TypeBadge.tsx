import { getTypeColor } from '../utils/typeColors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-1.5',
  };

  return (
    <span
      className={`inline-block rounded-full font-semibold text-white capitalize ${sizeClasses[size]}`}
      style={{ backgroundColor: getTypeColor(type) }}
    >
      {type}
    </span>
  );
}

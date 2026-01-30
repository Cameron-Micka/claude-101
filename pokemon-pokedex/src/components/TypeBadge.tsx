import { getTypeColor } from '../utils/typeColors';

interface TypeBadgeProps {
  type: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function TypeBadge({ type, size = 'md' }: TypeBadgeProps) {
  const sizeStyles = {
    sm: { fontSize: '12px', padding: '6px 16px' },
    md: { fontSize: '14px', padding: '8px 20px' },
    lg: { fontSize: '16px', padding: '10px 24px' },
  };

  return (
    <span
      className="inline-block rounded-full font-semibold text-white capitalize"
      style={{ backgroundColor: getTypeColor(type), ...sizeStyles[size] }}
    >
      {type}
    </span>
  );
}

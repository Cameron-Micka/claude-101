import { Dropdown, Option } from '@fluentui/react-components';
import { TYPE_COLORS } from '../utils/typeColors';

interface TypeFilterProps {
  selectedType: string | null;
  onChange: (type: string | null) => void;
}

export default function TypeFilter({ selectedType, onChange }: TypeFilterProps) {
  const types = Object.keys(TYPE_COLORS);

  return (
    <Dropdown
      placeholder="All Types"
      value={selectedType ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1) : 'All Types'}
      onOptionSelect={(_, data) => {
        onChange(data.optionValue === 'all' ? null : data.optionValue || null);
      }}
      size="large"
      style={{ minWidth: '180px' }}
    >
      <Option value="all">All Types</Option>
      {types.map((type) => (
        <Option key={type} value={type}>
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Option>
      ))}
    </Dropdown>
  );
}

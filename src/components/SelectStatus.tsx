import { Select, SelectItem } from '@nextui-org/react';

interface Status {
  id: string;
  label: string;
}
interface SelectStatusProps {
  value: string;
  // onChange: (value: string) => void;
  listStatus: Status[];
}
function SelectStatus(props: SelectStatusProps) {
  const { value, listStatus } = props;
  return (
    <Select
      defaultSelectedKeys={[`${value}`]}
      variant="flat"
      className="max-w-40"
    >
      {listStatus.map((status) => (
        <SelectItem key={status.id}>{status.label}</SelectItem>
      ))}
    </Select>
  );
}

export default SelectStatus;

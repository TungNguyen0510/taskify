import { Chip } from '@nextui-org/react';

import { useColumnsStore } from '@/stores/columns';
import type { Column } from '@/types/board';

interface StatusChipProps {
  id: string;
}

function StatusChip(props: StatusChipProps) {
  const { id } = props;

  const { columns } = useColumnsStore();

  const getStatusColor = (
    column: Column,
  ): 'success' | 'default' | 'primary' => {
    if (column.isDone) {
      return 'success';
    }
    if (column.isTodo) {
      return 'default';
    }
    return 'primary';
  };

  const statusOptions = columns.map((column) => ({
    uid: column.id,
    name: column.status,
    color: getStatusColor(column),
  }));

  const currentStatus = statusOptions.find((status) => status.uid === id);

  return (
    <div>
      <Chip
        className="capitalize"
        color={currentStatus?.color ?? 'default'}
        size="sm"
        variant="flat"
      >
        {currentStatus?.name}
      </Chip>
    </div>
  );
}
export default StatusChip;

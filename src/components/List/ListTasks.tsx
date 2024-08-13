/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import { useEffect } from 'react';

import { useTasksStore } from '@/stores/tasks';

const columns = [
  {
    key: 'name',
    label: 'NAME',
  },
  {
    key: 'summary',
    label: 'Summary',
  },
  {
    key: 'status',
    label: 'Status',
  },
];

function ListTasks({ params }: { params: { projectId: string } }) {
  const { tasks, fetchListTasks } = useTasksStore();
  useEffect(() => {
    fetchListTasks(params.projectId);
  }, []);

  return (
    <div>
      <div className="h-20 px-6">
        <div className="text-xl font-semibold">List</div>
      </div>
      <div className="px-6">
        <Table aria-label="List tasks">
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key}>{column.label}</TableColumn>
            )}
          </TableHeader>
          <TableBody items={tasks}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ListTasks;

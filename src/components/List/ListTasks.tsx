/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import Icon from '@/components/Icon';
import { useColumnsStore } from '@/stores/columns';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';
import type { Column } from '@/types/board';
import {
  capitalize,
  formatDateFull,
  formatDateMDY,
  isExpiredDate,
} from '@/utils/Helpers';

import AvatarUser from '../AvatarUser';
import ConfirmModal from '../Modal/ConfirmModal';
import TaskDetailsModal from '../Modal/TaskDetailsModal';
import StatusChip from '../StatusChip';

const headers = [
  { name: 'KEY', uid: 'key', sortable: true, minWidth: '100px' },
  { name: 'SUMMARY', uid: 'summary', sortable: true },
  { name: 'STATUS', uid: 'column_id', sortable: true },
  { name: 'ASSIGNEE', uid: 'assignee' },
  { name: 'DUE DATE', uid: 'due_date', sortable: true },
  { name: 'DATE CREATED', uid: 'date_created', sortable: true },
  { name: 'DATE UPDATED', uid: 'date_updated', sortable: true },
  { name: 'REPORTER', uid: 'reporter', minWidth: '300px' },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = [
  'key',
  'summary',
  'column_id',
  'assignee',
  'due_date',
  'reporter',
  'actions',
];

export default function ListTasks({
  params,
}: {
  params: { projectId: string };
}) {
  const { tasks, fetchListTasks, deleteTask } = useTasksStore();
  const { fetchListUsers } = useUsersStore();
  const { columns, fetchListColumns } = useColumnsStore();

  const [isLoading, setIsLoading] = useState(true);

  const [isConfirmDeleteTask, setIsConfirmDeleteTask] =
    useState<boolean>(false);

  const [isOpenTaskDetailsModal, setIsOpenTaskDetailsModal] =
    useState<boolean>(false);

  const [currentTaskId, setCurrentTaskId] = useState<string>('');

  const deleteCurrentTask = async (taskId: string) => {
    try {
      await deleteTask(taskId);
      await fetchListTasks(params.projectId);

      toast.success('Deleted task successful!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      throw new Error('Failed to delete task');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchListUsers();
      await fetchListColumns(params.projectId);

      await fetchListTasks(params.projectId);

      setIsLoading(false);
    };

    fetchData();
  }, []);

  const getStatusColor = (column: Column) => {
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

  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'key',
    direction: 'descending',
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns.size === headers.length) return headers;

    return headers.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns, headers]);

  const filteredItems = React.useMemo(() => {
    let filteredTasks = [...tasks];

    if (hasSearchFilter) {
      filteredTasks = filteredTasks.filter((task) =>
        task.summary.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }
    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredTasks = filteredTasks.filter((task) =>
        Array.from(statusFilter).includes(task.column_id),
      );
    }

    return filteredTasks;
  }, [tasks, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      let cmp;
      if (first < second) {
        cmp = -1;
      } else if (first > second) {
        cmp = 1;
      } else {
        cmp = 0;
      }

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = React.useCallback((task: any, columnKey: any) => {
    const cellValue = task[columnKey];

    switch (columnKey) {
      case 'assignee':
        return (
          <div>
            {task.assignee ? (
              <AvatarUser userId={task.assignee} />
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );
      case 'reporter':
        return <AvatarUser userId={task.reporter} />;
      case 'due_date':
        return (
          <div>
            {task.due_date ? (
              <Tooltip
                showArrow
                color="foreground"
                radius="sm"
                content={`Due date: ${formatDateFull(task.due_date)}`}
              >
                <p
                  className={`w-fit rounded-md px-2 py-1 font-semibold ${isExpiredDate(task.due_date) ? 'bg-red-100 text-red-500' : 'bg-blue-50 text-blue-500'}`}
                >
                  {formatDateMDY(task.due_date)}
                </p>
              </Tooltip>
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );
      case 'date_created':
        return (
          <div>
            {task.date_created ? (
              <Tooltip
                showArrow
                color="foreground"
                radius="sm"
                content={`Date created: ${formatDateFull(task.date_created)}`}
              >
                <p className="w-fit rounded-md bg-zinc-200 px-2 py-1 font-semibold">
                  {formatDateMDY(task.date_created)}
                </p>
              </Tooltip>
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );
      case 'date_updated':
        return (
          <div>
            {task.date_updated ? (
              <Tooltip
                showArrow
                color="foreground"
                radius="sm"
                content={`Date updated: ${formatDateFull(task.date_updated)}`}
              >
                <p className="w-fit rounded-md bg-zinc-200 px-2 py-1 font-semibold">
                  {formatDateMDY(task.date_updated)}
                </p>
              </Tooltip>
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );
      case 'column_id':
        return <StatusChip id={task.column_id} />;
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light">
                  <Icon name="verticalDotIcon" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu>
                <DropdownItem
                  className="font-semibold"
                  onClick={() => {
                    setIsOpenTaskDetailsModal(true);
                    setCurrentTaskId(task.id);
                  }}
                >
                  View
                </DropdownItem>
                <DropdownItem
                  className="font-semibold text-danger"
                  color="danger"
                  onClick={() => {
                    setIsConfirmDeleteTask(true);
                    setCurrentTaskId(task.id);
                  }}
                >
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            className="w-full sm:max-w-[44%]"
            placeholder="Search by summary..."
            startContent={<Icon name="search" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<Icon name="ChevronDownIcon" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<Icon name="ChevronDownIcon" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {headers.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<Icon name="plus" />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {tasks.length} tasks
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    tasks.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="flex items-center justify-between p-2">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [
    selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  const classNames = React.useMemo(
    () => ({
      wrapper: [
        'max-h-[600px]',
        'max-w-5xl',
        'scrollbar-1',
        'min-w-[calc(100vw-18.875em)]',
      ],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: [
        // changing the rows border radius
        // first
        'group-data-[first=true]:first:before:rounded-none',
        'group-data-[first=true]:last:before:rounded-none',
        // middle
        'group-data-[middle=true]:before:rounded-none',
        // last
        'group-data-[last=true]:first:before:rounded-none',
        'group-data-[last=true]:last:before:rounded-none',
      ],
    }),
    [],
  );
  return (
    <>
      <div className="mb-4">
        <div className="text-xl font-semibold">List</div>
      </div>
      <Table
        aria-label="List tasks"
        radius="none"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
        selectedKeys={selectedKeys}
        selectionMode="multiple"
        sortDescriptor={sortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        onSelectionChange={setSelectedKeys}
        onSortChange={setSortDescriptor}
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
              minWidth={column.minWidth ? column.minWidth : null}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          emptyContent="No tasks found"
          items={sortedItems}
          isLoading={isLoading}
          loadingContent={<Spinner label="Loading..." />}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm delete task"
        comfirmMessage="You're about to permanently delete this task, its comments and attachments, and all of its data. If you're not sure, you can resolve or close this task instead."
        okTitle="Delete"
        isOpen={isConfirmDeleteTask}
        onClose={() => setIsConfirmDeleteTask(false)}
        onConfirm={() => {
          deleteCurrentTask(currentTaskId);
          setIsConfirmDeleteTask(false);
        }}
      />

      <TaskDetailsModal
        isOpen={isOpenTaskDetailsModal}
        onClose={() => setIsOpenTaskDetailsModal(false)}
        taskId={currentTaskId}
      />
    </>
  );
}

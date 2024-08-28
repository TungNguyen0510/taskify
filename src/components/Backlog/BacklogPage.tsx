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
  type SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import Icon from '@/components/Icon';
import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';
import type { Column } from '@/types/board';
import type { Task } from '@/types/task';
import {
  capitalize,
  formatDateFull,
  formatDateMDY,
  isExpiredDate,
} from '@/utils/Helpers';

import AvatarUser from '../AvatarUser';
import ConfirmModal from '../Modal/ConfirmModal';
import CreateTaskModal from '../Modal/CreateTaskModal';
import TaskDetailsModal from '../Modal/TaskDetailsModal';
import StatusChip from '../StatusChip';

const headers = [
  { name: 'KEY', uid: 'key', sortable: true, minWidth: '100px' },
  { name: 'SUMMARY', uid: 'summary', sortable: true },
  { name: 'STATUS', uid: 'column_id', sortable: true },
  { name: 'ASSIGNEE', uid: 'assignee' },
  { name: 'ACTIONS', uid: 'actions' },
];

const INITIAL_VISIBLE_COLUMNS = [
  'key',
  'summary',
  'column_id',
  'assignee',
  'actions',
];

export default function BacklogPage({
  params,
}: {
  params: { projectId: string };
}) {
  const { tasks, fetchListTasks, deleteTask, updateTaskDetails } =
    useTasksStore();
  const { fetchListUsers } = useUsersStore();
  const { columns, fetchListColumns } = useColumnsStore();
  const { fetchCurrentProject } = useProjectsStore();

  const [isLoading, setIsLoading] = useState(true);

  const [isConfirmDeleteTask, setIsConfirmDeleteTask] =
    useState<boolean>(false);

  const [isOpenTaskDetailsModal, setIsOpenTaskDetailsModal] =
    useState<boolean>(false);

  const [isOpenMoveToBoardModal, setIsOpenMoveToBoardModal] =
    useState<boolean>(false);

  const [isOpenCreateTaskModal, setIsOpenCreateTaskModal] =
    useState<boolean>(false);

  const [currentTaskId, setCurrentTaskId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchListUsers(),
        fetchCurrentProject(params.projectId),
        fetchListColumns(params.projectId),
        fetchListTasks(params.projectId),
      ]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const moveToBoard = async (taskId: string) => {
    try {
      await updateTaskDetails(taskId, {
        isBacklog: false,
      });

      await fetchListTasks(params.projectId);

      toast.success('Move to board successful!', {
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
      toast.error('Move to board failed!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      throw new Error('Failed to move to board');
    }
  };

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
      toast.error('Deleted task failed!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      throw new Error('Failed to delete task');
    }
  };

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

  const [filterValue, setFilterValue] = useState('');
  // const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = useState(
    new Set(INITIAL_VISIBLE_COLUMNS),
  );
  const [statusFilter, setStatusFilter] = useState(
    new Set(columns.map((item) => item.id)),
  );

  useEffect(() => {
    setStatusFilter(new Set(columns.map((item) => item.id)));
  }, [columns]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'key',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = useMemo(() => {
    if (visibleColumns.size === headers.length) return headers;

    return headers.filter((column) => visibleColumns.has(column.uid));
  }, [visibleColumns, headers]);

  const filteredItems = useMemo(() => {
    let filteredTasks = [...tasks];

    filteredTasks = filteredTasks.filter((task) => task.isBacklog === true);

    if (hasSearchFilter) {
      filteredTasks = filteredTasks.filter((task) =>
        task.summary.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    filteredTasks = filteredTasks.filter((task) =>
      Array.from(statusFilter).includes(task.column_id),
    );

    return filteredTasks;
  }, [tasks, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Task];
      const second = b[sortDescriptor.column as keyof Task];
      let cmp;
      if (first === null || second === null) {
        cmp = 0;
      } else if (first < second) {
        cmp = -1;
      } else if (first > second) {
        cmp = 1;
      } else {
        cmp = 0;
      }

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const renderCell = useCallback((task: any, columnKey: any) => {
    const cellValue = task[columnKey];

    switch (columnKey) {
      case 'key':
        return (
          <div className="flex items-center gap-1">
            <div className="size-4">
              <Icon name="checkSquare" />
            </div>
            <div
              className={`text-xs text-zinc-500 ${task.isDone ? 'text-zinc-300 line-through' : ''}`}
            >
              {useProjectsStore.getState().currentProject?.key}-{task.key}
            </div>
          </div>
        );
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
                  Details
                </DropdownItem>
                <DropdownItem
                  className="font-semibold"
                  onClick={() => {
                    setIsOpenMoveToBoardModal(true);
                    setCurrentTaskId(task.id);
                  }}
                >
                  Move to Board
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

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            className="w-full sm:max-w-[34%]"
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
                onSelectionChange={(keys: 'all' | Set<React.Key>) =>
                  setStatusFilter(keys as any)
                }
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
                onSelectionChange={(keys: 'all' | Set<React.Key>) =>
                  setVisibleColumns(keys as any)
                }
              >
                {headers.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {filteredItems.length} tasks
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

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between p-2">
        {/* <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span> */}
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
    // selectedKeys,
    filteredItems.length,
    page,
    pages,
    onPreviousPage,
    onNextPage,
  ]);

  const classNames = useMemo(
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
        <div className="text-xl font-semibold">Backlog</div>
      </div>
      <Table
        aria-label="List tasks"
        radius="none"
        isStriped
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        classNames={classNames}
        // selectedKeys={selectedKeys}
        // selectionMode="multiple"
        sortDescriptor={sortDescriptor as SortDescriptor}
        topContent={topContent}
        topContentPlacement="outside"
        // onSelectionChange={(keys: 'all' | Set<React.Key>) => {
        //   setSelectedKeys(keys as any);
        // }}
        onSortChange={(descriptor: SortDescriptor) =>
          setSortDescriptor(descriptor as any)
        }
      >
        <TableHeader columns={headerColumns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === 'actions' ? 'center' : 'start'}
              allowsSorting={column.sortable}
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

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm move to board"
        comfirmMessage="Are you sure you want to move this task to the board?"
        okTitle="Move"
        okBtnColor="primary"
        isOpen={isOpenMoveToBoardModal}
        onClose={() => setIsOpenMoveToBoardModal(false)}
        onConfirm={() => {
          moveToBoard(currentTaskId);
          setIsOpenMoveToBoardModal(false);
        }}
      />

      <CreateTaskModal
        isOpen={isOpenCreateTaskModal}
        onClose={() => {
          setIsOpenCreateTaskModal(false);
          fetchListTasks(params.projectId);
        }}
        projectId={params.projectId}
      />
    </>
  );
}

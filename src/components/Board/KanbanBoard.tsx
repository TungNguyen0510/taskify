/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-param-reassign */

'use client';

import {
  closestCorners,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  ScrollShadow,
  Spinner,
} from '@nextui-org/react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import ColumnContainer from '@/components/Board/ColumnContainer';
import TaskCard from '@/components/Board/TaskCard';
import Icon from '@/components/Icon';
import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';
import type { Column, NewColumn } from '@/types/board';
import type { NewTask, Task } from '@/types/task';
import { capitalize, resetAllStores } from '@/utils/Helpers';

function KanbanBoard({ params }: { params: { projectId: string } }) {
  const session = useSession();
  const userId = session?.data?.user.id;
  const {
    columns,
    fetchListColumns,
    createColumn,
    updateStatusColumn,
    updatePositionColumn,
    deleteColumn,
  } = useColumnsStore();
  const {
    tasks,
    fetchListTasks,
    createNewTask,
    updatePositionTask,
    updateTaskDetails,
    deleteTask,
  } = useTasksStore();
  const { currentProject, fetchCurrentProject, updateCurrentProject } =
    useProjectsStore();
  const { fetchListUsers } = useUsersStore();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [createColumnStatus, setCreateColumnStatus] = useState<string>('');
  const [isCreatingColumn, setIsCreatingColumn] = useState<boolean>(false);

  const [filterValue, setFilterValue] = useState('');

  const doneColumnId = columns.find((col) => col.isDone === true)?.id;

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
  }, []);

  const [statusFilter, setStatusFilter] = useState(
    new Set(columns.map((item) => item.id)),
  );

  const statusOptions = columns.map((column) => ({
    uid: column.id,
    name: column.status,
  }));

  useEffect(() => {
    setStatusFilter(new Set(columns.map((item) => item.id)));
  }, [columns]);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredTasks = [...tasks];

    filteredTasks = filteredTasks.filter((task) => task.isBacklog !== true);

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

  const filteredColumns = useMemo(() => {
    let filteredList = [...columns];

    filteredList = filteredList.filter((col) =>
      Array.from(statusFilter).includes(col.id),
    );

    return filteredList;
  }, [columns, statusFilter]);

  const columnsId = useMemo(
    () => columns.map((col) => col.id),
    [filteredColumns],
  );

  useEffect(() => {
    const fetchData = async (projectId: string) => {
      setIsLoading(true);
      resetAllStores();
      Promise.all([
        fetchListUsers(),
        fetchCurrentProject(projectId),
        fetchListColumns(projectId),
        fetchListTasks(projectId),
      ]);

      setIsLoading(false);
    };

    fetchData(params.projectId);
  }, []);

  const createNewColumn = async () => {
    setIsCreatingColumn(true);

    const lastPos =
      columns.sort((a, b) => a.pos - b.pos)[columns.length - 1]?.pos ?? 0;

    const columnToAdd: NewColumn = {
      status: createColumnStatus,
      pos: lastPos + 1,
      project_id: params.projectId,
    };

    try {
      setIsLoading(true);
      await createColumn(columnToAdd);

      setCreateColumnStatus('');

      await fetchListColumns(params.projectId);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      throw new Error('Failed to create new column');
    }
  };

  const deleteCurrentColumn = async (columnId: string) => {
    try {
      setIsLoading(true);

      await deleteColumn(columnId);

      useColumnsStore.getState().reset();
      useTasksStore.getState().reset();

      await fetchListColumns(params.projectId);
      await fetchListTasks(params.projectId);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      throw new Error('Failed to delete column');
    }
  };

  const updateCurrentStatusColumn = async (
    columnId: string,
    status: string,
  ) => {
    if (status === '') return;
    try {
      setIsLoading(true);

      await updateStatusColumn(columnId, status);
      await fetchListColumns(params.projectId);

      setIsLoading(false);
    } catch (e) {
      setIsLoading(false);
      throw new Error('Failed to update status column');
    }
  };

  const createTask = async (columnId: string, summary: string) => {
    if (!userId || currentProject === null) return;

    const currentColumnTasks = filteredItems
      .filter((task) => task.column_id === columnId)
      .sort((a, b) => a.pos - b.pos);

    const lastPos = currentColumnTasks[currentColumnTasks.length - 1]?.pos ?? 0;

    const newTask: NewTask = {
      reporter: userId,
      project_id: params.projectId,
      column_id: columnId,
      summary,
      key: `${currentProject.tasks_count + 1}`,
      pos: lastPos + 1024,
    };

    try {
      await createNewTask(newTask);

      await updateCurrentProject(params.projectId, {
        tasks_count: currentProject.tasks_count + 1,
      });
      await fetchCurrentProject(params.projectId);
      await fetchListTasks(params.projectId);
    } catch (e) {
      throw new Error('Failed to create new task');
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
      toast.error('Failed to delete task!', {
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

  // DND Handlers
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 100, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Drag & Drop Event Handlers

  const onDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

    const overColumnIndex = columns.findIndex((col) => col.id === overId);

    const activePos = columns[activeColumnIndex]?.pos;
    const overPos = columns[overColumnIndex]?.pos;

    if (!activePos || !overPos) return;

    try {
      await updatePositionColumn(activeId, overPos);
      await updatePositionColumn(overId, activePos);

      await fetchListColumns(params.projectId);
    } catch (e) {
      throw new Error('Failed to update position column');
    }
  };

  const onDragOver = async (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      const activeTaskIndex = filteredItems.findIndex(
        (task) => task.id === activeId,
      );

      const overTaskIndex = filteredItems.findIndex(
        (task) => task.id === overId,
      );

      try {
        await updatePositionTask(
          activeId,
          filteredItems[activeTaskIndex]!.column_id,
          // filteredItems[overTaskIndex]!.pos,
        );
        await updatePositionTask(
          overId,
          filteredItems[overTaskIndex]!.column_id,
          // filteredItems[activeTaskIndex]!.pos,
        );

        if (filteredItems[overTaskIndex]!.column_id === doneColumnId) {
          await updateTaskDetails(filteredItems[activeTaskIndex]!.column_id, {
            isDone: true,
          });

          await fetchListTasks(params.projectId);
        }
      } catch (e) {
        throw new Error('Failed to update position task');
      }
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverAColumn) {
      const activeTaskIndex = filteredItems.findIndex(
        (task) => task.id === activeId,
      );

      try {
        if (filteredItems[activeTaskIndex]) {
          // caculate new pos

          await Promise.all([
            updatePositionTask(activeId, overId),
            fetchListTasks(params.projectId),
          ]);
        }
      } catch (e) {
        throw new Error('Failed to update position task');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-56px)] w-full min-w-[calc(100vw-256px)] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!userId) {
    return notFound();
  }

  return (
    <>
      <div className="flex flex-col gap-2 px-4 pb-2">
        <div className="text-xl font-semibold">Board</div>

        <div className="flex items-center gap-4">
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
          </div>
        </div>
      </div>
      <ScrollShadow
        orientation="horizontal"
        className="scrollbar-1 flex min-h-[calc(100vh-56px-80px-16px)] w-full gap-4 overflow-y-hidden px-4 py-2"
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDragOver={onDragOver}
        >
          <div className="scrollbar-1 flex gap-4 overflow-y-auto px-1 pb-2">
            <SortableContext items={columnsId}>
              {filteredColumns
                .sort((a, b) => a.pos - b.pos)
                .map((col) => (
                  <ColumnContainer
                    column={col}
                    key={col.id}
                    tasks={filteredItems
                      .filter((task) => task.column_id === col.id)
                      .sort((a, b) => a.pos - b.pos)}
                    deleteColumn={deleteCurrentColumn}
                    updateStatusColumn={updateCurrentStatusColumn}
                    createTask={createTask}
                    deleteTask={deleteCurrentTask}
                  />
                ))}
            </SortableContext>

            {isCreatingColumn ? (
              <div className="flex min-w-64 flex-col gap-1 pr-20">
                <Input
                  autoFocus
                  type="text"
                  size="lg"
                  variant="bordered"
                  radius="sm"
                  value={createColumnStatus}
                  maxLength={30}
                  className="min-w-64"
                  onChange={(e) => setCreateColumnStatus(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    createNewColumn();
                    setIsCreatingColumn(false);
                  }}
                />
                <div className="flex w-full min-w-64 justify-end gap-2">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="solid"
                    aria-label="more"
                    className="h-8"
                    onClick={() => {
                      setCreateColumnStatus('');
                      setIsCreatingColumn(false);
                    }}
                  >
                    <Icon name="close" />
                  </Button>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="solid"
                    aria-label="more"
                    className="h-8"
                    isDisabled={!createColumnStatus}
                    onClick={() => {
                      createNewColumn();
                      setIsCreatingColumn(false);
                    }}
                  >
                    <Icon name="checked" />
                  </Button>
                </div>
              </div>
            ) : (
              <Button
                color="default"
                variant="bordered"
                radius="sm"
                className="mr-10 min-w-36"
                startContent={<Icon name="plus" />}
                onClick={() => setIsCreatingColumn(true)}
              >
                Add column
              </Button>
            )}

            <DragOverlay adjustScale={false}>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  tasks={filteredItems
                    .filter((task) => task.column_id === activeColumn.id)
                    .sort((a, b) => a.pos - b.pos)}
                  deleteColumn={deleteCurrentColumn}
                  updateStatusColumn={updateCurrentStatusColumn}
                  createTask={createTask}
                  deleteTask={deleteCurrentTask}
                />
              )}

              {activeTask && (
                <TaskCard task={activeTask} deleteTask={deleteCurrentTask} />
              )}
            </DragOverlay>
          </div>
        </DndContext>
      </ScrollShadow>
    </>
  );
}

export default KanbanBoard;

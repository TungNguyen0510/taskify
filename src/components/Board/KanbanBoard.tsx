/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-console */
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
import { Button, Input, ScrollShadow, Spinner } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useEffect, useMemo, useState } from 'react';

import ColumnContainer from '@/components/Board/ColumnContainer';
import TaskCard from '@/components/Board/TaskCard';
import Icon from '@/components/Icon';
import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import type { Column, NewColumn, NewTask, Task } from '@/types/board';
import { resetAllStores } from '@/utils/Helpers';

function KanbanBoard({ params }: { params: { projectId: string } }) {
  const t = useTranslations('KanbanBoard');

  const {
    columns,
    fetchListColumns,
    createColumn,
    updateTitleColumn,
    updatePositionColumn,
    deleteColumn,
  } = useColumnsStore();
  const { tasks, fetchListTasks, createNewTask, updatePositionTask } =
    useTasksStore();
  const { currentProject, fetchCurrentProject } = useProjectsStore();

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const [createColumnTitle, setCreateColumnTitle] = useState<string>('');
  const [isCreatingColumn, setIsCreatingColumn] = useState<boolean>(false);

  const fetchData = (projectId: string) => {
    fetchCurrentProject(projectId);
    fetchListColumns(projectId);
    fetchListTasks(projectId);
  };

  useEffect(() => {
    setIsLoading(true);
    resetAllStores();
    fetchData(params.projectId);
    setIsLoading(false);
  }, []);

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

  const createNewColumn = async () => {
    setIsCreatingColumn(true);

    const lastPos =
      columns.sort((a, b) => a.pos - b.pos)[columns.length - 1]?.pos ?? 0;

    const columnToAdd: NewColumn = {
      title: createColumnTitle,
      pos: lastPos + 1,
      project_id: params.projectId,
    };

    try {
      setIsLoading(true);
      await createColumn(columnToAdd);

      setCreateColumnTitle('');

      await fetchListColumns(params.projectId);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
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
      console.log(e);
      setIsLoading(false);
    }

    // need tranfer tasks to other column
  };

  const updateCurrentTitleColumn = async (columnId: string, title: string) => {
    if (title === '') return;
    try {
      setIsLoading(true);

      await updateTitleColumn(columnId, title);
      await fetchListColumns(params.projectId);

      setIsLoading(false);
    } catch (e) {
      console.log(e);
      setIsLoading(false);
    }
  };

  const createTask = async (columnId: string, summary: string) => {
    const currentColumnTasks = tasks
      .filter((task) => task.column_id === columnId)
      .sort((a, b) => a.pos - b.pos);

    const lastPos = currentColumnTasks[currentColumnTasks.length - 1]?.pos ?? 0;

    const newTask: NewTask = {
      project_id: params.projectId,
      column_id: columnId,
      summary,
      pos: lastPos + 1024,
    };

    try {
      await createNewTask(newTask);
      await fetchListTasks(params.projectId);
    } catch (e) {
      console.log(e);
    }
  };

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
      console.log(e);
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
      const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

      const overTaskIndex = tasks.findIndex((task) => task.id === overId);

      try {
        if (
          tasks[activeTaskIndex] &&
          tasks[overTaskIndex] &&
          tasks[activeTaskIndex]!.column_id !== tasks[overTaskIndex]!.column_id
        ) {
          await updatePositionTask(
            activeId,
            tasks[overTaskIndex]!.column_id,
            tasks[overTaskIndex]!.pos,
          );

          await fetchListTasks(params.projectId);
          return;
        }

        await updatePositionTask(
          activeId,
          tasks[activeTaskIndex]!.column_id,
          tasks[overTaskIndex]!.pos,
        );
        await updatePositionTask(
          overId,
          tasks[overTaskIndex]!.column_id,
          tasks[activeTaskIndex]!.pos,
        );

        await fetchListTasks(params.projectId);
      } catch (e) {
        console.log(e);
      }
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverAColumn) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

      try {
        if (tasks[activeTaskIndex]) {
          // caculate new pos

          await updatePositionTask(activeId, overId);
          await fetchListTasks(params.projectId);
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex min-h-[calc(100vh-56px)] w-full min-w-[calc(100vw-256px)] items-center justify-center">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="h-20 px-6">
            {currentProject && (
              <div className="text-xl font-semibold">
                {currentProject?.title} Board
              </div>
            )}
          </div>
          <ScrollShadow
            orientation="horizontal"
            className="scrollbar-1 flex min-h-[calc(100vh-56px-80px-16px)] w-full gap-4 px-4 py-2"
          >
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className="flex gap-4">
                <SortableContext items={columnsId}>
                  {columns
                    .sort((a, b) => a.pos - b.pos)
                    .map((col) => (
                      <ColumnContainer
                        column={col}
                        key={col.id}
                        tasks={tasks
                          .filter((task) => task.column_id === col.id)
                          .sort((a, b) => a.pos - b.pos)}
                        deleteColumn={deleteCurrentColumn}
                        updateTitleColumn={updateCurrentTitleColumn}
                        createTask={createTask}
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
                      value={createColumnTitle}
                      maxLength={30}
                      className="min-w-64"
                      onChange={(e) => setCreateColumnTitle(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;
                        createNewColumn();
                        setIsCreatingColumn(false);
                      }}
                    />
                    <div className="flex w-full justify-end gap-2">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="shadow"
                        aria-label="more"
                        className="h-8"
                        onClick={() => {
                          setCreateColumnTitle('');
                          setIsCreatingColumn(false);
                        }}
                      >
                        <Icon name="close" />
                      </Button>
                      <Button
                        isIconOnly
                        color="primary"
                        variant="shadow"
                        aria-label="more"
                        className="h-8"
                        isDisabled={!createColumnTitle}
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
                    {t('add_column')}
                  </Button>
                )}

                <DragOverlay adjustScale={false}>
                  {activeColumn && (
                    <ColumnContainer
                      column={activeColumn}
                      tasks={tasks
                        .filter((task) => task.column_id === activeColumn.id)
                        .sort((a, b) => a.pos - b.pos)}
                      deleteColumn={deleteCurrentColumn}
                      updateTitleColumn={updateCurrentTitleColumn}
                      createTask={createTask}
                    />
                  )}

                  {activeTask && <TaskCard task={activeTask} />}
                </DragOverlay>
              </div>
            </DndContext>
          </ScrollShadow>
        </>
      )}
    </div>
  );
}

export default KanbanBoard;

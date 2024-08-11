/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

'use client';

import {
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  useSensor,
} from '@dnd-kit/core';
import {
  horizontalListSortingStrategy,
  SortableContext,
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

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
  ];

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

  const createTask = async (columnId: string, name: string) => {
    const currentColumnTasks = tasks
      .filter((task) => task.column_id === columnId)
      .sort((a, b) => a.pos - b.pos);

    const lastPos = currentColumnTasks[currentColumnTasks.length - 1]?.pos ?? 0;

    const newTask: NewTask = {
      project_id: params.projectId,
      column_id: columnId,
      name,
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
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
      return;
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    const activeColumnIndex = columns.findIndex(
      (col) => col.id === activeColumnId,
    );

    const overColumnIndex = columns.findIndex((col) => col.id === overColumnId);

    const activePos = columns[activeColumnIndex]?.pos;
    const overPos = columns[overColumnIndex]?.pos;

    if (!activePos || !overPos) return;

    try {
      await updatePositionColumn(activeColumnId, overPos);
      await updatePositionColumn(overColumnId, activePos);

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

      const isBetweenTwoTasks =
        overTaskIndex > 0 &&
        tasks[overTaskIndex - 1]!.pos < tasks[activeTaskIndex]!.pos &&
        tasks[overTaskIndex]!.pos > tasks[activeTaskIndex]!.pos;

      if (isBetweenTwoTasks) {
        console.log('activeTask đang kéo vào giữa hai task khác');
      }

      try {
        if (
          tasks[activeTaskIndex]!.column_id === tasks[overTaskIndex]!.column_id
        ) {
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
        }
      } catch (e) {
        console.log(e);
      }
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverAColumn) {
      const activeTaskIndex = tasks.findIndex((task) => task.id === activeId);

      console.log('activeTaskIndex: ', activeTaskIndex);
      console.log('overTaskId: ', overId);

      // try {
      //   if (tasks[activeTaskIndex]!.column_id !== overId) {
      //     await updatePositionTask(activeId, overId);
      //     // await updatePositionTask(
      //     //   overTaskId,
      //     //   tasks[overTaskIndex]!.column_id,
      //     //   tasks[activeTaskIndex]!.pos,
      //     // );

      //     await fetchListTasks(params.projectId);
      //   }
      // } catch (e) {
      //   console.log(e);
      // }

      // setTasks((_tasks) => {
      //   const activeTaskIndex = _tasks.findIndex(
      //     (col) => col.id === activeTaskId,
      //   );

      //   _tasks[activeTaskIndex]!.columnId = overTaskId;

      //   return arrayMove(_tasks, activeTaskIndex, activeTaskIndex);
      // });
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
                {currentProject?.key} Board
              </div>
            )}
          </div>
          <ScrollShadow
            orientation="horizontal"
            className="scrollbar-1 flex min-h-[calc(100vh-56px-80px-16px)] w-full gap-4 px-4 py-2"
          >
            <DndContext
              sensors={sensors}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
              onDragOver={onDragOver}
            >
              <div className="flex gap-4">
                <SortableContext
                  items={columnsId}
                  strategy={horizontalListSortingStrategy}
                >
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

                <DragOverlay>
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

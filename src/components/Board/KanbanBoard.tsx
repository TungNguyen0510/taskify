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
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { Button, ScrollShadow } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import ColumnContainer from '@/components/Board/ColumnContainer';
import TaskCard from '@/components/Board/TaskCard';
import Icon from '@/components/Icon';
import type { Column, Id, Task } from '@/types/board';
import { generateId } from '@/utils/Helpers';

function KanbanBoard() {
  const t = useTranslations('KanbanBoard');

  const [columns, setColumns] = useState<Column[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = [
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  ];

  const createNewColumn = () => {
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };

    setColumns([...columns, columnToAdd]);
  };

  const deleteColumn = (id: Id) => {
    const filteredColumns = columns.filter((col) => col.id !== id);
    setColumns(filteredColumns);

    const newTask = tasks.filter((task) => task.columnId !== id);
    setTasks(newTask);
  };

  const updateColumn = (id: Id, title: string) => {
    const newColumn = columns.map((col) => {
      if (col.id !== id) return col;

      return { ...col, title };
    });
    setColumns(newColumn);
  };

  const createTask = (columnId: Id) => {
    const newTask: Task = {
      id: generateId(),
      columnId,
      name: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  };

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === 'Column') {
      setActiveColumn(event.active.data.current.column);
    }

    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;

    if (!over) return;

    const activeColumnId = active.id;
    const overColumnId = over.id;

    if (activeColumnId === overColumnId) return;

    setColumns((_columns) => {
      const activeColumnIndex = _columns.findIndex(
        (col) => col.id === activeColumnId,
      );

      const overColumnIndex = _columns.findIndex(
        (col) => col.id === overColumnId,
      );

      return arrayMove(_columns, activeColumnIndex, overColumnIndex);
    });
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = active.id;
    const overTaskId = over.id;

    if (activeTaskId === overTaskId) return;

    const isActiveATask = active.data.current?.type === 'Task';
    const isOverATask = over.data.current?.type === 'Task';

    if (!isActiveATask) return;

    if (isActiveATask && isOverATask) {
      setTasks((_tasks) => {
        const activeTaskIndex = _tasks.findIndex(
          (col) => col.id === activeTaskId,
        );

        const overTaskIndex = _tasks.findIndex((col) => col.id === overTaskId);

        _tasks[activeTaskIndex]!.columnId = _tasks[overTaskIndex]!.columnId;

        return arrayMove(_tasks, activeTaskIndex, overTaskIndex);
      });
    }

    const isOverAColumn = over.data.current?.type === 'Column';

    if (isActiveATask && isOverAColumn) {
      setTasks((_tasks) => {
        const activeTaskIndex = _tasks.findIndex(
          (col) => col.id === activeTaskId,
        );

        _tasks[activeTaskIndex]!.columnId = overTaskId;

        return arrayMove(_tasks, activeTaskIndex, activeTaskIndex);
      });
    }
  };

  return (
    <ScrollShadow
      orientation="horizontal"
      className="scrollbar-1 flex min-h-[calc(100vh-56px-80px-16px)] w-full gap-4 px-6 py-2"
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="flex gap-4">
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <ColumnContainer
                column={col}
                key={col.id}
                tasks={tasks.filter((task) => task.columnId === col.id)}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
              />
            ))}
          </SortableContext>

          <Button
            color="default"
            variant="bordered"
            radius="sm"
            className="min-w-36"
            startContent={<Icon name="plus" />}
            onClick={createNewColumn}
          >
            {t('add_column')}
          </Button>

          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                tasks={[]}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
              />
            )}

            {activeTask && <TaskCard task={activeTask} />}
          </DragOverlay>
        </div>
      </DndContext>
    </ScrollShadow>
  );
}

export default KanbanBoard;

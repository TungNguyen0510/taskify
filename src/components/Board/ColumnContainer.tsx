import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button, Card, Input } from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import TaskCard from '@/components/Board/TaskCard';
import Icon from '@/components/Icon';
import type { Column, Id, Task } from '@/types/board';

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  deleteColumn: (id: Id) => void;
  updateColumn(id: Id, title: string): void;
  createTask: (columnId: Id) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const t = useTranslations('ColumnContainer');

  const { column, tasks, deleteColumn, updateColumn, createTask } = props;

  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="flex h-[400px] max-h-full w-64 min-w-64 flex-col gap-2 rounded-md border-2 border-blue-500 bg-slate-50 opacity-30"
      />
    );
  }
  return (
    <Card
      ref={setNodeRef}
      style={style}
      shadow="sm"
      className="flex h-[350px] max-h-[calc(100vh-56px-80px-16px-16px)] w-64 min-w-64 flex-col gap-2 rounded-md bg-slate-50"
    >
      <div
        {...attributes}
        {...listeners}
        className="flex justify-between gap-1 bg-slate-200 p-2"
      >
        <div className="flex items-center gap-2">
          <div className="flex size-5 items-center justify-center rounded-full bg-gray-500 p-1 text-tiny text-white">
            {tasks?.length}
          </div>
          {!editMode && (
            <div
              onClick={() => setEditMode(true)}
              aria-hidden="true"
              className="font-semibold hover:underline"
            >
              {column.title}
            </div>
          )}
          {editMode && (
            <Input
              autoFocus
              type="text"
              size="sm"
              variant="bordered"
              radius="sm"
              value={column.title}
              maxLength={30}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                setEditMode(false);
              }}
            >
              {column.title}
            </Input>
          )}
        </div>
        <Button
          isIconOnly
          color="primary"
          variant="light"
          aria-label="more"
          className="h-8"
          onClick={() => deleteColumn(column.id)}
        >
          <Icon name="threedot" />
        </Button>
      </div>
      <div className="scrollbar-2 flex grow flex-col gap-2 overflow-y-auto overflow-x-hidden p-2">
        <SortableContext items={tasksIds}>
          {tasks?.map((task) => <TaskCard key={task.id} task={task} />)}
        </SortableContext>
      </div>
      <div className="flex w-full justify-end p-2">
        <Button
          color="default"
          variant="bordered"
          radius="sm"
          className="w-fit"
          startContent={<Icon name="plus" />}
          onClick={() => createTask(column.id)}
        >
          {t('add_task')}
        </Button>
      </div>
    </Card>
  );
}

export default ColumnContainer;

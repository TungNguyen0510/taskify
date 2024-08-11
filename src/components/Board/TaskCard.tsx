import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardHeader } from '@nextui-org/react';

import type { Task } from '@/types/board';

interface TaskCardProps {
  task: Task;
}

const TaskCard = (props: TaskCardProps) => {
  const { task } = props;

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <Card
        ref={setNodeRef}
        style={style}
        // {...listeners}
        // {...attributes}
        radius="sm"
        shadow="sm"
        className="min-h-20 rounded-sm border border-blue-500 opacity-80"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      radius="sm"
      shadow="sm"
      className="h-fit min-h-20 rounded-sm hover:bg-blue-100"
    >
      <CardHeader>
        <p className="text-pretty break-all text-small hover:underline">
          {task.name}
        </p>
      </CardHeader>
    </Card>
  );
};

export default TaskCard;

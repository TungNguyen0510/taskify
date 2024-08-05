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
        {...listeners}
        {...attributes}
        radius="sm"
        shadow="sm"
        className="min-h-20 rounded-sm border border-blue-500 opacity-30"
      />
    );
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      key={task.id}
      radius="sm"
      shadow="sm"
      className="min-h-20 rounded-sm"
    >
      <CardHeader>
        <div className="text-small hover:underline">{task.name}</div>
      </CardHeader>
    </Card>
  );
};

export default TaskCard;

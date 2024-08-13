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

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      shadow="sm"
      className={`h-fit min-h-20 rounded-md ${
        isDragging ? 'border border-blue-500 opacity-30' : ''
      }`}
    >
      <CardHeader>
        <p className="select-none text-pretty break-all text-small hover:underline">
          {task.summary}
        </p>
      </CardHeader>
    </Card>
  );
};

export default TaskCard;

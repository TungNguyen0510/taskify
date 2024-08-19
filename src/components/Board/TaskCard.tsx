'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
} from '@nextui-org/react';
import { useState } from 'react';

import type { Task } from '@/types/board';
import { formatDateFull, formatDateMD, isExpiredDate } from '@/utils/Helpers';

import Icon from '../Icon';
import ConfirmModal from '../Modal/ConfirmModal';
import TaskDetailsModal from '../Modal/TaskDetailsModal';
import UserAssignee from '../UserAssignee';

interface TaskCardProps {
  task: Task;
  deleteTask: (taskId: string) => void;
}

const TaskCard = (props: TaskCardProps) => {
  const { task, deleteTask } = props;

  const [isConfirmDeleteTask, setIsConfirmDeleteTask] =
    useState<boolean>(false);

  const [isOpenTaskDetailsModal, setIsOpenTaskDetailsModal] =
    useState<boolean>(false);

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
    <>
      <div aria-hidden="true" onClick={() => setIsOpenTaskDetailsModal(true)}>
        <Card
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          shadow="sm"
          isHoverable
          className={`h-fit min-h-24 rounded-md ${
            isDragging ? 'border border-blue-500 opacity-30' : ''
          }`}
        >
          <div className="flex w-full gap-2 p-2">
            <div className="w-full">
              <p className="select-none text-pretty break-words text-small hover:underline">
                {task.summary}
              </p>
            </div>
            <div>
              <Dropdown placement="bottom-start" className="w-[20px]">
                <DropdownTrigger>
                  <Button
                    isIconOnly
                    color="default"
                    variant="light"
                    aria-label="more"
                    className="h-8"
                  >
                    <Icon name="threedot" />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Column Actions">
                  <DropdownItem
                    onClick={() => setIsConfirmDeleteTask(true)}
                    className="font-semibold text-danger"
                    color="danger"
                  >
                    Delete
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          </div>
          {task.due_date && (
            <div className="px-2">
              <Tooltip
                showArrow
                color="foreground"
                radius="sm"
                content={`Due date: ${formatDateFull(task.due_date)}`}
              >
                <p
                  className={`w-fit rounded-md px-1 py-0.5 text-xs font-semibold ${isExpiredDate(task.due_date) ? 'bg-red-100 text-red-500' : 'bg-blue-50 text-blue-500'}`}
                >
                  {formatDateMD(task.due_date)}
                </p>
              </Tooltip>
            </div>
          )}
          <div className="flex items-center justify-between gap-2 p-2">
            <div className="flex gap-1">
              <div className="size-4">
                <Icon name="checkSquare" />
              </div>
              <div className="text-xs text-zinc-500">{task.key}</div>
            </div>
            <div>
              <UserAssignee user={task.assignee} />
            </div>
          </div>
        </Card>
      </div>

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm delete task"
        comfirmMessage="You're about to permanently delete this task, its comments and attachments, and all of its data. If you're not sure, you can resolve or close this task instead."
        okTitle="Delete"
        isOpen={isConfirmDeleteTask}
        onClose={() => setIsConfirmDeleteTask(false)}
        onConfirm={() => {
          deleteTask(task.id);
          setIsConfirmDeleteTask(false);
        }}
      />

      <TaskDetailsModal
        isOpen={isOpenTaskDetailsModal}
        onClose={() => setIsOpenTaskDetailsModal(false)}
        taskId={task.id}
      />
    </>
  );
};

export default TaskCard;

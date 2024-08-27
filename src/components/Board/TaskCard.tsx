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
import { toast } from 'react-toastify';

import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import type { Task } from '@/types/task';
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

  const { currentProject } = useProjectsStore();

  const { updateTaskDetails, fetchListTasks } = useTasksStore();

  const projectKey = currentProject?.key;

  const [isConfirmDeleteTask, setIsConfirmDeleteTask] =
    useState<boolean>(false);

  const [isOpenTaskDetailsModal, setIsOpenTaskDetailsModal] =
    useState<boolean>(false);

  const [isOpenMoveToBacklogModal, setIsOpenMoveToBacklogModal] =
    useState<boolean>(false);

  const moveToBacklog = async (taskId: string) => {
    try {
      await updateTaskDetails(taskId, {
        isBacklog: true,
      });

      await fetchListTasks(task.project_id);

      toast.success('Move to backlog successful!', {
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
      toast.error('Move to backlog failed!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      throw new Error('Failed to move to backlog');
    }
  };

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
    transform: CSS.Translate.toString(transform),
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        shadow="sm"
        isHoverable
        className={`flex min-h-24 rounded-md ${
          isDragging ? 'border border-blue-500 opacity-30' : ''
        }`}
      >
        <div className="flex w-full gap-2 p-2">
          <div className="w-full">
            <p className="line-clamp-4 max-w-[190px] select-none text-pretty break-words text-small hover:underline">
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
                  onClick={() => setIsOpenTaskDetailsModal(true)}
                  className="font-semibold"
                  color="default"
                >
                  Details
                </DropdownItem>
                <DropdownItem
                  className="font-semibold"
                  onClick={() => {
                    setIsOpenMoveToBacklogModal(true);
                  }}
                >
                  Move to Backlog
                </DropdownItem>
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
            <div
              className={`text-xs text-zinc-500 ${task.isDone ? 'text-zinc-300 line-through' : ''}`}
            >
              {projectKey}-{task.key}
            </div>
          </div>
          <div>
            <UserAssignee id={task.assignee} />
          </div>
        </div>
      </Card>

      <ConfirmModal
        size="2xl"
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm delete task"
        comfirmMessage="You're about to permanently delete this task, its descriptions and attachments, and all of its data. If you're not sure, you can resolve or close this task instead."
        okTitle="Delete"
        isOpen={isConfirmDeleteTask}
        onClose={() => setIsConfirmDeleteTask(false)}
        onConfirm={() => {
          deleteTask(task.id);
          setIsConfirmDeleteTask(false);
        }}
      />

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm move to backlog"
        comfirmMessage="Are you sure you want to move this task to the backlog?"
        okTitle="Move"
        okBtnColor="primary"
        isOpen={isOpenMoveToBacklogModal}
        onClose={() => setIsOpenMoveToBacklogModal(false)}
        onConfirm={() => {
          moveToBacklog(task.id);
          setIsOpenMoveToBacklogModal(false);
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

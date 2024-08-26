'use client';

import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import type { NewTask } from '@/types/task';

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
}
function CreateTaskModal(props: CreateTaskModalProps) {
  const { isOpen, onClose, projectId } = props;

  const session = useSession();

  const userId = session?.data?.user.id;

  const { tasks, createNewTask, fetchListTasks } = useTasksStore();
  const { currentProject, fetchCurrentProject } = useProjectsStore();
  const { columns, fetchListColumns } = useColumnsStore();

  const [createTaskSummary, setCreateTaskSummary] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchCurrentProject(projectId),
        fetchListColumns(projectId),
      ]);
    };

    if (isOpen) {
      fetchData();
    }
  }, [fetchCurrentProject, fetchListColumns, isOpen, projectId]);

  const createTask = async (summary: string) => {
    if (!userId || currentProject === null) return;

    const todoColumnId = columns.find((column) => column.isTodo === true)?.id;

    const currentColumnTasks = tasks
      .filter((task) => task.column_id === todoColumnId)
      .sort((a, b) => a.pos - b.pos);

    const lastPos = currentColumnTasks[currentColumnTasks.length - 1]?.pos ?? 0;

    const newTask: NewTask = {
      reporter: userId,
      project_id: currentProject.id,
      column_id: todoColumnId ?? '',
      summary,
      key: `${currentProject.tasks_count + 1}`,
      pos: lastPos + 1024,
    };

    await createNewTask(newTask);

    toast.success('Create new task successfully!', {
      position: 'bottom-left',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

    await fetchListTasks(projectId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        onClose();
      }}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1">
          Create new task
        </ModalHeader>
        <ModalBody>
          <div>
            <Input
              autoFocus
              type="text"
              size="lg"
              variant="flat"
              radius="sm"
              placeholder="What needs to be done?"
              value={createTaskSummary}
              maxLength={255}
              className="w-full rounded-md"
              onChange={(e) => setCreateTaskSummary(e.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                createTask(createTaskSummary);
                setCreateTaskSummary('');
                onClose();
              }}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => {
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!createTaskSummary}
            onPress={() => {
              if (!createTaskSummary) return;
              createTask(createTaskSummary);
              setCreateTaskSummary('');
              onClose();
            }}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateTaskModal;

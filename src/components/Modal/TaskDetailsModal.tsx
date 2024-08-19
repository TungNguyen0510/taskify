import { Modal, ModalBody, ModalContent, ModalHeader } from '@nextui-org/react';
import React, { useEffect } from 'react';

import { useTasksStore } from '@/stores/tasks';

import Icon from '../Icon';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}
function TaskDetailsModal(props: TaskDetailsModalProps) {
  const { isOpen, onClose, taskId } = props;

  const { taskDetails, fetchTaskDetails } = useTasksStore();

  useEffect(() => {
    if (isOpen) {
      fetchTaskDetails(taskId);
    }
  }, [fetchTaskDetails, isOpen, taskId]);

  return (
    <Modal
      size="5xl"
      backdrop="opaque"
      placement="center"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="size-4">
              <Icon name="checkSquare" />
            </div>
            <div className="text-xs text-zinc-500">{taskDetails?.key}</div>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="flex">
            <div className="w-3/5">
              <p>{taskDetails?.summary}</p>
            </div>
            <div className="w-2/5">2</div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export default TaskDetailsModal;

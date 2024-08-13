import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Spinner,
} from '@nextui-org/react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

import TaskCard from '@/components/Board/TaskCard';
import ConfirmModal from '@/components/ConfirmModal';
import Icon from '@/components/Icon';
import useClickOutside from '@/hooks/useClickOutside';
import type { Column, Task } from '@/types/board';

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  deleteColumn: (id: string) => void;
  updateTitleColumn(id: string, title: string): void;
  createTask: (columnId: string, title: string) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const t = useTranslations('ColumnContainer');

  const { column, tasks, deleteColumn, updateTitleColumn, createTask } = props;

  const [editMode, setEditMode] = useState(false);
  const [isConfirmDeleteColumn, setIsConfirmDeleteColumn] =
    useState<boolean>(false);

  const [newTitleColumn, setNewTitleColumn] = useState(column.title);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskTitle, setCreateTaskTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const creatingTaskRef = useClickOutside(() => setIsCreatingTask(false));

  const editColumnTitleRef = useClickOutside(() => setEditMode(false));

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
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <>
      <Card
        ref={setNodeRef}
        style={style}
        shadow="sm"
        className={`flex h-[350px] max-h-[calc(100vh-56px-80px-16px-16px)] w-64 min-w-64 flex-col gap-2 rounded-md bg-slate-50 ${
          isDragging ? 'border border-blue-500 opacity-30' : ''
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex justify-between gap-1 bg-slate-200 p-2"
        >
          <div className="relative flex items-center gap-2">
            <div className="flex size-5 items-center justify-center rounded-full bg-gray-500 p-1 text-tiny text-white">
              {tasks?.length}
            </div>
            {!editMode && (
              <div className="flex items-center justify-center gap-2">
                <p
                  onClick={() => setEditMode(true)}
                  aria-hidden="true"
                  className="max-w-[160px] select-none truncate font-semibold hover:underline"
                >
                  {column.title}
                </p>

                <div>{isLoading && <Spinner size="sm" />}</div>
              </div>
            )}
            {editMode && (
              <div
                className="absolute left-8 top-0 z-10 flex min-w-[160px] flex-col gap-1"
                ref={editColumnTitleRef as React.RefObject<HTMLDivElement>}
              >
                <Input
                  autoFocus
                  type="text"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  className="min-w-[160px]"
                  value={newTitleColumn}
                  maxLength={30}
                  onChange={(e) => setNewTitleColumn(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    updateTitleColumn(column.id, newTitleColumn);
                    setEditMode(false);
                  }}
                >
                  {newTitleColumn}
                </Input>
                <div className="flex w-full justify-end gap-2">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="shadow"
                    aria-label="more"
                    className="h-8"
                    onClick={() => {
                      setNewTitleColumn(column.title);
                      setEditMode(false);
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
                    isDisabled={!newTitleColumn}
                    onClick={() => {
                      setEditMode(false);

                      if (!newTitleColumn || newTitleColumn === column.title)
                        return;

                      setIsLoading(true);
                      updateTitleColumn(column.id, newTitleColumn);
                      setIsLoading(false);
                    }}
                  >
                    <Icon name="checked" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          <Dropdown>
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
                onClick={() => setIsConfirmDeleteColumn(true)}
                className="font-semibold text-danger"
                color="danger"
              >
                {t('delete')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
        <div className="scrollbar-2 flex grow flex-col gap-2 overflow-y-auto overflow-x-hidden p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </div>

        {isCreatingTask ? (
          <div
            className="m-2 flex w-[calc(100%-16px)] flex-col gap-2 rounded-md border-2 border-blue-500 p-2"
            ref={creatingTaskRef as React.RefObject<HTMLDivElement>}
          >
            <Input
              autoFocus
              type="text"
              size="lg"
              variant="flat"
              radius="sm"
              placeholder={t('create_task_placeholder')}
              value={createTaskTitle}
              maxLength={255}
              className="w-full rounded-md"
              onChange={(e) => setCreateTaskTitle(e.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                createTask(column.id, createTaskTitle);
                setCreateTaskTitle('');
                setIsCreatingTask(false);
              }}
            />
            <div className="flex w-full justify-end gap-2">
              <Button
                color="primary"
                variant="shadow"
                size="sm"
                aria-label="more"
                isDisabled={!createTaskTitle}
                onClick={() => {
                  if (!createTaskTitle) return;
                  createTask(column.id, createTaskTitle);
                  setCreateTaskTitle('');
                  setIsCreatingTask(false);
                }}
              >
                {t('create')}
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-end p-2">
            <Button
              color="default"
              variant="bordered"
              radius="sm"
              className="w-fit"
              startContent={<Icon name="plus" />}
              onClick={() => setIsCreatingTask(true)}
            >
              {t('add_task')}
            </Button>
          </div>
        )}
      </Card>

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle={t('delete_column_title')}
        comfirmMessage={t('delete_column_message')}
        okTitle={t('delete')}
        isOpen={isConfirmDeleteColumn}
        onClose={() => setIsConfirmDeleteColumn(false)}
        onConfirm={() => {
          deleteColumn(column.id);
          setIsConfirmDeleteColumn(false);
        }}
      />
    </>
  );
}

export default ColumnContainer;

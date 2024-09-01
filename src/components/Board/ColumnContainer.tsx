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
  Select,
  SelectItem,
  Spinner,
} from '@nextui-org/react';
import { useMemo, useState } from 'react';

import TaskCard from '@/components/Board/TaskCard';
import Icon from '@/components/Icon';
import ConfirmModal from '@/components/Modal/ConfirmModal';
import useClickOutside from '@/hooks/useClickOutside';
import { useColumnsStore } from '@/stores/columns';
import { useTasksStore } from '@/stores/tasks';
import type { Column } from '@/types/board';
import type { Task } from '@/types/task';

interface ColumnContainerProps {
  column: Column;
  tasks: Task[];
  deleteColumn: (id: string) => void;
  updateStatusColumn(id: string, status: string): void;
  createTask: (columnId: string, status: string) => void;
  deleteTask: (taskId: string) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const {
    column,
    tasks,
    deleteColumn,
    updateStatusColumn,
    createTask,
    deleteTask,
  } = props;

  const { columns } = useColumnsStore();
  const { updateTaskDetails } = useTasksStore();

  const [editMode, setEditMode] = useState(false);
  const [isConfirmDeleteColumn, setIsConfirmDeleteColumn] =
    useState<boolean>(false);

  const [newStatusColumn, setNewStatusColumn] = useState(column.status);

  const [isCreatingTask, setIsCreatingTask] = useState(false);
  const [createTaskSummary, setCreateTaskSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const creatingTaskRef = useClickOutside(() => setIsCreatingTask(false));

  const editColumnStatusRef = useClickOutside(() => setEditMode(false));

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const formattedColumns = columns
    .filter((col) => col.id !== column.id)
    .map((col) => ({
      id: col.id,
      label: col.status,
    }));

  const todoColumnId = columns.find((col) => col.isTodo === true)?.id;

  const [columnIdToTranfer, setColumnIdToTranfer] = useState<string>(
    todoColumnId as string,
  );

  const tranferTasks = () => {
    try {
      tasks.forEach(async (task) => {
        await updateTaskDetails(task.id, {
          column_id: columnIdToTranfer,
        });
      });
    } catch (e) {
      throw new Error('Failed to tranfer tasks');
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
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
    attributes: {
      roleDescription: `Column: ${column.status}`,
    },
    disabled: editMode,
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
        shadow="sm"
        className={`flex min-h-[450px] w-[270px] min-w-[270px] flex-col gap-2 rounded-md bg-slate-50 ${
          isDragging ? 'border border-blue-500 opacity-30' : ''
        }`}
      >
        <div
          {...attributes}
          {...listeners}
          className="flex min-h-12 justify-between gap-1 bg-slate-200 p-2"
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
                  className="max-w-[140px] select-none truncate font-semibold hover:underline"
                >
                  {column.status}
                </p>
                {column.isDone ? (
                  <div className="text-green-500">
                    <Icon name="checked" />
                  </div>
                ) : null}

                <div>{isLoading && <Spinner size="sm" />}</div>
              </div>
            )}
            {editMode && (
              <div
                className="absolute left-8 top-0 z-10 flex min-w-[160px] flex-col gap-1"
                ref={editColumnStatusRef as React.RefObject<HTMLDivElement>}
              >
                <Input
                  autoFocus
                  type="text"
                  size="sm"
                  variant="bordered"
                  radius="sm"
                  className="min-w-[160px]"
                  value={newStatusColumn}
                  maxLength={30}
                  onChange={(e) => setNewStatusColumn(e.target.value)}
                  onKeyDown={(event) => {
                    if (event.key !== 'Enter') return;
                    updateStatusColumn(column.id, newStatusColumn);
                    setEditMode(false);
                  }}
                >
                  {newStatusColumn}
                </Input>
                <div className="flex w-full justify-end gap-2">
                  <Button
                    isIconOnly
                    color="danger"
                    variant="solid"
                    aria-label="more"
                    className="h-8"
                    onClick={() => {
                      setNewStatusColumn(column.status);
                      setEditMode(false);
                    }}
                  >
                    <Icon name="close" />
                  </Button>
                  <Button
                    isIconOnly
                    color="primary"
                    variant="solid"
                    aria-label="more"
                    className="h-8"
                    isDisabled={!newStatusColumn}
                    onClick={() => {
                      setEditMode(false);

                      if (!newStatusColumn || newStatusColumn === column.status)
                        return;

                      setIsLoading(true);
                      updateStatusColumn(column.id, newStatusColumn);
                      setIsLoading(false);
                    }}
                  >
                    <Icon name="checked" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {!(
            (column.isDone === true && column.isTodo === false) ||
            (column.isDone === false && column.isTodo === true)
          ) && (
            <Dropdown placement="bottom-start">
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
                  Delete
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          )}
        </div>
        <div className="scrollbar-2 flex grow flex-col gap-2 overflow-y-auto overflow-x-hidden p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} deleteTask={deleteTask} />
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
              placeholder="What needs to be done?"
              value={createTaskSummary}
              maxLength={255}
              className="w-full rounded-md"
              onChange={(e) => setCreateTaskSummary(e.target.value)}
              onKeyDown={(event) => {
                if (event.key !== 'Enter') return;
                createTask(column.id, createTaskSummary);
                setCreateTaskSummary('');
                setIsCreatingTask(false);
              }}
            />
            <div className="flex w-full justify-end gap-2">
              <Button
                color="primary"
                variant="solid"
                size="sm"
                aria-label="more"
                isDisabled={!createTaskSummary}
                onClick={() => {
                  if (!createTaskSummary) return;
                  createTask(column.id, createTaskSummary);
                  setCreateTaskSummary('');
                  setIsCreatingTask(false);
                }}
              >
                Create
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
              Add task
            </Button>
          </div>
        )}
      </Card>

      <ConfirmModal
        size="2xl"
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm delete column"
        comfirmMessage="Are you sure you want to delete this column?"
        okTitle="Delete"
        contentSlot={
          <div className="flex items-center gap-2">
            <p>All tasks in this column will be transferred to the column:</p>

            <Select
              className="w-48"
              selectionMode="single"
              disallowEmptySelection
              defaultSelectedKeys={[todoColumnId as string]}
              onChange={(e: any) => {
                setColumnIdToTranfer(e.target.value);
              }}
            >
              {formattedColumns.map((col) => (
                <SelectItem key={col.id}>{col.label}</SelectItem>
              ))}
            </Select>
          </div>
        }
        isOpen={isConfirmDeleteColumn}
        onClose={() => setIsConfirmDeleteColumn(false)}
        onConfirm={() => {
          deleteColumn(column.id);
          tranferTasks();
          setIsConfirmDeleteColumn(false);
        }}
      />
    </>
  );
}

export default ColumnContainer;

import 'md-editor-rt/lib/style.css';

import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  DatePicker,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  Textarea,
  Tooltip,
} from '@nextui-org/react';
import { MdEditor, MdPreview } from 'md-editor-rt';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import ActivityCard from '@/components/ActivityCard';
import useClickOutside from '@/hooks/useClickOutside';
import { useActivitiesStore } from '@/stores/activity';
import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';
import type { NewActivity } from '@/types/activity';
import { AppConfig } from '@/utils/AppConfig';
import {
  convertToISO,
  formatDateFull,
  getInitialsName,
  isExpiredDate,
} from '@/utils/Helpers';

import AvatarUser from '../AvatarUser';
import Icon from '../Icon';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

function TaskDetailsModal(props: TaskDetailsModalProps) {
  const { isOpen, onClose, taskId } = props;

  const route = useRouter();

  const session = useSession();

  const currentUser = session.data?.user;

  const { taskDetails, fetchTaskDetails, updateTaskDetails, fetchListTasks } =
    useTasksStore();

  const { activities, fetchListActivities, createNewActivity } =
    useActivitiesStore();

  const { currentProject } = useProjectsStore();

  const { users } = useUsersStore();

  const projectKey = currentProject?.key;

  const { columns } = useColumnsStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchTaskDetails(taskId);
    };

    if (isOpen) {
      fetchData();
    }
  }, [fetchTaskDetails, isOpen, taskId]);

  useEffect(() => {
    const fetchActivities = async () => {
      if (taskDetails?.id) {
        await fetchListActivities(taskDetails.id);
      }
    };

    if (taskDetails) {
      fetchActivities();
    }
  }, [taskDetails, fetchListActivities]);

  const [isEditSummary, setIsEditSummary] = useState(false);
  const [isEditDesciption, setIsEditDesciption] = useState(false);
  const [isEditDueDate, setIsEditDueDate] = useState(false);
  const [isEditAssignee, setIsEditAssignee] = useState(false);

  const [newSummary, setNewSummary] = useState(taskDetails?.summary);
  const [newDescription, setNewDescription] = useState(
    taskDetails?.description,
  );
  // const [setNewDueDate] = useState<any>(taskDetails?.due_date);
  const [newAssignee, setNewAssignee] = useState<string | null | undefined>(
    null,
  );

  const [isLoading, setIsLoading] = useState(false);

  const [editorId] = useState(`editor${taskId}`);

  const editSummaryRef = useClickOutside(() => setIsEditSummary(false));
  const editDescriptionRef = useClickOutside(() => setIsEditDesciption(false));
  const editDueDateRef = useClickOutside(() => setIsEditDueDate(false));
  const editAssigneeRef = useClickOutside(() => setIsEditAssignee(false));

  const formattedColumns = columns.map((column) => ({
    id: column.id,
    label: column.status,
  }));

  const existingUserIds = new Set(
    currentProject?.project_members.map((member) => member.directus_users_id),
  );

  const filteredUsers = users.filter((user) => existingUserIds.has(user.id));

  const updateSummary = async () => {
    if (currentUser?.id && taskDetails) {
      const newActivity: NewActivity = {
        action_type: 'UPDATED',
        field: 'Summary',
        user_id: currentUser.id,
        project_id: taskDetails.project_id,
        resource_id: taskDetails.id,
        timestamp: new Date().toISOString(),
      };

      setIsLoading(true);
      await updateTaskDetails(taskId, {
        summary: newSummary,
      });

      toast.success('Update task summary successfully!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      await createNewActivity(newActivity);
      await fetchTaskDetails(taskId);

      await fetchListActivities(taskDetails.id);

      if (taskDetails?.project_id) {
        await fetchListTasks(taskDetails.project_id);
      }
      setIsLoading(false);
    }
  };

  const updateDescription = async () => {
    if (currentUser?.id && taskDetails) {
      const newActivity: NewActivity = {
        action_type: 'UPDATED',
        field: 'Description',
        user_id: currentUser?.id,
        project_id: taskDetails.project_id,
        resource_id: taskDetails.id,
        timestamp: new Date().toISOString(),
      };

      await updateTaskDetails(taskId, {
        description: newDescription,
      });

      toast.success('Update task description successfully!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      await createNewActivity(newActivity);
      await fetchTaskDetails(taskId);

      await fetchListActivities(taskDetails.id);

      if (taskDetails?.project_id) {
        await fetchListTasks(taskDetails.project_id);
      }
    }
  };

  const updateTaskStatus = async (columnId: string) => {
    if (currentUser?.id && taskDetails) {
      const doneColumnId = columns.find((column) => column.isDone === true)?.id;
      const newActivity: NewActivity = {
        action_type: 'UPDATED',
        field: 'Status',
        user_id: currentUser?.id,
        project_id: taskDetails.project_id,
        resource_id: taskDetails.id,
        timestamp: new Date().toISOString(),
      };

      await updateTaskDetails(taskId, {
        column_id: columnId,
      });

      if (columnId === doneColumnId) {
        await updateTaskDetails(taskId, {
          isDone: true,
        });
      }

      toast.success('Update task status successfully!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      await createNewActivity(newActivity);

      await fetchTaskDetails(taskId);

      setIsEditDueDate(false);

      if (taskDetails?.project_id) {
        await fetchListTasks(taskDetails.project_id);
      }
    }
  };

  const updateDueDate = async (date: any) => {
    if (currentUser?.id && taskDetails) {
      const newActivity: NewActivity = {
        action_type: 'UPDATED',
        field: 'Due Date',
        user_id: currentUser?.id,
        project_id: taskDetails.project_id,
        resource_id: taskDetails.id,
        timestamp: new Date().toISOString(),
      };

      await updateTaskDetails(taskId, {
        due_date: date,
      });

      toast.success('Update task due date successfully!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      await createNewActivity(newActivity);

      await fetchTaskDetails(taskId);

      setIsEditDueDate(false);

      if (taskDetails?.project_id) {
        await fetchListTasks(taskDetails.project_id);
      }
    }
  };

  const updateAssignee = async (assignee: any) => {
    if (currentUser?.id && taskDetails) {
      const newActivity: NewActivity = {
        action_type: 'UPDATED',
        field: 'Assignee',
        user_id: currentUser?.id,
        project_id: taskDetails.project_id,
        resource_id: taskDetails.id,
        timestamp: new Date().toISOString(),
      };

      await updateTaskDetails(taskId, {
        assignee,
      });

      toast.success('Update task assignee successfully!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      await createNewActivity(newActivity);

      await fetchTaskDetails(taskId);

      setIsEditAssignee(false);
      await fetchListActivities(taskDetails.id);

      if (taskDetails?.project_id) {
        await fetchListTasks(taskDetails.project_id);
      }
    }
  };

  return (
    <Modal
      size="full"
      backdrop="opaque"
      placement="center"
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalContent className="size-full max-h-[calc(100vh-2em)] max-w-[calc(100vw-2em)]">
        <ModalHeader className="flex flex-col gap-1">
          <div className="flex gap-1">
            <div className="size-4">
              <Icon name="checkSquare" />
            </div>
            <Tooltip
              showArrow
              color="foreground"
              radius="sm"
              content={`Go to Task ${projectKey}-${taskDetails?.key} Page`}
            >
              <div
                className={`cursor-pointer text-xs text-zinc-500 ${taskDetails?.isDone ? 'text-zinc-300 line-through' : ''}`}
                aria-hidden="true"
                onClick={() =>
                  route.push(
                    `/u/project/${currentProject?.id}/task/${taskDetails?.id}`,
                  )
                }
              >
                {projectKey}-{taskDetails?.key}
              </div>
            </Tooltip>
          </div>
        </ModalHeader>
        <ModalBody>
          <div className="scrollbar-2 flex h-[calc(100vh-6em)] flex-col gap-4 overflow-y-auto md:flex-row">
            <div className="scrollbar-2 flex h-[calc(100vh-6em)] w-full flex-col gap-4 overflow-y-auto px-2 pb-6 md:w-3/5">
              <div className="w-full">
                {!isEditSummary ? (
                  <div className="flex items-center gap-2 rounded-md p-1 hover:bg-zinc-100">
                    <p
                      onClick={() => {
                        setIsEditSummary(true);
                        setNewSummary(taskDetails?.summary);
                      }}
                      aria-hidden="true"
                      className="w-[calc(100%-2em)] cursor-pointer select-none text-pretty break-words text-xl font-semibold text-zinc-800"
                    >
                      {taskDetails?.summary}
                    </p>

                    <div>{isLoading && <Spinner size="sm" />}</div>
                  </div>
                ) : (
                  <div
                    className=" flex w-full flex-col gap-1"
                    ref={editSummaryRef as React.RefObject<HTMLDivElement>}
                  >
                    <Textarea
                      autoFocus
                      type="text"
                      size="md"
                      variant="bordered"
                      radius="sm"
                      className="w-full"
                      value={newSummary}
                      maxLength={255}
                      onChange={(e) => setNewSummary(e.target.value)}
                      onKeyDown={(event) => {
                        if (event.key !== 'Enter') return;

                        updateSummary();
                        setIsEditSummary(false);
                      }}
                    >
                      {taskDetails?.summary}
                    </Textarea>
                    <div className="flex w-full justify-end gap-2">
                      <Button
                        isIconOnly
                        color="danger"
                        variant="solid"
                        aria-label="more"
                        className="h-8"
                        onClick={() => {
                          setNewSummary(taskDetails?.summary);
                          setIsEditSummary(false);
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
                        isDisabled={!newSummary}
                        onClick={() => {
                          setIsEditSummary(false);

                          if (
                            !newSummary ||
                            newSummary === taskDetails?.summary
                          )
                            return;

                          updateSummary();
                        }}
                      >
                        <Icon name="checked" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {taskDetails?.date_created && (
                <div className="text-base text-zinc-800">
                  <span className="font-semibold">Created at:</span>{' '}
                  {formatDateFull(taskDetails.date_created)}
                </div>
              )}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between gap-2">
                  <div className="text-base font-semibold text-zinc-800">
                    Description
                  </div>

                  {!isEditDesciption && taskDetails?.description && (
                    <Button
                      isIconOnly
                      color="default"
                      variant="light"
                      aria-label="more"
                      className="h-8"
                      onClick={() => {
                        setIsEditDesciption(true);
                        setNewDescription(taskDetails?.description);
                      }}
                    >
                      <Icon name="edit" />
                    </Button>
                  )}
                </div>

                <div>
                  {isEditDesciption ? (
                    <div
                      className="flex flex-col gap-2 pb-4"
                      ref={
                        editDescriptionRef as React.RefObject<HTMLDivElement>
                      }
                    >
                      <MdEditor
                        language="en-US"
                        preview={false}
                        modelValue={newDescription || ''}
                        onChange={setNewDescription}
                        onSave={async () => {
                          setIsEditDesciption(false);

                          if (newDescription === taskDetails?.description)
                            return;

                          updateDescription();
                        }}
                      />

                      <div className="flex w-full justify-end gap-2">
                        <Button
                          isIconOnly
                          color="danger"
                          variant="solid"
                          aria-label="more"
                          className="h-8"
                          onClick={() => {
                            if (taskDetails?.description) {
                              setNewDescription(taskDetails?.description);
                            }
                            setIsEditDesciption(false);
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
                          onClick={async () => {
                            setIsEditDesciption(false);

                            if (newDescription === taskDetails?.description)
                              return;

                            updateDescription();
                          }}
                        >
                          <Icon name="checked" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="cursor-pointer rounded-md border-1 border-zinc-200 p-1"
                      aria-hidden="true"
                    >
                      {taskDetails?.description &&
                      taskDetails?.description !== '' ? (
                        <div>
                          <MdPreview
                            editorId={editorId}
                            modelValue={taskDetails.description}
                          />
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          onClick={() => {
                            setIsEditDesciption(true);
                            setNewDescription(taskDetails?.description);
                          }}
                        >
                          Add a description...
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="text-base font-semibold text-zinc-800">
                  Activities
                </div>

                <div className="flex flex-col gap-4">
                  {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
            <Divider orientation="vertical" className="hidden md:block" />

            <div className="flex w-full flex-col gap-4 md:w-2/5">
              <div>
                <div>
                  {taskDetails && (
                    <Select
                      className="w-40"
                      selectionMode="single"
                      disallowEmptySelection
                      defaultSelectedKeys={[taskDetails.column_id]}
                      onChange={(e: any) => {
                        updateTaskStatus(e.target.value);
                      }}
                    >
                      {formattedColumns.map((col) => (
                        <SelectItem key={col.id}>{col.label}</SelectItem>
                      ))}
                    </Select>
                  )}
                </div>
              </div>
              <div className="rounded-md border-1 border-zinc-200">
                <div className="border-b-1 border-zinc-200 p-4 text-base font-semibold text-zinc-800">
                  Details
                </div>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-28 text-slate-500">Due date</div>
                    <div className="w-full cursor-pointer">
                      {isEditDueDate ? (
                        <div
                          ref={
                            editDueDateRef as React.RefObject<HTMLDivElement>
                          }
                        >
                          <DatePicker
                            label="Due Date"
                            variant="bordered"
                            hideTimeZone
                            showMonthAndYearPickers
                            // value={parseDateTime(newDueDate) as any}
                            onChange={async (date: any) => {
                              const isoDate = convertToISO(date);
                              // setNewDueDate(isoDate);

                              updateDueDate(isoDate);
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          onClick={() => {
                            setIsEditDueDate(true);
                            // setNewDueDate(taskDetails?.due_date);
                          }}
                        >
                          {taskDetails?.due_date ? (
                            <div
                              className={`rounded-md px-2 py-1 font-semibold ${isExpiredDate(taskDetails.due_date) ? 'bg-red-100 text-red-500' : 'bg-blue-50 text-blue-500'}`}
                            >
                              {formatDateFull(taskDetails.due_date)}
                            </div>
                          ) : (
                            <div className="w-full rounded-md px-2 py-1 hover:bg-zinc-100 hover:text-zinc-900">
                              None
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="min-w-28 text-slate-500">Assignee</div>
                    <div className="w-full cursor-pointer">
                      {isEditAssignee ? (
                        <div
                          ref={
                            editAssigneeRef as React.RefObject<HTMLDivElement>
                          }
                        >
                          <Autocomplete
                            variant="bordered"
                            placeholder="Assignee"
                            labelPlacement="inside"
                            className="w-full"
                            size="md"
                            defaultItems={filteredUsers}
                            selectedKey={newAssignee || undefined}
                            onSelectionChange={async (key: any) => {
                              setNewAssignee(key as string | null | undefined);

                              updateAssignee(key);
                            }}
                          >
                            {(user) => (
                              <AutocompleteItem
                                key={user.id}
                                textValue={
                                  user?.first_name && user?.first_name
                                    ? `${user.first_name} ${user.last_name}`
                                    : '-- --'
                                }
                              >
                                <div className="flex items-center gap-2">
                                  <Avatar
                                    name={
                                      user?.first_name && user?.first_name
                                        ? getInitialsName(
                                            user.first_name,
                                            user.first_name,
                                          )
                                        : ''
                                    }
                                    showFallback
                                    className="shrink-0"
                                    size="sm"
                                    src={
                                      `${AppConfig.backendURL}/assets/${user?.avatar?.id}` ??
                                      ''
                                    }
                                  />
                                  <div className="flex flex-col">
                                    <span className="text-small">
                                      {user?.first_name && user?.last_name
                                        ? `${user.first_name} ${user.last_name}`
                                        : '-- --'}
                                    </span>
                                    <span className="text-tiny text-default-400">
                                      {user.email}
                                    </span>
                                  </div>
                                </div>
                              </AutocompleteItem>
                            )}
                          </Autocomplete>
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          onClick={() => {
                            setIsEditAssignee(true);
                            if (taskDetails?.assignee) {
                              setNewAssignee(taskDetails.assignee);
                            }
                          }}
                        >
                          {taskDetails?.assignee ? (
                            <AvatarUser userId={taskDetails.assignee} />
                          ) : (
                            <div className="w-full rounded-md px-2 py-1 hover:bg-zinc-100 hover:text-zinc-900">
                              None
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="min-w-28 text-slate-500">Reporter</div>
                    <div>
                      <AvatarUser userId={taskDetails?.reporter ?? ''} />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="min-w-28 text-slate-500">Date created</div>
                    <div className="w-full">
                      {taskDetails?.date_created ? (
                        <p className="w-full rounded-md bg-zinc-200 px-2 py-1 font-semibold">
                          {formatDateFull(taskDetails.date_created)}
                        </p>
                      ) : (
                        <div className="w-full rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                          None
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="min-w-28 text-slate-500">Date updated</div>
                    <div className="w-full">
                      {taskDetails?.date_updated ? (
                        <p className="w-full rounded-md bg-zinc-200 px-2 py-1 font-semibold">
                          {formatDateFull(taskDetails.date_updated)}
                        </p>
                      ) : (
                        <div className="w-full rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                          None
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
export default TaskDetailsModal;

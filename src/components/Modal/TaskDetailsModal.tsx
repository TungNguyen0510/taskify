import 'md-editor-rt/lib/style.css';

import {
  Button,
  DatePicker,
  Divider,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Spinner,
  Textarea,
} from '@nextui-org/react';
import { MdEditor, MdPreview } from 'md-editor-rt';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import ActivityCard from '@/components/ActivityCard';
import useClickOutside from '@/hooks/useClickOutside';
import { useActivitiesStore } from '@/stores/activity';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import type { NewActivity } from '@/types/activity';
import { formatDateFull, isExpiredDate } from '@/utils/Helpers';

import AvatarUser from '../AvatarUser';
import Icon from '../Icon';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string;
}

function TaskDetailsModal(props: TaskDetailsModalProps) {
  const { isOpen, onClose, taskId } = props;

  const session = useSession();

  const currentUser = session.data?.user;

  const { taskDetails, fetchTaskDetails, updateTaskDetails, fetchListTasks } =
    useTasksStore();

  const { activities, fetchListActivities, createNewActivity } =
    useActivitiesStore();

  const { currentProject } = useProjectsStore();

  const projectKey = currentProject?.key;

  // const { columns } = useColumnsStore();

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

  const [newSummary, setNewSummary] = useState(taskDetails?.summary);
  const [newDescription, setNewDescription] = useState(
    taskDetails?.description,
  );
  const [newDueDate, setNewDueDate] = useState(taskDetails?.due_date);

  const [isLoading, setIsLoading] = useState(false);

  const [editorId] = useState(`editor${taskId}`);

  const editSummaryRef = useClickOutside(() => setIsEditSummary(false));
  const editDescriptionRef = useClickOutside(() => setIsEditDesciption(false));
  const editDueDateRef = useClickOutside(() => setIsEditDueDate(false));

  // const formattedColumns = columns.map((column) => ({
  //   id: column.id,
  //   label: column.status,
  // }));

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

      await createNewActivity(newActivity);
      await fetchTaskDetails(taskId);

      if (taskDetails?.project_id) {
        await fetchListActivities(taskDetails.id);
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
      await createNewActivity(newActivity);
      await fetchTaskDetails(taskId);

      if (taskDetails?.project_id) {
        await fetchListActivities(taskDetails.id);
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
            <div className="text-xs text-zinc-500">
              {projectKey}-{taskDetails?.key}
            </div>
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
                  Activity
                </div>

                {/* <Tabs
                  aria-label="Activites"
                  color="primary"
                  variant="underlined"
                  classNames={{
                    tabList:
                      'gap-6 w-full relative rounded-none p-0 border-b border-divider',
                    cursor: 'w-full bg-[#3b82f6]',
                    tab: 'max-w-fit px-0 h-12',
                    tabContent: 'group-data-[selected=true]:text-[#3b82f6]',
                  }}
                >
                  <Tab key="comments" title="Comments">
                    <CommentsArea />
                  </Tab>
                  <Tab key="history" title="History">
                    <div className="flex flex-col gap-4">
                      {activities.map((activity) => (
                        <ActivityCard key={activity.id} activity={activity} />
                      ))}
                    </div>
                  </Tab>
                </Tabs> */}

                <div className="flex flex-col gap-4">
                  {activities.map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>
            </div>
            <Divider orientation="vertical" className="hidden md:block" />

            <div className="flex w-full flex-col gap-4 md:w-2/5">
              {/* <div>
                <div>
                  <SelectStatus
                    listStatus={formattedColumns}
                    value={taskDetails?.column_id || ''}
                    onChange={() => {}}
                  />
                </div>
              </div> */}
              <div className="rounded-md border-1 border-zinc-200">
                <div className="border-b-1 border-zinc-200 p-4 text-base font-semibold text-zinc-800">
                  Details
                </div>
                <div className="flex flex-col gap-6 p-4">
                  <div className="flex items-center gap-2">
                    <div className="min-w-20 text-slate-500">Assignee</div>
                    <div className="w-full cursor-pointer">
                      {taskDetails?.assignee ? (
                        <AvatarUser userId={taskDetails.assignee} />
                      ) : (
                        <div className="w-full rounded-md px-2 py-1 hover:bg-zinc-100 hover:text-zinc-900">
                          None
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="min-w-20 text-slate-500">Due date</div>
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
                            size="sm"
                            hideTimeZone
                            showMonthAndYearPickers
                            value={newDueDate}
                            onChange={async (date) => {
                              console.log('date', date.toString());
                              setNewDueDate(date.toString());

                              await updateTaskDetails(taskId, {
                                due_date: newDueDate,
                              });
                              await fetchTaskDetails(taskId);

                              setIsEditDueDate(false);

                              if (taskDetails?.project_id) {
                                await fetchListTasks(taskDetails.project_id);
                              }
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          aria-hidden="true"
                          onClick={() => {
                            setIsEditDueDate(true);
                            setNewDueDate(taskDetails?.due_date);
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
                    <div className="min-w-20 text-slate-500">Reporter</div>
                    <div>
                      <AvatarUser userId={taskDetails?.reporter ?? ''} />
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

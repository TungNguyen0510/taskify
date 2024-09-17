/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import 'gantt-task-react/dist/index.css';

import { Spinner } from '@nextui-org/react';
import { Gantt, ViewMode } from 'gantt-task-react';
import { useEffect, useState } from 'react';

import TaskDetailsModal from '@/components/Modal/TaskDetailsModal';
import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';

import { ViewSwitcher } from './ViewSwitcher';

function TimelinePage({ params }: { params: { projectId: string } }) {
  const { tasks, fetchListTasks, updateTaskDetails } = useTasksStore();
  const { fetchListUsers } = useUsersStore();
  const { fetchListColumns } = useColumnsStore();
  const { currentProject, fetchCurrentProject } = useProjectsStore();

  const [isLoading, setIsLoading] = useState(false);
  const [isOpenTaskDetailsModal, setIsOpenTaskDetailsModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');

  const [view, setView] = useState<ViewMode>(ViewMode.Day);
  const [isChecked, setIsChecked] = useState(true);
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      await Promise.all([
        fetchListUsers(),
        fetchCurrentProject(params.projectId),
        fetchListColumns(params.projectId),
        fetchListTasks(params.projectId),
      ]);
    };

    fetchData();

    setIsLoading(false);
  }, []);

  const tranferTasks = tasks
    .sort(
      (a, b) =>
        new Date(a.date_created).getTime() - new Date(b.date_created).getTime(),
    )
    .map((task) => ({
      start: task.start_date
        ? new Date(task.start_date)
        : new Date(task.date_created),
      end: task.due_date ? new Date(task.due_date) : new Date(),
      name: task.summary,
      id: task.id,
      type: 'task' as const,
      project: currentProject?.name,
      progress: task?.progress ?? 0,
      styles: {
        progressColor: '#0ea5e9',
        progressSelectedColor: '#0ea5e9',
      },
    }));

  const earliestStart = tranferTasks.reduce((minDate, task) => {
    return task.start < minDate ? task.start : minDate;
  }, tranferTasks[0]?.start || new Date());

  const latestEnd = tranferTasks.reduce((maxDate, task) => {
    return task.end > maxDate ? task.end : maxDate;
  }, tranferTasks[0]?.end || new Date());

  const totalProgress = tranferTasks.reduce(
    (total, task) => total + task.progress,
    0,
  );

  const progressPercentage =
    (totalProgress / (tranferTasks.length * 100)) * 100;

  const project = {
    start: currentProject?.start_date
      ? new Date(currentProject.start_date)
      : earliestStart,
    end: currentProject?.end_date
      ? new Date(currentProject.end_date)
      : latestEnd,
    name: currentProject?.name,
    id: currentProject?.id,
    progress: progressPercentage,
    type: 'project' as const,
    hideChildren: false,
    displayOrder: 1,
    styles: {
      progressColor: '#0ea5e9',
      progressSelectedColor: '#0ea5e9',
    },
  };

  tranferTasks.unshift(project as any);

  const onDoubleClick = (task: any) => {
    setCurrentTaskId(task.id);
    setIsOpenTaskDetailsModal(true);
  };

  const onDateChange = async (task: any) => {
    await updateTaskDetails(task.id, {
      start_date: task.start.toISOString(),
      due_date: task.end.toISOString(),
    });

    await fetchListTasks(params.projectId);
  };

  const onProgressChange = async (task: any) => {
    await updateTaskDetails(task.id, {
      progress: task.progress,
    });

    await fetchListTasks(params.projectId);
  };

  if (isLoading) {
    return (
      <div className="flex w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)] items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  return (
    <div className="w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)]">
      <div className="mb-4">
        <div className="text-xl font-semibold">Timeline</div>
      </div>

      <ViewSwitcher
        onViewModeChange={(viewMode) => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />

      <Gantt
        tasks={tranferTasks}
        onDoubleClick={onDoubleClick}
        onDateChange={onDateChange}
        onProgressChange={onProgressChange}
        viewMode={view}
        listCellWidth={isChecked ? '155px' : ''}
        columnWidth={columnWidth}
      />

      <TaskDetailsModal
        isOpen={isOpenTaskDetailsModal}
        onClose={() => {
          setIsOpenTaskDetailsModal(false);
          setCurrentTaskId('');
        }}
        taskId={currentTaskId}
      />
    </div>
  );
}
export default TimelinePage;

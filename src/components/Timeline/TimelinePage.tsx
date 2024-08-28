/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import 'gantt-task-react/dist/index.css';

import { Gantt } from 'gantt-task-react';
import { useEffect, useState } from 'react';

import TaskDetailsModal from '@/components/Modal/TaskDetailsModal';
import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';

function TimelinePage({ params }: { params: { projectId: string } }) {
  const { tasks, fetchListTasks, updateTaskDetails } = useTasksStore();
  const { fetchListUsers } = useUsersStore();
  const { fetchListColumns } = useColumnsStore();
  const { fetchCurrentProject } = useProjectsStore();

  const [isOpenTaskDetailsModal, setIsOpenTaskDetailsModal] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchListUsers(),
        fetchCurrentProject(params.projectId),
        fetchListColumns(params.projectId),
        fetchListTasks(params.projectId),
      ]);
    };

    fetchData();
  }, []);

  const tranferTasks = tasks.map((task) => ({
    start: task.start_date ? new Date(task.start_date) : new Date(),
    end: task.due_date ? new Date(task.due_date) : new Date(),
    name: task.summary,
    id: task.id,
    type: 'task' as const,
    // project: currentProject?.name,
    progress: task?.progress ?? 0,
    styles: {
      progressColor: '#ffbb54',
      progressSelectedColor: '#0ea5e9',
    },
  }));

  const onDoubleClick = (task: any) => {
    setIsOpenTaskDetailsModal(true);
    setCurrentTaskId(task.id);
  };

  const onDateChange = (task: any) => {
    console.log('task', task);
  };

  const onProgressChange = async (task: any) => {
    await updateTaskDetails(task.id, {
      progress: task.progress,
    });

    await fetchListTasks(params.projectId);
  };

  const onExpanderClick = (task: any) => {
    console.log('task', task);
  };

  return (
    <div className="w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)]">
      <div className="mb-4">
        <div className="text-xl font-semibold">Timeline</div>
      </div>

      <Gantt
        tasks={tranferTasks}
        onDoubleClick={onDoubleClick}
        onDateChange={onDateChange}
        onProgressChange={onProgressChange}
        onExpanderClick={onExpanderClick}
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

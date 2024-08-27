/* eslint-disable react-hooks/exhaustive-deps */

'use client';

// @ts-ignore
import CanvasJSReact from '@canvasjs/react-charts';
import { Card, CardBody, CardHeader } from '@nextui-org/react';
import { useEffect } from 'react';

import { useColumnsStore } from '@/stores/columns';
import { useProjectsStore } from '@/stores/projects';
import { useTasksStore } from '@/stores/tasks';
import { useUsersStore } from '@/stores/users';

const { CanvasJSChart } = CanvasJSReact;

type Result = {
  y: number;
  label: string;
};

function DashboardPage({ params }: { params: { projectId: string } }) {
  const { tasks, fetchListTasks } = useTasksStore();
  const { users, fetchListUsers } = useUsersStore();
  const { columns, fetchListColumns } = useColumnsStore();
  const { fetchCurrentProject } = useProjectsStore();

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

  const countUnassignedTasks = (): number => {
    return tasks.filter((task) => task.assignee === null).length;
  };

  const countDoneTasks = (): number => {
    return tasks.filter((task) => task.isDone === true).length;
  };

  const countInProgressTasks = (): number => {
    return tasks.filter(
      (task) => task.assignee !== null && task.isDone === false,
    ).length;
  };

  function calculateTaskDistribution(): Result[] {
    const taskCountMap: Record<string, number> = tasks.reduce(
      (acc, task) => {
        const assignee = task.assignee || 'unassigned';
        if (!acc[assignee]) {
          acc[assignee] = 0;
        }
        acc[assignee] += 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalTasks = tasks.length;

    const result = Object.entries(taskCountMap).map(([assignee, count]) => {
      let label = 'Unassigned';

      if (assignee !== 'unassigned') {
        const user = users.find((u) => u.id === assignee);
        label =
          user.first_name && user.last_name
            ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
            : 'Unknown';
      }

      return {
        y: (count / totalTasks) * 100,
        label,
      };
    });

    return result;
  }

  function calculateStatusPercentage() {
    const totalTasks = tasks.length;

    const statusCountMap: { [key: string]: number } = {};

    tasks.forEach((task) => {
      const column = columns.find((col) => col.id === task.column_id);
      if (column && column.status) {
        if (!statusCountMap[column.status]) {
          statusCountMap[column.status] = 0;
        }
        statusCountMap[column.status]! += 1;
      }
    });
    const result = columns.map((column) => ({
      label: column.status,
      y: ((statusCountMap[column.status] || 0) / totalTasks) * 100,
    }));

    return result;
  }

  const pieAssigneeOptions = {
    animationEnabled: true,
    exportEnabled: true,
    theme: 'light1',
    title: {
      text: '',
    },
    data: [
      {
        type: 'pie',
        showInLegend: true,
        legendText: '{label}',
        toolTipContent: '{label}: <strong>{y}%</strong>',
        indexLabel: '{y}%',
        indexLabelPlacement: 'inside',
        dataPoints: calculateTaskDistribution(),
      },
    ],
  };

  const workloadStatusOptions = {
    animationEnabled: true,
    title: {
      text: '',
    },
    legend: {
      horizontalAlign: 'right',
      verticalAlign: 'center',
      reversed: true,
    },
    data: [
      {
        type: 'pyramid',
        showInLegend: true,
        legendText: '{label}',
        indexLabel: '{label} - {y}%',
        toolTipContent: '<b>{label}</b>: {y} <b>({percentage}%)</b>',
        dataPoints: calculateStatusPercentage(),
      },
    ],
  };

  return (
    <div className="flex w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)] flex-col gap-4 px-4">
      <div className="flex items-center gap-4">
        <Card className="flex grow">
          <CardHeader>
            <div className="font-semibold">Unassigned</div>
          </CardHeader>
          <CardBody>
            <div className="scrollbar-1 flex min-w-[180px] flex-col items-center justify-center gap-2">
              <div className="text-3xl font-semibold">
                {countUnassignedTasks()}
              </div>
              <div>tasks</div>
            </div>
          </CardBody>
        </Card>

        <Card className="flex grow">
          <CardHeader>
            <div className="font-semibold">In progress</div>
          </CardHeader>
          <CardBody>
            <div className="scrollbar-1 flex min-w-[180px] flex-col items-center justify-center gap-2">
              <div className="text-3xl font-semibold">
                {countInProgressTasks()}
              </div>
              <div>tasks in progress</div>
            </div>
          </CardBody>
        </Card>

        <Card className="flex grow">
          <CardHeader>
            <div className="font-semibold">Completed</div>
          </CardHeader>
          <CardBody>
            <div className="scrollbar-1 flex min-w-[180px] flex-col items-center justify-center gap-2">
              <div className="text-3xl font-semibold">{countDoneTasks()}</div>
              <div>tasks completed</div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="flex grow">
        <CardHeader>
          <div className="font-semibold">Total tasks by Assignee</div>
        </CardHeader>
        <CardBody>
          <div>
            <CanvasJSChart options={pieAssigneeOptions} />
          </div>
        </CardBody>
      </Card>

      <Card className="flex grow">
        <CardHeader>
          <div className="font-semibold">Workload by Status</div>
        </CardHeader>
        <CardBody>
          <div>
            <CanvasJSChart options={workloadStatusOptions} />
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
export default DashboardPage;

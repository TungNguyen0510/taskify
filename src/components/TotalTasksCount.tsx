import { useEffect, useState } from 'react';

import { useTasksStore } from '@/stores/tasks';

type MyOpenTasksProps = {
  projectId: string;
};

function TotalTasksCount(props: MyOpenTasksProps) {
  const { projectId } = props;
  const { countTotalTasks } = useTasksStore();

  const [countTasks, setCountTasks] = useState(0);

  useEffect(() => {
    const fetchCountTasks = async () => {
      const count = await countTotalTasks(projectId);

      setCountTasks(count);
    };

    fetchCountTasks();
  }, [countTotalTasks, projectId]);

  return <div>{countTasks}</div>;
}

export default TotalTasksCount;

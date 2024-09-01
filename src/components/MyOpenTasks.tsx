import { useEffect, useState } from 'react';

import { useTasksStore } from '@/stores/tasks';

type MyOpenTasksProps = {
  projectId: string;
  userId: string;
};

function MyOpenTasks(props: MyOpenTasksProps) {
  const { projectId, userId } = props;
  const { countMyTasks } = useTasksStore();

  const [countTasks, setCountTasks] = useState(0);

  useEffect(() => {
    const fetchCountTasks = async () => {
      const count = await countMyTasks(projectId, userId);

      setCountTasks(count);
    };

    fetchCountTasks();
  }, [countMyTasks, projectId, userId]);

  return <div>{countTasks}</div>;
}

export default MyOpenTasks;

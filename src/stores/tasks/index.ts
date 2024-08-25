import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { NewActivity } from '@/types/activity';
import type { NewTask, Task } from '@/types/task';
import api from '@/utils/axiosInstance';

import { useActivitiesStore } from '../activity';

type State = {
  tasks: Task[];
  taskDetails: Task | null;
};

type Actions = {
  fetchListTasks: (projectId: string) => void;
  createNewTask: (newTask: NewTask) => void;
  updatePositionTask: (taskId: any, columnId: any, pos?: number) => void;
  deleteTask: (taskId: string) => void;
  fetchTaskDetails: (taskId: string) => void;
  updateTaskDetails: (taskId: string, data: any) => void;
  reset: () => void;
};

const initialState: State = {
  tasks: [],
  taskDetails: null,
};

const { createNewActivity } = useActivitiesStore.getState();

export const useTasksStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        fetchListTasks: async (projectId: string) => {
          const response = await api.get<any>('/items/Task', {
            params: {
              filter: {
                project_id: {
                  _eq: projectId,
                },
              },
              fields: '*,assignee.*,assignee.avatar.*',
            },
          });
          set({ tasks: response.data.data });
        },

        createNewTask: async (newTask: NewTask) => {
          const response = await api.post<any>('/items/Task', newTask);

          const newActivity: NewActivity = {
            action_type: 'CREATED',
            user_id: newTask.reporter,
            project_id: newTask.project_id,
            resource_id: response.data.data.id,
            timestamp: new Date().toISOString(),
          };

          await createNewActivity(newActivity);
        },

        updatePositionTask: async (
          taskId: any,
          columnId: any,
          pos?: number,
        ) => {
          await api.patch(`/items/Task/${taskId}`, {
            column_id: columnId,
            pos,
          });
        },

        deleteTask: async (taskId: any) => {
          await api.delete(`/items/Task/${taskId}`);
        },

        fetchTaskDetails: async (taskId: any) => {
          const response = await api.get<any>(`/items/Task/${taskId}`);
          set({ taskDetails: response.data.data });
        },

        updateTaskDetails: async (taskId: any, data: any) => {
          await api.patch(`/items/Task/${taskId}`, data);
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'tasks-storage',
        storage: createJSONStorage(() => sessionStorage),
      },
    ),
  ),
);

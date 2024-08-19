import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { NewTask, Task } from '@/types/board';
import api from '@/utils/axiosInstance';

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
  reset: () => void;
};

const initialState: State = {
  tasks: [],
  taskDetails: null,
};
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
          await api.post<any>('/items/Task', newTask);
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

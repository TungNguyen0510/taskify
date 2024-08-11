import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { NewTask, Task } from '@/types/board';
import api from '@/utils/axiosInstance';

type State = {
  tasks: Task[];
};

type Actions = {
  fetchListTasks: (projectId: string) => void;
  createNewTask: (newTask: NewTask) => void;
  updatePositionTask: (taskId: any, columnId: any, pos?: number) => void;
  reset: () => void;
};

const initialState: State = {
  tasks: [],
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
            columnId,
            pos,
          });
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'tasks-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

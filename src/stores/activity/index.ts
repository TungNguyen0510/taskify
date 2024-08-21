import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { Activity } from '@/types/activity';
import api from '@/utils/axiosInstance';

type State = {
  activities: Activity[];
};

type Actions = {
  fetchListActivities: (key: string) => void;
  createNewActivity: (newActivity: any) => void;
  reset: () => void;
};

const initialState: State = {
  activities: [],
};
export const useActivitiesStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        fetchListActivities: async (key: string) => {
          const response = await api.get<any>('/items/ActivityLog', {
            params: {
              filter: {
                resource_key: key,
              },
              sort: ['-timestamp'],
            },
          });
          set({ activities: response.data.data });
        },

        createNewActivity: async (newActivity: any) => {
          await api.post<any>('/items/ActivityLog', newActivity);
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

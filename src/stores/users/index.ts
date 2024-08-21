import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import api from '@/utils/axiosInstance';

type State = {
  users: any[];
};

type Actions = {
  fetchListUsers: () => void;
  reset: () => void;
};

const initialState: State = {
  users: [],
};
export const useUsersStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        fetchListUsers: async () => {
          const response = await api.get<any>(`/users`, {
            params: {
              fields: '*,avatar.*',
            },
          });
          set({ users: response.data.data });
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

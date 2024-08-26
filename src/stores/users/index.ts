import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import api from '@/utils/axiosInstance';

type State = {
  users: any[];
  currentUser: any;
};

type Actions = {
  fetchListUsers: () => Promise<any[]>;
  fetchCurrentUser: (userId: string) => Promise<any>;
  updateCurrentUser: (userId: string, data: any) => void;
  reset: () => void;
};

const initialState: State = {
  users: [],
  currentUser: null,
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
              sort: ['email'],
            },
          });
          set({ users: response.data.data });

          return response.data.data;
        },

        fetchCurrentUser: async (userId: string) => {
          const response = await api.get<any>(`/users/${userId}`, {
            params: {
              fields: '*,avatar.*',
            },
          });
          set({ currentUser: response.data.data });

          return response.data.data;
        },

        updateCurrentUser: async (userId: string, data: any) => {
          const response = await api.patch<any>(`/users/${userId}`, data);

          set({ currentUser: response.data.data });
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

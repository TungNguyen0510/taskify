import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { Project } from '@/types/project';
import api from '@/utils/axiosInstance';

type State = {
  projects: Project[];
  currentProject: Project | null;
};

type Actions = {
  fetchListProjects: (userId: string) => void;
  fetchCurrentProject: (projectId: string) => void;
  reset: () => void;
};

const initialState: State = {
  projects: [],
  currentProject: null,
};

export const useProjectsStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        fetchListProjects: async (userId: string) => {
          const response = await api.get<any>('/items/Project', {
            params: {
              fields: '*,owner.*,users.*,users.User_id.*',
              filter: {
                owner: {
                  clerk_user_id: {
                    _eq: userId,
                  },
                },
              },
            },
          });

          set({ projects: response.data.data });
        },

        fetchCurrentProject: async (projectId: string) => {
          const response = await api.get<any>(`/items/Project/${projectId}`, {
            params: {
              fields: '*,owner.*,users.*,users.User_id.*',
            },
          });
          set({ currentProject: response.data.data });
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'projects-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

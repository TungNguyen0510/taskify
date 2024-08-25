import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { Project } from '@/types/project';
import { AppConfig } from '@/utils/AppConfig';
import api from '@/utils/axiosInstance';

type State = {
  projects: Project[];
  currentProject: Project | null;
};

type Actions = {
  fetchListProjects: (userId: string) => void;
  fetchCurrentProject: (projectId: string) => void;
  updateCurrentProject: (projectId: string, data: any) => void;
  createNewProject: (newProject: any) => void;
  removeProjectMember: (memberId: number) => void;
  updateProjectMember: (memberId: number, data: any) => void;
  addProjectMember: (newMember: any) => void;
  inviteUser: (email: string) => void;
  reset: () => void;
};

const initialState: State = {
  projects: [],
  currentProject: null,
};

export const useProjectsStore = create<State & Actions>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        fetchListProjects: async (userId: string) => {
          const response = await api.get<any>('/items/Project', {
            params: {
              sort: ['date_created'],
              filter: {
                project_members: {
                  directus_users_id: {
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
              fields: '*,project_members.*',
            },
          });
          set({ currentProject: response.data.data });
        },

        updateCurrentProject: async (projectId: string, data: any) => {
          await api.patch<any>(`/items/Project/${projectId}`, data);
        },

        createNewProject: async (newProject: any) => {
          const { addProjectMember } = get();
          const response = await api.post<any>('/items/Project', newProject);
          await api.post<any>('/items/Column', [
            {
              status: 'To Do',
              project_id: response.data.data.id,
              isDone: false,
              isTodo: true,
              pos: 1,
            },
            {
              status: 'In Progress',
              project_id: response.data.data.id,
              isDone: false,
              isTodo: false,
              pos: 2,
            },
            {
              status: 'Done',
              project_id: response.data.data.id,
              isDone: true,
              isTodo: false,
              pos: 3,
            },
          ]);

          await addProjectMember({
            Project_id: response.data.data.id,
            directus_users_id: newProject.owner,
            project_role: 'OWNER',
          });
        },

        addProjectMember: async (newMember: any) => {
          await api.post<any>('/items/Project_directus_users', newMember);
        },

        updateProjectMember: async (memberId: number, data: any) => {
          await api.patch<any>(
            `/items/Project_directus_users/${memberId}`,
            data,
          );
        },

        removeProjectMember: async (memberId: number) => {
          await api.delete(`/items/Project_directus_users/${memberId}`);
        },

        inviteUser: async (email: string) => {
          await api.post<any>('/users/invite', {
            email,
            role: process.env.NEXT_PUBLIC_MEMBER_ROLE,
            invite_url: `${AppConfig.appURL}/accept-invite`,
          });
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

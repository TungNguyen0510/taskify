import { create } from 'zustand';
import { createJSONStorage, devtools, persist } from 'zustand/middleware';

import type { Column, NewColumn } from '@/types/board';
import api from '@/utils/axiosInstance';

type State = {
  columns: Column[];
};

type Actions = {
  fetchListColumns: (projectId: string) => void;
  createColumn: (column: NewColumn) => void;
  updateTitleColumn: (columnId: string, title: string) => void;
  updatePositionColumn: (columnId: any, pos: number) => void;
  deleteColumn: (columnId: string) => void;
  reset: () => void;
};

const initialState: State = {
  columns: [],
};

export const useColumnsStore = create<State & Actions>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        fetchListColumns: async (projectId: string) => {
          const response = await api.get<any>('/items/Column', {
            params: {
              filter: {
                project_id: {
                  _eq: projectId,
                },
              },
            },
          });
          set({ columns: response.data.data });
        },

        createColumn: async (newColumn: NewColumn) => {
          await api.post('/items/Column', newColumn);
        },

        updateTitleColumn: async (columnId: string, title: string) => {
          await api.patch(`/items/Column/${columnId}`, {
            title,
          });
        },

        updatePositionColumn: async (columnId: any, pos: number) => {
          await api.patch(`/items/Column/${columnId}`, {
            pos,
          });
        },

        deleteColumn: async (columnId: string) => {
          await api.delete(`/items/Column/${columnId}`);
        },

        reset: () => {
          set(initialState);
        },
      }),
      {
        name: 'columns-storage',
        storage: createJSONStorage(() => localStorage),
      },
    ),
  ),
);

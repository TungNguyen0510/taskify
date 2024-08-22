import type { Role } from '@/types/role';

export type ProjectMember = {
  id: number;
  Project_id: string;
  directus_users_id: string;
  project_role: Role;
};

export type Project = {
  id: string;
  name: string;
  key: string;
  description: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  tasks_count: number;
  owner: string;
  project_members: ProjectMember[];
};

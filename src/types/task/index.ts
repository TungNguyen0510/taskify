export type Task = {
  id: string;
  summary: string;
  key: string;
  description: string;
  user_created: string | null;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  pos: number;
  column_id: string;
  project_id: string;
  due_date: string;
  assignee: string;
  reporter: string;
  isDone: boolean;
  isBacklog: boolean;
};

export type NewTask = {
  project_id: string;
  column_id: string;
  reporter: string;
  summary: string;
  key: string;
  pos: number;
};

export type Column = {
  id: string;
  status: string;
  pos: number;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  project_id: string;
  isDone: boolean;
  isTodo: boolean;
};

export type NewColumn = {
  project_id: string;
  status: string;
  pos: number;
};

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
};

export type NewTask = {
  project_id: string;
  column_id: string;
  reporter: string;
  summary: string;
  key: string;
  pos: number;
};

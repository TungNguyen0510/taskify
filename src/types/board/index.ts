export type Column = {
  id: string;
  title: string;
  pos: number;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  project_id: string;
};

export type NewColumn = {
  project_id: string;
  title: string;
  pos: number;
};

export type Task = {
  id: string;
  summary: string;
  description: string;
  user_created: string | null;
  date_created: string;
  user_updated: string | null;
  date_updated: string | null;
  pos: number;
  column_id: string;
  project_id: string;
};

export type NewTask = {
  project_id: string;
  column_id: string;
  summary: string;
  pos: number;
};

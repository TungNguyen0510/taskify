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
  name: string;
  sort: string | null;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
  pos: number;
  column_id: string;
};

export type NewTask = {
  project_id: string;
  column_id: string;
  name: string;
  pos: number;
};

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

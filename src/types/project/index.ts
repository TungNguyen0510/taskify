export type User = {
  id: number;
  Project_id: string;
};

export type Project = {
  id: string;
  title: string;
  key: string;
  user_created: string;
  date_created: string;
  user_updated: string;
  date_updated: string;
};

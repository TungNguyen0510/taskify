export type Activity = {
  id: string;
  user_id: string;
  project_id: string;
  action_type: 'CREATED' | 'UPDATED' | 'DELETED';
  resource_id: string;
  timestamp: string;
  field: string;
};

export type NewActivity = {
  user_id: string;
  project_id: string;
  action_type: 'CREATED' | 'UPDATED' | 'DELETED';
  resource_id: string;
  timestamp: string;
  field?: string;
};

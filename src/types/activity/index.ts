export type Activity = {
  id: string;
  user_id: string;
  action_type: 'CREATED' | 'UPDATED' | 'DELETED';
  resource_key: string;
  timestamp: string;
  field: string;
};

import { Avatar } from '@nextui-org/react';
import { useEffect, useState } from 'react';

import { useUsersStore } from '@/stores/users';
import type { Activity } from '@/types/activity';
import { AppConfig } from '@/utils/AppConfig';
import { formatDateFull, getInitialsName } from '@/utils/Helpers';

function ActivityCard({ activity }: { activity: Activity }) {
  const { users, fetchListUsers } = useUsersStore();

  const [currentUser, setCurrentUser] = useState<any | null | undefined>(null);
  useEffect(() => {
    fetchListUsers();
  }, [fetchListUsers]);

  useEffect(() => {
    setCurrentUser(users.find((user: any) => user.id === activity.user_id));
  }, [users, setCurrentUser, currentUser, activity.user_id]);

  const renderActionText = (action_type: string) => {
    switch (action_type) {
      case 'CREATED':
        return 'created the';
      case 'UPDATED':
        return 'updated the';
      case 'DELETED':
        return 'deleted the';
      default:
        return 'unknown action';
    }
  };
  return (
    <div className="flex items-center gap-2">
      <div>
        {currentUser && (
          <Avatar
            size="sm"
            name={getInitialsName(
              currentUser?.first_name,
              currentUser?.last_name,
            )}
            showFallback
            src={
              `${AppConfig.backendURL}/assets/${currentUser.avatar.id}` ?? ''
            }
          />
        )}
      </div>
      <div className="flex gap-1">
        <div className="font-semibold text-slate-800">
          {currentUser?.first_name} {currentUser?.last_name}
        </div>
        <div className="text-zinc-500">
          {renderActionText(activity.action_type)}
        </div>
        <div className="font-semibold text-slate-800">
          {activity.field ? `${activity.field}` : 'Task'}
        </div>
        <div className="text-zinc-500">
          at {formatDateFull(activity.timestamp)}
        </div>
      </div>
    </div>
  );
}

export default ActivityCard;

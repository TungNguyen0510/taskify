import { Avatar, Tooltip } from '@nextui-org/react';

import { useUsersStore } from '@/stores/users';
import { AppConfig } from '@/utils/AppConfig';
import { getInitialsName } from '@/utils/Helpers';

import AvatarUser from './AvatarUser';

interface UserAssigneeProps {
  id: string;
}
function UserAssignee(props: UserAssigneeProps) {
  const { id } = props;

  const { users } = useUsersStore();

  const currentUser = users.find((u: any) => u.id === id);

  return (
    <Tooltip
      showArrow
      placement="bottom-start"
      color="foreground"
      radius="sm"
      content={
        currentUser ? (
          <div className="flex items-center gap-2">
            <div>Assignee:</div>
            <div className="flex items-center gap-1">
              <AvatarUser userId={currentUser?.id} isHiddenName />
              <div>
                <div>
                  {currentUser?.first_name && currentUser?.last_name
                    ? `${currentUser?.first_name} ${currentUser?.last_name}`
                    : '-- --'}
                </div>
                <div className="text-xs">{currentUser?.email}</div>
              </div>
            </div>
          </div>
        ) : (
          'Unassigned'
        )
      }
    >
      <Avatar
        size="sm"
        name={
          currentUser?.first_name && currentUser?.last_name
            ? getInitialsName(currentUser.first_name, currentUser.last_name)
            : ''
        }
        showFallback
        src={`${AppConfig.backendURL}/assets/${currentUser?.avatar?.id}` ?? ''}
      />
    </Tooltip>
  );
}
export default UserAssignee;

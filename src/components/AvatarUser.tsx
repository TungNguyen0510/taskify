import { Avatar } from '@nextui-org/react';

import { useUsersStore } from '@/stores/users';
import { AppConfig } from '@/utils/AppConfig';
import { getInitialsName } from '@/utils/Helpers';

interface AvatarUserProps {
  userId: string;
  isHiddenName?: boolean;
}

function AvatarUser(props: AvatarUserProps) {
  const { userId, isHiddenName = false } = props;

  const { users } = useUsersStore();

  const currentUser = users.find((u: any) => u.id === userId);

  return (
    <div className="flex items-center gap-1.5">
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

      {!isHiddenName && (
        <div>
          {currentUser?.first_name && currentUser?.last_name
            ? `${currentUser?.first_name} ${currentUser?.last_name}`
            : '-- --'}
        </div>
      )}
    </div>
  );
}

export default AvatarUser;

import { Avatar } from '@nextui-org/react';

import { useUsersStore } from '@/stores/users';
import { AppConfig } from '@/utils/AppConfig';
import { getInitialsName } from '@/utils/Helpers';

interface AvatarUserProps {
  userId: string;
}

function AvatarUser(props: AvatarUserProps) {
  const { userId } = props;

  const { users } = useUsersStore();

  const currentUser = users.find((u: any) => u.id === userId);

  return (
    <div className="flex items-center gap-1.5">
      <Avatar
        size="sm"
        name={getInitialsName(currentUser?.first_name, currentUser?.last_name)}
        showFallback
        src={`${AppConfig.backendURL}/assets/${currentUser?.avatar?.id}` ?? ''}
      />

      <div>
        {currentUser
          ? `${currentUser?.first_name} ${currentUser?.last_name}`
          : ''}
      </div>
    </div>
  );
}

export default AvatarUser;

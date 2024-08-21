import { Avatar, Tooltip } from '@nextui-org/react';

import { useUsersStore } from '@/stores/users';
import { getInitialsName } from '@/utils/Helpers';

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
      color="foreground"
      radius="sm"
      content={
        currentUser ? (
          <div className="flex items-center gap-2">
            <div>Assignee:</div>
            <div className="flex items-center gap-1">
              <Avatar
                as="button"
                size="sm"
                className="size-6 text-tiny transition-transform"
                name={
                  currentUser
                    ? getInitialsName(
                        currentUser?.first_name,
                        currentUser?.last_name,
                      )
                    : ''
                }
                showFallback
                src={
                  `${process.env.NEXT_PUBLIC_DIRECTUS_API}/assets/${currentUser?.avatar?.id}` ??
                  ''
                }
              />
              <div>
                <div>{`${currentUser?.first_name} ${currentUser?.last_name}`}</div>
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
        as="button"
        size="sm"
        className="transition-transform"
        name={
          currentUser
            ? getInitialsName(currentUser?.first_name, currentUser?.last_name)
            : ''
        }
        showFallback
        src={
          `${process.env.NEXT_PUBLIC_DIRECTUS_API}/assets/${currentUser?.avatar?.id}` ??
          ''
        }
      />
    </Tooltip>
  );
}
export default UserAssignee;

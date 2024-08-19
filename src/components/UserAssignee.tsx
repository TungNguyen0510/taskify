import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react';

interface UserAssigneeProps {
  user: any;
}
function UserAssignee(props: UserAssigneeProps) {
  const { user } = props;

  const nameIcon = user?.name
    ?.split(' ')
    .map((word: any) => word[0])
    .join('')
    .toUpperCase();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Avatar
          as="button"
          size="sm"
          className="transition-transform"
          name={nameIcon}
          showFallback
          src={
            `${process.env.NEXT_PUBLIC_DIRECTUS_API}/assets/${user?.avatar.id}` ??
            ''
          }
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Assignee" variant="flat">
        <DropdownSection aria-label="Info" showDivider>
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </DropdownItem>
        </DropdownSection>
      </DropdownMenu>
    </Dropdown>
  );
}
export default UserAssignee;

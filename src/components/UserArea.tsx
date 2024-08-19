'use client';

import {
  Avatar,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';

function UserArea() {
  const session = useSession();

  const user = session.data?.user;

  const nameIcon = user?.name
    ?.split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase();
  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Avatar
          as="button"
          className="transition-transform"
          name={nameIcon}
          showFallback
          src={user?.image ?? ''}
        />
      </DropdownTrigger>
      <DropdownMenu aria-label="Profile Actions" variant="flat">
        <DropdownSection aria-label="Info" showDivider>
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-semibold">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </DropdownItem>
        </DropdownSection>

        <DropdownSection aria-label="Settings" showDivider>
          <DropdownItem key="settings">My Settings</DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">Analytics</DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
        </DropdownSection>

        <DropdownItem
          key="logout"
          color="danger"
          className="cursor-pointer"
          onClick={() => signOut()}
        >
          Log Out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}

export default UserArea;

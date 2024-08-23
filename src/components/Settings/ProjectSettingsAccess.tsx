/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { capitalize } from '@/utils/Helpers';

import AvatarUser from '../AvatarUser';
import Icon from '../Icon';
import ConfirmModal from '../Modal/ConfirmModal';

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' },
];

const roleOptions = [
  { label: 'Owner', value: 'OWNER' },
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Member', value: 'MEMBER' },
];

function ProjectSettingsAccess({ params }: { params: { projectId: string } }) {
  const {
    currentProject,
    fetchCurrentProject,
    removeProjectMember,
    updateProjectMember,
  } = useProjectsStore();
  const { users, fetchListUsers } = useUsersStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchListUsers();
      await fetchCurrentProject(params.projectId);
    };
    fetchData();
  }, []);

  const projectMembers = currentProject?.project_members;

  const filteredListMemberTemp = projectMembers
    ?.map((pUser) => {
      const user = users.find((u) => u.id === pUser.directus_users_id);
      return user
        ? {
            id: pUser.id,
            memberId: user.id,
            name:
              user.first_name && user.last_name
                ? `${user.first_name} ${user.last_name}`
                : 'Unknown',
            email: user.email,
            role: pUser.project_role,
          }
        : null;
    })
    .filter(Boolean)
    .sort((a, b) => {
      if (a?.role === 'OWNER') return -1;
      if (b?.role === 'OWNER') return 1;
      return 0;
    });

  const [isConfirmRemoveMember, setIsConfirmRemoveMember] = useState(false);
  const [currentMemberName, setCurrentMemberName] = useState('');
  const [memberIdToRemove, setMemberIdToRemove] = useState<number>(-1);

  const [filterValue, setFilterValue] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState(
    new Set(['OWNER', 'ADMIN', 'MEMBER']),
  );

  const onClear = React.useCallback(() => {
    setFilterValue('');
  }, []);

  const onSearchChange = React.useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue('');
    }
  }, []);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = React.useMemo(() => {
    let filteredMembers = [...(filteredListMemberTemp || [])];

    if (hasSearchFilter) {
      filteredMembers = filteredMembers.filter((member) =>
        member?.email?.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    filteredMembers = filteredMembers.filter(
      (member) => member && Array.from(roleFilter).includes(member.role),
    );

    return filteredMembers;
  }, [filteredListMemberTemp, filterValue, hasSearchFilter, roleFilter]);

  const updateRoleMember = async (memberId: number, role: string) => {
    try {
      await updateProjectMember(memberId, {
        project_role: role,
      });

      await fetchCurrentProject(params.projectId);
      toast.success('Updated role member successful!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      toast.error('Failed to update role member!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      throw new Error('Failed to update role member');
    }
  };

  const removeCurrentMember = async (memberId: number) => {
    try {
      await removeProjectMember(memberId);
      await fetchCurrentProject(params.projectId);

      toast.success('Removed member successful!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    } catch (error) {
      toast.success('Failed to remove member!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
      throw new Error('Failed to remove project member');
    }
  };

  const renderCell = React.useCallback((member: any, columnKey: any) => {
    const cellValue = member[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <div>
            {member?.memberId ? (
              <AvatarUser userId={member.memberId} />
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                --
              </div>
            )}
          </div>
        );
      case 'role':
        return (
          <div className="flex items-center justify-center">
            <Select
              className="w-28"
              disabledKeys={
                member.role === 'OWNER' ? ['OWNER', 'ADMIN', 'MEMBER'] : []
              }
              defaultSelectedKeys={[member.role]}
              onChange={(e: any) => {
                updateRoleMember(member.id, e.target.value);
              }}
            >
              {roleOptions.map((role) => (
                <SelectItem key={role.value}>{role.label}</SelectItem>
              ))}
            </Select>
          </div>
        );
      case 'actions':
        return (
          <div className="relative flex items-center justify-center gap-2">
            {currentProject?.owner !== member.memberId && (
              <Button
                isIconOnly
                color="danger"
                className="cursor-pointer text-lg active:opacity-50"
                onClick={() => {
                  setIsConfirmRemoveMember(true);
                  setCurrentMemberName(member.name);
                  setMemberIdToRemove(member.id);
                }}
              >
                <Icon name="delete" />
              </Button>
            )}
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const classNames = React.useMemo(
    () => ({
      wrapper: [
        'max-h-[600px]',
        'max-w-full',
        'scrollbar-1',
        'min-w-[calc(100vw-21.5em)]',
      ],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
      td: [
        // changing the rows border radius
        // first
        'group-data-[first=true]:first:before:rounded-none',
        'group-data-[first=true]:last:before:rounded-none',
        // middle
        'group-data-[middle=true]:before:rounded-none',
        // last
        'group-data-[last=true]:first:before:rounded-none',
        'group-data-[last=true]:last:before:rounded-none',
      ],
    }),
    [],
  );

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full justify-between gap-3">
        <Input
          className="w-full sm:max-w-[44%]"
          placeholder="Search by email..."
          startContent={<Icon name="search" />}
          value={filterValue}
          onClear={() => onClear()}
          onValueChange={onSearchChange}
        />
        <div className="flex gap-3">
          <Dropdown>
            <DropdownTrigger className="hidden sm:flex">
              <Button
                endContent={<Icon name="ChevronDownIcon" />}
                variant="flat"
              >
                Role
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              disallowEmptySelection
              aria-label="Roles Filter"
              closeOnSelect={false}
              selectedKeys={roleFilter}
              selectionMode="multiple"
              onSelectionChange={(keys: 'all' | Set<React.Key>) =>
                setRoleFilter(keys as any)
              }
            >
              {roleOptions.map((role) => (
                <DropdownItem key={role.value} className="capitalize">
                  {capitalize(role.label)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <Button
            color="primary"
            variant="solid"
            endContent={<Icon name="plus" />}
          >
            Add new member
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div>
          <span className="text-small text-default-400">
            Total {filteredListMemberTemp?.length} members
          </span>
        </div>
        <Table
          radius="none"
          classNames={classNames}
          aria-label="List of members"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={
                  ['role', 'actions'].includes(column.uid) ? 'center' : 'start'
                }
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={filteredItems}
            emptyContent="No members found"
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item?.memberId}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal
        backdrop="opaque"
        modalPlacement="top-center"
        comfirmTitle="Confirm remove member"
        comfirmMessage={`Are you sure you want to remove "${currentMemberName}" from the project "${currentProject?.name}"? This action cannot be undone and will revoke all their access to the project.`}
        okTitle="Remove"
        isOpen={isConfirmRemoveMember}
        onClose={() => setIsConfirmRemoveMember(false)}
        onConfirm={() => {
          removeCurrentMember(memberIdToRemove);
          setIsConfirmRemoveMember(false);
        }}
      />
    </div>
  );
}

export default ProjectSettingsAccess;

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
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
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { type Role } from '@/types/role';
import { capitalize } from '@/utils/Helpers';

import AvatarUser from '../AvatarUser';
import Icon from '../Icon';
import AddMemberModal from '../Modal/AddMemberModal';
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
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [currentMemberName, setCurrentMemberName] = useState('');
  const [memberIdToRemove, setMemberIdToRemove] = useState<number>(-1);

  const [filterValue, setFilterValue] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState(
    new Set(['OWNER', 'ADMIN', 'MEMBER']),
  );

  const getDisabledKeys = (role: Role): string[] => {
    if (role === 'OWNER') {
      return ['ADMIN', 'MEMBER'];
    }
    if (role === 'ADMIN' || role === 'MEMBER') {
      return ['OWNER'];
    }
    return [];
  };
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

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

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
              selectionMode="single"
              disallowEmptySelection
              disabledKeys={getDisabledKeys(member.role)}
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

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const bottomContent = useMemo(() => {
    return (
      <div className="flex items-center justify-between p-2">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden w-[30%] justify-end gap-2 sm:flex">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [filteredListMemberTemp?.length, page, pages, onPreviousPage, onNextPage]);

  const classNames = React.useMemo(
    () => ({
      wrapper: [
        'max-h-[600px]',
        'max-w-full',
        'scrollbar-1',
        'min-w-[calc(100vw-21.5em)]',
      ],
      // th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider'],
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
            onClick={() => setIsAddMemberModalOpen(true)}
          >
            Add new member
          </Button>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-small text-default-400">
            Total {filteredListMemberTemp?.length} members
          </span>
          <label className="flex items-center text-small text-default-400">
            Rows per page:
            <select
              className="bg-transparent text-small text-default-400 outline-none"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="30">30</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
        <Table
          radius="none"
          isStriped
          isHeaderSticky
          classNames={classNames}
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
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
            items={items}
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

      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
      />
    </div>
  );
}
export default ProjectSettingsAccess;

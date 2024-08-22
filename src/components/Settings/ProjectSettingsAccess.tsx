/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@nextui-org/react';
import React, { useEffect } from 'react';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';

import AvatarUser from '../AvatarUser';

const columns = [
  { name: 'NAME', uid: 'name' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'ROLE', uid: 'role' },
  { name: 'ACTIONS', uid: 'actions' },
];

function ProjectSettingsAccess({ params }: { params: { projectId: string } }) {
  const { currentProject, fetchCurrentProject } = useProjectsStore();
  const { fetchListUsers } = useUsersStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchListUsers();
      await fetchCurrentProject(params.projectId);
    };
    fetchData();
  }, []);

  const projectMembers = currentProject?.project_members;

  const renderCell = React.useCallback((member: any, columnKey: any) => {
    const cellValue = member[columnKey];

    switch (columnKey) {
      case 'name':
        return (
          <div>
            {member?.directus_users_id ? (
              <AvatarUser userId={member.directus_users_id} />
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );
      case 'role':
        return (
          <div className="flex flex-col">
            <p className=" text-sm capitalize">{member.project_role}</p>
          </div>
        );
      case 'actions':
        return <div className="relative flex items-center gap-2" />;
      default:
        return cellValue;
    }
  }, []);

  const classNames = React.useMemo(
    () => ({
      wrapper: [
        'max-h-[600px]',
        'max-w-5xl',
        'scrollbar-1',
        'min-w-[calc(100vw-18.875em)]',
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
      <div className="flex w-full justify-end">
        <Button color="primary" variant="solid">
          Add member
        </Button>
      </div>

      <div>
        <Table
          radius="none"
          classNames={classNames}
          aria-label="List of members"
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={projectMembers}
            emptyContent="No members found"
            loadingContent={<Spinner label="Loading..." />}
          >
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell>{renderCell(item, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

export default ProjectSettingsAccess;

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */

'use client';

import {
  Button,
  Input,
  Pagination,
  type SortDescriptor,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tooltip,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import type { Project } from '@/types/project';
import {
  formatDateFull,
  formatDateMDY,
  getUserRole,
  resetAllStores,
} from '@/utils/Helpers';

import Icon from '../Icon';
import CreateProjectModal from '../Modal/CreateProjectModal';
import MyOpenTasks from '../MyOpenTasks';
import TotalTasksCount from '../TotalTasksCount';

const headers = [
  { name: 'KEY', uid: 'key', sortable: true, minWidth: '100px' },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'DESCRIPTION', uid: 'description' },
  { name: 'TOTAL TASKS', uid: 'total_tasks' },
  { name: 'MY OPEN TASKS', uid: 'my_tasks' },
  { name: 'MEMBERS', uid: 'members' },
  { name: 'MY ROLE', uid: 'role' },
  { name: 'DATE CREATED', uid: 'date_created' },
];

function YourWorkPage() {
  const session = useSession();

  const userId = session.data?.user.id;

  const { projects, fetchListProjects } = useProjectsStore();

  const { fetchListUsers } = useUsersStore();

  const [isCreatingProject, setIsCreatingProject] = useState(false);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    resetAllStores();
    if (userId) {
      fetchListProjects(userId);
    }
    fetchListUsers();

    setIsLoading(false);
  }, []);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: 'key',
    direction: 'descending',
  });
  const [page, setPage] = useState(1);
  const [filterValue, setFilterValue] = useState('');

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredProjects = [...projects];

    if (hasSearchFilter) {
      filteredProjects = filteredProjects.filter((project) =>
        project.name.toLowerCase().includes(filterValue.toLowerCase()),
      );
    }

    return filteredProjects;
  }, [projects, filterValue]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column as keyof Project];
      const second = b[sortDescriptor.column as keyof Project];
      let cmp;
      if (first === null || second === null) {
        cmp = 0;
      } else if (first < second) {
        cmp = -1;
      } else if (first > second) {
        cmp = 1;
      } else {
        cmp = 0;
      }

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  const onSearchChange = useCallback((value: any) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const onNextPage = useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e: any) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const renderCell = useCallback((project: any, columnKey: any) => {
    const cellValue = project[columnKey];

    switch (columnKey) {
      case 'key':
        return (
          <div className="flex items-center gap-1">
            <div className="text-nowrap text-xs text-zinc-500">
              {project.key}
            </div>
          </div>
        );
      case 'description': {
        return <div className="flex items-center">{project.description}</div>;
      }
      case 'total_tasks': {
        return (
          <div>
            <TotalTasksCount projectId={project.id} />
          </div>
        );
      }
      case 'my_tasks': {
        return (
          <div>
            {userId ? (
              <MyOpenTasks projectId={project.id} userId={userId} />
            ) : null}
          </div>
        );
      }

      case 'members':
        return (
          <div>
            {project.project_members ? (
              <div className="flex items-center justify-center">
                {project.project_members.length}
              </div>
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );
      case 'role':
        return (
          <div>
            {project.project_members ? (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                {getUserRole(project.project_members, userId)}
              </div>
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );

      case 'date_created':
        return (
          <div>
            {project.date_created ? (
              <Tooltip
                showArrow
                color="foreground"
                radius="sm"
                content={`Date created: ${formatDateFull(project.date_created)}`}
              >
                <p className="w-fit text-nowrap rounded-md bg-zinc-200 px-2 py-1 font-semibold">
                  {formatDateMDY(project.date_created)}
                </p>
              </Tooltip>
            ) : (
              <div className="w-fit rounded-md bg-zinc-200 px-2 py-1 hover:text-zinc-900">
                None
              </div>
            )}
          </div>
        );

      default:
        return cellValue;
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex items-end justify-between gap-3">
          <Input
            className="w-full sm:max-w-[34%]"
            placeholder="Search by name..."
            startContent={<Icon name="search" />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
          />

          <Button color="primary" onClick={() => setIsCreatingProject(true)}>
            Create new project
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-small text-default-400">
              Total {projects.length} projects
            </span>
          </div>
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
      </div>
    );
  }, [
    filterValue,
    onRowsPerPageChange,
    projects.length,
    onSearchChange,
    hasSearchFilter,
  ]);

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
  }, [filteredItems.length, page, pages, onPreviousPage, onNextPage]);

  const classNames = useMemo(
    () => ({
      wrapper: [
        'max-h-[600px]',
        'max-w-5xl',
        'scrollbar-1',
        'min-w-[calc(100vw-3.875em)]',
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

  const route = useRouter();

  const goToProject = (projectId: string) => {
    route.push(`/u/project/${projectId}/list`);
  };

  return (
    <>
      <div className="min-h-[calc(100vh-56px)] p-6">
        <Table
          aria-label="List projects"
          radius="none"
          color="primary"
          isStriped
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={classNames}
          sortDescriptor={sortDescriptor as SortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={(descriptor: SortDescriptor) =>
            setSortDescriptor(descriptor as any)
          }
          onRowAction={(key: any) => goToProject(key)}
        >
          <TableHeader columns={headers}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={
                  column.uid === 'members' ||
                  column.uid === 'total_tasks' ||
                  column.uid === 'my_tasks'
                    ? 'center'
                    : 'start'
                }
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent="No projects found"
            items={sortedItems}
            isLoading={isLoading}
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

      <CreateProjectModal
        isOpen={isCreatingProject}
        onClose={() => setIsCreatingProject(false)}
      />
    </>
  );
}

export default YourWorkPage;

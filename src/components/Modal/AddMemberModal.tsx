/* eslint-disable react-hooks/exhaustive-deps */
import {
  Autocomplete,
  AutocompleteItem,
  Avatar,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Select,
  SelectItem,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { useProjectsStore } from '@/stores/projects';
import { useUsersStore } from '@/stores/users';
import { AppConfig } from '@/utils/AppConfig';
import { getInitialsName } from '@/utils/Helpers';

const roleSelect = [
  { label: 'Admin', value: 'ADMIN' },
  { label: 'Member', value: 'MEMBER' },
];
interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AddMemberModal(props: AddMemberModalProps) {
  const { isOpen, onClose } = props;

  const { users, fetchListUsers } = useUsersStore();

  const { currentProject, fetchCurrentProject, addProjectMember, inviteUser } =
    useProjectsStore();

  const [email, setEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<React.Key | null>(null);
  const [role, setRole] = useState<string>('MEMBER');

  useEffect(() => {
    const fetchData = async () => {
      await fetchListUsers();
    };
    fetchData();
  }, []);

  const existingUserIds = new Set(
    currentProject?.project_members.map((member) => member.directus_users_id),
  );

  const filteredUsers = users.filter((user) => !existingUserIds.has(user.id));

  const reset = () => {
    setEmail(null);
    setUserId(null);
    setRole('MEMBER');
  };

  const addMember = async () => {
    const data = {
      Project_id: currentProject?.id,
      directus_users_id: userId,
      project_role: role,
    };

    if (userId && email) {
      try {
        await addProjectMember(data);

        toast.success('Add member successful!', {
          position: 'bottom-left',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        if (currentProject) {
          await fetchCurrentProject(currentProject.id);
        }
        reset();
      } catch (error) {
        toast.error('Failed to add member!', {
          position: 'bottom-left',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });

        throw new Error('Failed to add member');
      }
    } else if (email && !userId) {
      try {
        await inviteUser(email);

        const updatedUsers = await fetchListUsers();

        const currentInviteUserId = updatedUsers.find(
          (user) => user.email === email,
        )?.id;

        const currentInviteUser = {
          Project_id: currentProject?.id,
          directus_users_id: currentInviteUserId,
          project_role: role,
        };

        if (currentInviteUserId) {
          await addProjectMember(currentInviteUser);
        }

        toast.success('Invite member successful!', {
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
        toast.error('Failed to invite member!', {
          position: 'bottom-left',
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        });
      }
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      placement="top-center"
      size="xl"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1">
          Add new member
        </ModalHeader>
        <ModalBody>
          <div className="flex items-center gap-4 pb-10">
            <Autocomplete
              variant="bordered"
              placeholder="Search by email"
              labelPlacement="inside"
              className="w-full"
              size="md"
              defaultItems={filteredUsers}
              allowsCustomValue
              onInputChange={setEmail}
              onSelectionChange={setUserId}
            >
              {(user) => (
                <AutocompleteItem key={user.id} textValue={user.email}>
                  <div className="flex items-center gap-2">
                    <Avatar
                      name={
                        user?.first_name && user?.first_name
                          ? getInitialsName(user.first_name, user.first_name)
                          : ''
                      }
                      showFallback
                      className="shrink-0"
                      size="sm"
                      src={
                        `${AppConfig.backendURL}/assets/${user?.avatar?.id}` ??
                        ''
                      }
                    />
                    <div className="flex flex-col">
                      <span className="text-small">
                        {user?.first_name && user?.first_name
                          ? `${user.first_name} ${user.last_name}`
                          : '-- --'}
                      </span>
                      <span className="text-tiny text-default-400">
                        {user.email}
                      </span>
                    </div>
                  </div>
                </AutocompleteItem>
              )}
            </Autocomplete>

            <Select
              className="w-28 min-w-28"
              selectionMode="single"
              disallowEmptySelection
              defaultSelectedKeys={['MEMBER']}
              onChange={(e: any) => {
                setRole(e.target.value);
              }}
            >
              {roleSelect.map((item) => (
                <SelectItem key={item.value}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="flat"
            onPress={() => {
              reset();
              onClose();
            }}
          >
            Cancel
          </Button>
          <Button
            color="primary"
            isDisabled={!userId && !email}
            onPress={() => {
              addMember();
              reset();
            }}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
export default AddMemberModal;

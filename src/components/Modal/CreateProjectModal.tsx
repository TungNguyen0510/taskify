import { zodResolver } from '@hookform/resolvers/zod';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
} from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { useProjectsStore } from '@/stores/projects';

const schema = z.object({
  projectName: z
    .string()
    .min(1, { message: 'Project name is required' })
    .max(50, { message: 'Project name must be less than 50 characters' }),
  projectKey: z
    .string()
    .min(1, { message: 'Project key is required' })
    .max(10, { message: 'Project key must be less than 10 characters' }),
  projectDes: z.string().max(255, {
    message: 'Project description must be less than 255 characters',
  }),
});

type FormData = z.infer<typeof schema>;

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}
function CreateProjectModal(props: CreateProjectModalProps) {
  const { isOpen, onClose } = props;

  const session = useSession();

  const { createNewProject, fetchListProjects } = useProjectsStore();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      projectName: '',
      projectKey: '',
      projectDes: '',
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;
    await createNewProject({
      name: data.projectName,
      key: data.projectKey,
      description: data.projectDes,
      owner: session.data?.user.id,
    });

    toast.success('Project created successfully!', {
      position: 'bottom-left',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

    if (session.data?.user.id) {
      await fetchListProjects(session.data?.user.id);
    }

    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        reset();
        onClose();
      }}
      placement="top-center"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1">
          Create new project
        </ModalHeader>
        <ModalBody>
          <div>
            <Input
              isRequired
              isClearable
              autoFocus
              label="Project name"
              labelPlacement="outside"
              placeholder="Enter project name"
              variant="bordered"
              {...register('projectName')}
            />
            {errors.projectName && (
              <p className="pl-2 text-xs text-danger">
                {errors.projectName.message}
              </p>
            )}
          </div>
          <div>
            <Input
              isRequired
              isClearable
              label="Project key"
              labelPlacement="outside"
              placeholder="Enter project key"
              variant="bordered"
              {...register('projectKey')}
            />
            {errors.projectKey && (
              <p className="pl-2 text-xs text-danger">
                {errors.projectKey.message}
              </p>
            )}
          </div>
          <div>
            <Textarea
              label="Description"
              labelPlacement="outside"
              placeholder="Enter project description"
              variant="bordered"
              {...register('projectDes')}
            />
            {errors.projectDes && (
              <p className="pl-2 text-xs text-danger">
                {errors.projectDes.message}
              </p>
            )}
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
            isLoading={isSubmitting}
            onPress={() => handleSubmit(onSubmit)()}
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateProjectModal;

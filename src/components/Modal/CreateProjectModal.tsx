/* eslint-disable no-restricted-globals */

'use client';

import 'react-datepicker/dist/react-datepicker.css';

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
import DatePicker from 'react-datepicker';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { useProjectsStore } from '@/stores/projects';

const schema = z
  .object({
    projectName: z
      .string()
      .min(1, { message: 'Project name is required' })
      .max(50, { message: 'Project name must be less than 50 characters' }),
    projectKey: z
      .string()
      .min(1, { message: 'Project key is required' })
      .max(10, { message: 'Project key must be less than 10 characters' }),
    start_date: z
      .date({ required_error: 'Start date is required' })
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid start date',
      }),
    end_date: z
      .date({ required_error: 'End date is required' })
      .refine((date) => !isNaN(date.getTime()), {
        message: 'Invalid end date',
      }),
    projectDes: z.string().max(255, {
      message: 'Project description must be less than 255 characters',
    }),
  })
  .refine((data) => new Date(data.start_date) <= new Date(data.end_date), {
    message: 'End date must be after or equal to start date',
    path: ['end_date'],
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
    control,
    handleSubmit,
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
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
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
      scrollBehavior="inside"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col items-center gap-1">
          Create new project
        </ModalHeader>
        <ModalBody>
          <div>
            <Controller
              name="projectName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Project name"
                  labelPlacement="outside"
                  placeholder="Enter project name"
                  variant="bordered"
                />
              )}
            />
            {errors.projectName && (
              <p className="pl-2 text-xs text-danger">
                {errors.projectName.message}
              </p>
            )}
          </div>

          <div>
            <Controller
              name="projectKey"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  isRequired
                  label="Project key"
                  labelPlacement="outside"
                  placeholder="Enter project key"
                  variant="bordered"
                />
              )}
            />
            {errors.projectKey && (
              <p className="pl-2 text-xs text-danger">
                {errors.projectKey.message}
              </p>
            )}
          </div>

          <div className="w-full items-center gap-4 md:flex">
            <div className="flex w-1/2 flex-col gap-1">
              <div className="text-small text-[#11181C]">
                Start date <span className="text-danger-500">*</span>
              </div>
              <Controller
                name="start_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="h-10 w-[383.33px] rounded-xl border-2 border-default-200 px-3 md:w-full"
                    selected={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.start_date && (
                <p className="w-full pl-2 text-xs text-danger">
                  {errors.start_date.message}
                </p>
              )}
            </div>

            <div className="flex w-1/2 flex-col gap-1">
              <div className="text-small text-[#11181C]">
                End date <span className="text-danger-500">*</span>
              </div>
              <Controller
                name="end_date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    className="h-10 w-[383.33px] rounded-xl border-2 border-default-200 px-3 md:w-full"
                    selected={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.end_date && (
                <p className="w-full pl-2 text-xs text-danger">
                  {errors.end_date.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Controller
              name="projectDes"
              control={control}
              render={({ field }) => (
                <Textarea
                  {...field}
                  label="Description"
                  labelPlacement="outside"
                  placeholder="Enter project description"
                  variant="bordered"
                />
              )}
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

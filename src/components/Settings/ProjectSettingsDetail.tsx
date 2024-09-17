/* eslint-disable no-restricted-globals */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import 'react-datepicker/dist/react-datepicker.css';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useEffect } from 'react';
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

function ProjectSettingsDetail({ params }: { params: { projectId: string } }) {
  const { currentProject, fetchCurrentProject, updateCurrentProject } =
    useProjectsStore();

  const {
    handleSubmit,
    control,
    formState: { errors, isValid, isSubmitting },
    reset,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (currentProject) {
      reset({
        projectName: currentProject.name,
        projectKey: currentProject.key,
        projectDes: currentProject.description,
        start_date: new Date(currentProject.start_date),
        end_date: new Date(currentProject.end_date),
      });
    }
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;

    await updateCurrentProject(params.projectId, {
      name: data.projectName,
      key: data.projectKey,
      description: data.projectDes,
    });

    toast.success('Project settings updated successfully!', {
      position: 'bottom-left',
      autoClose: 1500,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

    await fetchCurrentProject(params.projectId);
  };

  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-[400px] flex-col justify-center gap-4">
        <p className="text-xs text-zinc-700">
          Required fields are marked with an asterisk{' '}
          <span className="text-base text-danger">*</span>
        </p>

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
                  className="h-10 w-[383.33px] rounded-xl border-2 border-default-200 px-3 text-small font-normal md:w-full"
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
                  className="h-10 w-[383.33px] rounded-xl border-2 border-default-200 px-3 text-small font-normal md:w-full"
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

        <div className="flex w-full justify-end">
          <Button
            color="primary"
            isLoading={isSubmitting}
            isDisabled={
              currentProject?.name === watch('projectName') &&
              currentProject?.key === watch('projectKey') &&
              currentProject?.description === watch('projectDes') &&
              currentProject?.start_date ===
                watch('start_date')?.toISOString() &&
              currentProject?.end_date === watch('end_date')?.toISOString()
            }
            onPress={() => handleSubmit(onSubmit)()}
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProjectSettingsDetail;

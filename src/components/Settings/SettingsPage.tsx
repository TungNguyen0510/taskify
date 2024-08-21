'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input, Textarea } from '@nextui-org/react';
import { useEffect } from 'react';
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

function SettingsPage({ params }: { params: { projectId: string } }) {
  const { currentProject, fetchCurrentProject, updateCurrentProject } =
    useProjectsStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchCurrentProject(params.projectId);
    };
    fetchData();
  }, [params.projectId]);

  const {
    handleSubmit,
    register,
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
      autoClose: 2000,
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
    <div>
      {currentProject && (
        <div className="w-[calc(100vw-18.875em)] min-w-[calc(100vw-18.875em)]">
          <div className="h-20 px-6">
            {currentProject?.name && (
              <div className="text-xl font-semibold">
                {currentProject?.name} Settings
              </div>
            )}
          </div>

          <div className="flex w-full items-center justify-center">
            <div className="flex w-[400px] flex-col justify-center gap-4">
              <div>
                <Input
                  isRequired
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

              <div className="flex w-full justify-end">
                <Button
                  color="primary"
                  isLoading={isSubmitting}
                  isDisabled={
                    currentProject.name === watch('projectName') &&
                    currentProject.key === watch('projectKey') &&
                    currentProject.description === watch('projectDes')
                  }
                  onPress={() => handleSubmit(onSubmit)()}
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;

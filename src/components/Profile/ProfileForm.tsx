/* eslint-disable react-hooks/exhaustive-deps */
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Input } from '@nextui-org/react';
import { useSession } from 'next-auth/react';
import React, { useEffect } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { useUsersStore } from '@/stores/users';

const schema = z.object({
  first_name: z
    .string()
    .min(1, { message: 'First name is required' })
    .max(30, { message: 'First name must be less than 30 characters' }),
  last_name: z
    .string()
    .min(1, { message: 'Last name is required' })
    .max(30, { message: 'Last name must be less than 30 characters' }),
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

type FormData = z.infer<typeof schema>;

function ProfileForm() {
  const session = useSession();
  const userId = session?.data?.user.id;

  const { currentUser, fetchCurrentUser, updateCurrentUser } = useUsersStore();

  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        const user = await fetchCurrentUser(userId);

        if (user) {
          setValue('first_name', user.first_name);
          setValue('last_name', user.last_name);
          setValue('email', user.email);
        }
      }
    };
    fetchData();
  }, [userId]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;

    if (userId) {
      await updateCurrentUser(userId, {
        first_name: data.first_name,
        last_name: data.last_name,
      });

      toast.success('Your profile updated successfully!', {
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
  };
  return (
    <div className="mx-auto mt-10 flex max-w-[450px] flex-col gap-4">
      <p className="text-xs text-zinc-700">
        Required fields are marked with an asterisk{' '}
        <span className="text-base text-danger">*</span>
      </p>

      <div className="flex w-full gap-2">
        <div className="w-1/2">
          <Controller
            name="first_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                type="text"
                labelPlacement="outside"
                variant="bordered"
                label="First name"
                placeholder="First name"
              />
            )}
          />
          {errors.first_name && (
            <p className="pl-2 text-xs text-danger">
              {errors.first_name.message}
            </p>
          )}
        </div>

        <div className="w-1/2">
          <Controller
            name="last_name"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                type="text"
                labelPlacement="outside"
                variant="bordered"
                label="Last name"
                placeholder="Last name"
              />
            )}
          />
          {errors.last_name && (
            <p className="pl-2 text-xs text-danger">
              {errors.last_name.message}
            </p>
          )}
        </div>
      </div>

      <div className="w-full">
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              isReadOnly
              type="email"
              labelPlacement="outside"
              variant="bordered"
              label="Email"
              placeholder="Email"
            />
          )}
        />
        {errors.email && (
          <p className="pl-2 text-xs text-danger">{errors.email.message}</p>
        )}
      </div>

      <div className="mt-4 flex w-full justify-end">
        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          isDisabled={
            currentUser?.first_name === watch('first_name') &&
            currentUser?.last_name === watch('last_name')
          }
          onPress={() => handleSubmit(onSubmit)()}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default ProfileForm;

/* eslint-disable react/no-unescaped-entities */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import Icon from '@/components/Icon';
import { resetPassword } from '@/libs/directus';

const schema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: 'New password is required' })
      .min(8, { message: 'New password must be at least 8 characters' }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Confirm new password is required' })
      .min(8, {
        message: 'Confirm new password must be at least 8 characters',
      }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function ResetPasswordForm() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;
    setIsSuccess(false);
    const res = await resetPassword({
      password: data.newPassword,
      token: token ?? '',
    });
    if (res?.status === 204) {
      setIsSuccess(true);
      toast.success('Reset password successfully!', {
        position: 'bottom-left',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }

    if (res?.status === 401) {
      setIsSuccess(false);
      toast.error('Invalid token! Please try again.', {
        position: 'bottom-left',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });
    }

    toast.error('Someting went wrong! Plese try again.', {
      position: 'bottom-left',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });

    setIsSuccess(false);
  };

  return (
    <Card className="w-full max-w-[450px] p-4">
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center gap-4 p-6">
          <div className="text-lg text-success-500 md:text-2xl">
            Reset password successfully!
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              color="primary"
              className="w-full"
              onPress={() => route.push('/login')}
            >
              Sign in
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-2">
          <h1 className="pb-4 text-2xl font-semibold">Reset Password</h1>

          <div className="w-full">
            <Input
              isRequired
              label="New password"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your password"
              {...register('newPassword')}
              type={isVisible ? 'text' : 'password'}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle password visibility"
                >
                  {isVisible ? (
                    <Icon name="eyeSlashFilled" />
                  ) : (
                    <Icon name="eyeFilled" />
                  )}
                </button>
              }
            />
            {errors.newPassword && (
              <p className="pl-2 text-xs text-danger">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <Input
              isRequired
              label="Confirm Password"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Confirm password"
              {...register('confirmNewPassword')}
              type={isVisible ? 'text' : 'password'}
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label="toggle confirm password visibility"
                >
                  {isVisible ? (
                    <Icon name="eyeSlashFilled" />
                  ) : (
                    <Icon name="eyeFilled" />
                  )}
                </button>
              }
            />
            {errors.confirmNewPassword && (
              <p className="pl-2 text-xs text-danger">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            color="primary"
            isLoading={isSubmitting}
            onPress={() => handleSubmit(handleFormSubmit)()}
            className="mt-8 w-full"
          >
            Reset
          </Button>
        </div>
      )}
    </Card>
  );
}

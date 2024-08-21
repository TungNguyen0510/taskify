/* eslint-disable react/no-unescaped-entities */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { requestResetPassword } from '@/libs/directus';

const schema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required' })
    .email({ message: 'Invalid email address' }),
});

type FormData = z.infer<typeof schema>;

export default function RequestResetPasswordForm() {
  const {
    handleSubmit,
    register,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;
    const response = await requestResetPassword({
      email: data.email,
    });

    if (response.status === 204) {
      toast.success(
        `If you have an account, we've sent you a secure link to reset your password`,
        {
          position: 'bottom-left',
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: 'colored',
        },
      );
    }
    if (response.status === 400) {
      toast.error('A user with this email already exists!', {
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
  };

  return (
    <Card className="w-full max-w-[450px] p-4">
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="pb-4 text-2xl font-semibold">Reset Password</h1>

        <div className="w-full">
          <Input
            isRequired
            type="email"
            labelPlacement="outside"
            variant="bordered"
            label="Email"
            placeholder="Enter your email"
            {...register('email')}
          />
          {errors.email && (
            <p className="pl-2 text-xs text-danger">{errors.email.message}</p>
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
        <p className="text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-sm text-blue-500 underline">
            Sign In
          </Link>
        </p>
      </div>
    </Card>
  );
}

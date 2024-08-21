/* eslint-disable react/no-unescaped-entities */
/* eslint-disable no-console */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import Icon from '@/components/Icon';
import { registerUser } from '@/libs/directus';

const schema = z
  .object({
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
    password: z
      .string()
      .min(1, { message: 'Password is required' })
      .min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Confirm password is required' })
      .min(8, { message: 'Confirm password must be at least 8 characters' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Password do not match',
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

function SignUpForm() {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [isSuccess, setIsSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;

    setIsSuccess(false);
    const response = await registerUser({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
    });

    if (response.status === 204) {
      setIsSuccess(true);
      reset();
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
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-success-500">Success!</h1>
          <p className="text-zinc-500">
            Please note that before you can sign in, you'll need to verify your
            email address by clicking on the verification link sent to you.
          </p>

          <Button
            color="primary"
            onPress={() => router.push('/login')}
            className="mt-8 w-full"
          >
            Sign In
          </Button>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center gap-2">
          <h1 className="pb-4 text-2xl font-semibold">Sign Up</h1>

          <div className="flex w-full gap-2">
            <div className="w-1/2">
              <Input
                isRequired
                type="text"
                labelPlacement="outside"
                variant="bordered"
                label="First name"
                placeholder="First name"
                {...register('first_name')}
              />
              {errors.first_name && (
                <p className="pl-2 text-xs text-danger">
                  {errors.first_name.message}
                </p>
              )}
            </div>

            <div className="w-1/2">
              <Input
                isRequired
                type="text"
                labelPlacement="outside"
                label="Last name"
                variant="bordered"
                placeholder="Last name"
                {...register('last_name')}
              />
              {errors.last_name && (
                <p className="pl-2 text-xs text-danger">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>

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

          <div className="w-full">
            <Input
              isRequired
              label="Password"
              variant="bordered"
              labelPlacement="outside"
              placeholder="Enter your password"
              {...register('password')}
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
            {errors.password && (
              <p className="pl-2 text-xs text-danger">
                {errors.password.message}
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
              {...register('confirmPassword')}
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
            {errors.confirmPassword && (
              <p className="pl-2 text-xs text-danger">
                {errors.confirmPassword.message}
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
            Register
          </Button>
          <p className="text-sm">
            Already have an account?{' '}
            <Link href="/login" className="text-sm text-blue-500 underline">
              Sign In
            </Link>
          </p>
        </div>
      )}
    </Card>
  );
}

export default SignUpForm;

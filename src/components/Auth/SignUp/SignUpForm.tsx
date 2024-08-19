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
  password: z
    .string()
    .min(1, { message: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' }),
});

type FormData = z.infer<typeof schema>;

function SignUpForm() {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

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
    },
  });

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;
    const response = await registerUser({
      first_name: data.first_name,
      last_name: data.last_name,
      email: data.email,
      password: data.password,
      role: process.env.NEXT_PUBLIC_ROLE_OWNER,
    });

    if (response.status === 200) {
      router.push('/login');
      router.refresh();

      toast.success('You have successfully created an account!', {
        position: 'bottom-left',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

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

    // Handle other status codes
    toast.error('An unexpected error occurred. Please try again.', {
      position: 'bottom-left',
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'colored',
    });
  };

  return (
    <Card className="w-full max-w-[450px] p-4">
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="pb-4 text-2xl font-semibold">Sign Up</h1>

        <div className="flex w-full gap-2">
          <div>
            <Input
              isRequired
              isClearable
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

          <div>
            <Input
              isRequired
              isClearable
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
            isClearable
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

        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          onPress={() => handleSubmit(handleFormSubmit)()}
          className="w-full"
        >
          Register
        </Button>
        <p className="text-sm">
          Already have an account?
          <Link href="/login" className="text-sm text-blue-500 underline">
            Login
          </Link>
        </p>
      </div>
    </Card>
  );
}

export default SignUpForm;

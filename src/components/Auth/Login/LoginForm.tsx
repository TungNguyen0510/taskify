/* eslint-disable react/no-unescaped-entities */

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, Input } from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import Icon from '@/components/Icon';

const schema = z.object({
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

export default function LoginForm() {
  const router = useRouter();

  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const [errMsg, setErrMsg] = useState('');

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    if (!isValid) return;
    const res = await signIn('credentials', {
      email: data.email,
      password: data.password,
      callbackUrl: `/login`,
      redirect: false,
    });

    if (res?.status === 401) {
      setErrMsg('Email address or password is invalid');
      toast.error('Email address or password is invalid', {
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

    if (res?.status === 200) {
      setErrMsg('');
      router.push(`/u/your-work`);
      router.refresh();

      toast.success('Login successful!', {
        position: 'bottom-left',
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'colored',
      });

      reset();
    }
  };

  return (
    <Card className="w-full max-w-[450px] p-4">
      <div className="flex w-full flex-col items-center gap-2">
        <h1 className="pb-4 text-2xl font-semibold">Login</h1>

        <div className="w-full">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                type="email"
                labelPlacement="outside"
                variant="bordered"
                label="Email"
                placeholder="Enter your email"
              />
            )}
          />
          {errors.email && (
            <p className="pl-2 text-xs text-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="w-full">
          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                isRequired
                label="Password"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Enter your password"
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
            )}
          />

          {errors.password && (
            <p className="pl-2 text-xs text-danger">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>{errMsg && <p className="text-base text-danger">{errMsg}</p>}</div>

        <div className="flex w-full justify-end">
          <Link
            href="/request-reset-password"
            className="text-sm text-blue-500 underline"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          color="primary"
          isLoading={isSubmitting}
          onPress={() => handleSubmit(handleFormSubmit)()}
          className="w-full"
        >
          Login
        </Button>
        <p className="text-sm">
          Don't have an account?{' '}
          <Link href="/sign-up" className="text-sm text-blue-500 underline">
            Sign up now
          </Link>
        </p>
      </div>
    </Card>
  );
}

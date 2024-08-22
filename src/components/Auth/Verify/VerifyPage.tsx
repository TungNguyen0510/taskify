/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { Button, Card, Spinner } from '@nextui-org/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AppConfig } from '@/utils/AppConfig';

type Status = {
  mess: string;
  type: string;
};

function VerifyPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const route = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<Status>();

  const getTextColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-success-500';
      case 'danger':
        return 'text-danger-500';
      default:
        return 'text-gray-500';
    }
  };

  useEffect(() => {
    const verifyEmail = async () => {
      setIsLoading(true);
      const res = await fetch(
        `${AppConfig.backendURL}/users/register/verify-email?token=${token}`,
        {
          method: 'GET',
        },
      );

      if (res.status === 200) {
        setIsLoading(false);
        setStatus({
          mess: 'Account has been verified! ️🎉️🎉️🎉',
          type: 'success',
        });
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
      } else if (res.status === 400) {
        setIsLoading(false);

        setStatus({
          mess: 'Invalid token! Please try again.',
          type: 'danger',
        });
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
      } else {
        setIsLoading(false);
        setStatus({
          mess: 'Something went wrong! Please try again.',
          type: 'danger',
        });
        toast.error('Something went wrong!', {
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

    verifyEmail();
  }, []);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-gradient-to-r from-cyan-200 to-indigo-600 p-4">
      <Button
        color="primary"
        variant="ghost"
        className="absolute left-6 top-6"
        onClick={() => route.back()}
      >
        Back
      </Button>

      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <Card>
          <div className="flex flex-col items-center justify-center gap-4 p-6">
            {status && (
              <div
                className={`${getTextColor(status.type)} text-xl md:text-3xl`}
              >
                {status.mess}
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              <Button
                color="default"
                className="w-full"
                onPress={() => route.push('/')}
              >
                Go to home
              </Button>
              <Button
                color="primary"
                className="w-full"
                onPress={() => route.push('/login')}
              >
                Sign in
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

export default VerifyPage;

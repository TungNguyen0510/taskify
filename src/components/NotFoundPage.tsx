'use client';

import { Button } from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import React from 'react';

function NotFoundPage() {
  const route = useRouter();
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-2 p-6">
        <h1 className="bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text text-9xl font-bold text-transparent hover:from-cyan-200 hover:to-fuchsia-500">
          404
        </h1>
        <p className="text-3xl font-semibold uppercase text-blue-500">
          Page not found
        </p>
        <p className="text-lg text-zinc-500">
          Sorry, the page you are looking for could not be found.
        </p>

        <div className="mt-6 flex gap-4">
          <Button
            className="font-semibold"
            variant="ghost"
            color="primary"
            onClick={() => route.back()}
          >
            Back
          </Button>
          <Button
            className="font-semibold"
            variant="solid"
            color="primary"
            onClick={() => route.push('/')}
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;

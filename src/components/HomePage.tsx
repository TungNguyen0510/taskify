'use client';

import { Button } from '@nextui-org/react';
import Link from 'next/link';

import { AppConfig } from '@/utils/AppConfig';

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center">
      <div className="mx-auto flex size-full min-h-[calc(100vh-56px)] flex-col items-center gap-4 bg-gray-100 p-6 text-center">
        <div className="mt-8 text-wrap text-[66px] leading-[73px]">
          <span className="font-bold">Great outcomes</span> start with
          <span className="bg-gradient-to-r from-cyan-200 to-indigo-600 bg-clip-text font-semibold text-transparent hover:from-cyan-200 hover:to-fuchsia-500">
            {AppConfig.name}
          </span>
        </div>
        <div className="text-base">
          The only project management tool you need to plan and track work
          across every team.
        </div>
        <Link href="/sign-up">
          <Button color="primary" className="h-14 text-xl font-semibold">
            Get Taskify free
          </Button>
        </Link>
      </div>
    </div>
  );
}

/* eslint-disable consistent-return */
/* eslint-disable react-hooks/exhaustive-deps */

'use client';

import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { useUsersStore } from '@/stores/users';

import ProfileForm from './ProfileForm';

function ProfilePage() {
  const { fetchCurrentUser } = useUsersStore();

  const session = useSession();
  const userId = session?.data?.user.id;

  useEffect(() => {
    const fetchData = async () => {
      if (userId) {
        await fetchCurrentUser(userId);
      }
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      return notFound();
    }
  }, [userId]);

  return (
    <div className="p-4">
      <div className="px-4 text-xl font-semibold">Your Profile</div>

      <ProfileForm />
    </div>
  );
}

export default ProfilePage;

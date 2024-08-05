import { UserProfile } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import { getTranslations } from 'next-intl/server';

import { getI18nPath } from '@/utils/Helpers';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'UserProfile',
  });

  return {
    title: t('meta_title'),
  };
}

const UserProfilePage = (props: { params: { locale: string } }) => {
  const { userId } = auth();
  return (
    <div className="mx-auto my-6 flex w-full items-center justify-center">
      <UserProfile
        path={getI18nPath(`/u/${userId}/user-profile`, props.params.locale)}
      />
    </div>
  );
};

export default UserProfilePage;

import { getTranslations } from 'next-intl/server';

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
  return (
    <div className="mx-auto my-6 flex w-full items-center justify-center">
      User profile {props.params.locale}
    </div>
  );
};

export default UserProfilePage;

import { enUS, viVN } from '@clerk/localizations';
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { userId } = auth();

  let clerkLocale = viVN;
  let signInUrl = '/sign-in';
  let signUpUrl = '/sign-up';
  let appUrl = `/u/${userId}/your-work`;

  if (props.params.locale === 'en') {
    clerkLocale = enUS;
  }

  if (props.params.locale !== 'vi') {
    signInUrl = `/${props.params.locale}${signInUrl}`;
    signUpUrl = `/${props.params.locale}${signUpUrl}`;
    appUrl = `/${props.params.locale}${appUrl}`;
  }

  return (
    <ClerkProvider
      localization={clerkLocale}
      signInUrl={signInUrl}
      signUpUrl={signUpUrl}
      signInFallbackRedirectUrl={appUrl}
      signUpFallbackRedirectUrl={appUrl}
    >
      {props.children}
    </ClerkProvider>
  );
}

/* eslint-disable no-console */
/* eslint-disable consistent-return */
import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from '@directus/sdk';

export const directus = (token: string = '') => {
  if (token) {
    return createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_API ?? '')
      .with(staticToken(token))
      .with(rest());
  }
  return createDirectus(process.env.NEXT_PUBLIC_DIRECTUS_API ?? '')
    .with(
      authentication('cookie', { credentials: 'include', autoRefresh: true }),
    )
    .with(rest());
};

export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_DIRECTUS_API}/auth/login`,
    {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' },
    },
  );
  const user = await res.json();
  if (!res.ok && user) {
    throw new Error('Email address or password is invalid');
  }
  if (res.ok && user) {
    return user?.data;
  }
};

export const registerUser = async ({
  first_name,
  last_name,
  email,
  password,
  role,
}: {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
  role?: string;
}) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_DIRECTUS_API}/users`, {
    method: 'POST',
    body: JSON.stringify({ first_name, last_name, email, password, role }),
    headers: { 'Content-Type': 'application/json' },
  });

  return res;
};

/* eslint-disable no-console */
/* eslint-disable consistent-return */
import {
  authentication,
  createDirectus,
  rest,
  staticToken,
} from '@directus/sdk';

import { AppConfig } from '../utils/AppConfig';

export const directus = (token: string = '') => {
  if (token) {
    return createDirectus(AppConfig.backendURL ?? '')
      .with(staticToken(token))
      .with(rest());
  }
  return createDirectus(AppConfig.backendURL ?? '')
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
  const res = await fetch(`${AppConfig.backendURL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
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
}: {
  first_name?: string;
  last_name?: string;
  email: string;
  password: string;
}) => {
  const res = await fetch(`${AppConfig.backendURL}/users/register`, {
    method: 'POST',
    body: JSON.stringify({
      first_name,
      last_name,
      email,
      password,
      verification_url: `${AppConfig.appURL}/verify`,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return res;
};

export const requestResetPassword = async ({ email }: { email: string }) => {
  const res = await fetch(`${AppConfig.backendURL}/auth/password/request`, {
    method: 'POST',
    body: JSON.stringify({
      email,
      reset_url: `${AppConfig.appURL}/reset-password`,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return res;
};

export const resetPassword = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  const res = await fetch(`${AppConfig.backendURL}/auth/password/reset`, {
    method: 'POST',
    body: JSON.stringify({
      password,
      token,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return res;
};

export const acceptInvite = async ({
  password,
  token,
}: {
  password: string;
  token: string;
}) => {
  const res = await fetch(`${AppConfig.backendURL}/users/invite/accept`, {
    method: 'POST',
    body: JSON.stringify({
      password,
      token,
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  return res;
};

import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';

const publicPages = [
  '/',
  '/login',
  '/sign-up',
  '/verify',
  '/request-reset-password',
  '/reset-password',
  '/accept-invite',
];

export default withAuth(
  async function middleware(req) {
    const token = await getToken({ req });
    const isAuth = !!token;
    const currentPath = req.nextUrl.pathname;

    const isPublicPage = publicPages.includes(currentPath);

    if (isPublicPage) {
      if (isAuth && currentPath === '/login') {
        return NextResponse.redirect(new URL('/u/your-work', req.url));
      }
      return NextResponse.next();
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  },
);

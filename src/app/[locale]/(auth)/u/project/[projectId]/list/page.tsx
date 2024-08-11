import { auth } from '@clerk/nextjs/server';

export default function ListPage() {
  const { userId } = auth();
  return <div>{userId}</div>;
}

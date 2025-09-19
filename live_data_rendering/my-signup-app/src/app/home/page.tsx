'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold">Welcome, {session?.user?.name}!</h1>
      <p className="mt-4">You are now logged in.</p>
    </div>
  );
}
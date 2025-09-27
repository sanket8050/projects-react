// import Image from "next/image";

// export default function Home() {
//   return (
//     <main>
//       sanke
//     </main>
//   );
// }
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';

type UserWithRole = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
};

type SessionWithRole = {
  user?: UserWithRole;
};

export default async function HomePage() {
  const session = (await getServerSession(authOptions as any)) as SessionWithRole | null;

  if (!session) {
    redirect('/signin');
  }

  if (session.user && session.user.role === 'ADMIN') {
    redirect('/admin');
  } else if (session.user && session.user.role) {
    redirect('/user');
  } else {
    redirect('/signin');
  }

  return null; // Never reached due to redirects
}
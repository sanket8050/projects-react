    'use client';

    import Link from 'next/link';
    import { useSession, signOut } from 'next-auth/react';

    export default function Navbar() {
      const { data: session } = useSession();

      return (
        <nav className="bg-blue-600 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">My App</h1>
            <div className="space-x-4">
              {!session ? (
                <>
                  <Link href="/signup" className="hover:underline">
                    Signup
                  </Link>
                  <Link href="/login" className="hover:underline">
                    Login
                  </Link>
                </>
              ) : (
                <>
                  <span className="flex items-center space-x-2">
                    <span>👤</span>
                    <span>{session.user?.name}</span>
                  </span>
                  <Link href="/home" className="hover:underline">
                    Home
                  </Link>
                  <button onClick={() => signOut()} className="hover:underline">
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </nav>
      );
    }
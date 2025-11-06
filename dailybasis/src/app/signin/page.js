'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';


export default function SignInPage() {
  const [error, setError] = useState('');
  const router = useRouter();
  // const prisma = new PrismaClient();
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await signIn('credentials', {
      redirect: false,
      email: formData.get('email'),
      password: formData.get('password'),
    });

    // Debugging: log the full response from next-auth so we can inspect
    // status, ok, error, and any returned url in the browser console.
    // This helps diagnose why the client thinks sign-in succeeded but the
    // server-side session may not be established.
    // (Remove or reduce logging in production.)
    // eslint-disable-next-line no-console
    console.log('next-auth signIn result:', res);

    // Prefer checking `res.ok` which is explicitly set on success.
    if (!res?.ok) {
      setError(res?.error || 'Invalid email or password');
    } else {
      router.push('/'); // Redirect to home, which handles role-based redirect
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      {/* <h1 className="text-2xl mb-4">{meal}</h1> */}
      <h1 className="text-2xl mb-4">Sign In</h1>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Sign In
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
      <p>
        No account?{' '}
        <a href="/signup" className="text-blue-500">
          Sign Up
        </a>
      </p>
    </div>
  );
}
import { redirect } from 'next/navigation';
import { signup } from './actions';

export default function SignupPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form action={signup} className="flex flex-col gap-4">
        <input
          name="name"
          type="text"
          placeholder="Name"
          required
          className="border p-2"
        />
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
          Sign Up
        </button>
      </form>
      <p>
        Already have an account?{' '}
        <a href="/signin" className="text-blue-500">
          Sign In
        </a>
      </p>
    </div>
  );
}
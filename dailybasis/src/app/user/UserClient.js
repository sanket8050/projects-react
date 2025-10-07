"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation';
import LogoutButton from '@/components/LogoutButton';

export default function UserClient({ user, attending, meal }) {
  const [choice, setChoice] = useState(attending);
  const router = useRouter();

  const handleAttendance = async (attendingValue) => {
    try {
      const formData = new FormData();
      formData.append('userId', String(user.id));
      formData.append('attending', attendingValue ? 'true' : 'false');

      const res = await fetch('/api/attendance', { method: 'POST', body: formData });
      const body = await res.json().catch(() => null);
      // eslint-disable-next-line no-console
      console.log('attendance response', res.status, body);
      if (!res.ok) {
        const msg = body?.error || 'Failed to update attendance';
        throw new Error(msg);
      }
      // update local state so UI reflects new choice immediately
      setChoice(attendingValue);
      // refresh current page to reflect server-side data
      router.replace('/user');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Could not update attendance');
    }
  };

  const handleRegular = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/regular', { method: 'POST', body: formData });
      if (!res.ok) throw new Error('Failed to update regular');
      router.replace('/user');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      alert('Could not update regular status');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center w-full max-w-md mb-6">
        <h1 className="text-3xl font-bold text-cyan-900">Welcome, {user.name}</h1>
        <LogoutButton />
      </div>

      {/* Attendance buttons: use explicit onClick to send the value reliably */}
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => handleAttendance(true)}
          className={`px-6 py-3 text-lg font-bold rounded-lg shadow 
            ${choice ? "bg-green-600 text-black" : "bg-green-300 text-black"}`}
        >
          ✅ Present
        </button>
        <button
          type="button"
          onClick={() => handleAttendance(false)}
          className={`px-6 py-3 text-lg font-bold rounded-lg shadow 
            ${!choice ? "bg-red-600 text-black" : "bg-red-300 text-black"}`}
        >
          ❌ Absent
        </button>
      </div>

      {/* Regular option */}
      <form onSubmit={handleRegular} className="mb-6">
        <input type="hidden" name="userId" value={user.id} />
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isRegular"
            defaultChecked={user.isRegular}
          />
          <span className="text-lg text-amber-900">Regular Attendee</span>
        </label>
        <button
          type="submit"
          className="ml-4 px-4 py-2 bg-blue-500 text-black rounded"
        >
          Save
        </button>
      </form>

      {/* Meal info */}
      {meal?.description && (
        <div className="bg-white shadow p-4 rounded w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2 text-amber-900">🍴 Today’s Meal</h2>
          <p className="text-zinc-900 ">{meal.description}</p>
        </div>
      )}
    </div>
  );
}

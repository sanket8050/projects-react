import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';
import { setMealDescription } from './actions';
import { authOptions } from '../api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'ADMIN') {
    redirect('/signin');
  }

  // Get attending users
  const attendingUsers = await prisma.user.findMany({
    where: { attending: true },
    select: { id: true, name: true },
  });
  const count = attendingUsers.length;

  // Get today's meal
  const today = startOfDay(new Date());
  const meal = await prisma.meal.findFirst({
    where: { date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>
      <p>Attending Today: {count}</p>
      <h2 className="text-xl mt-4">Attendees</h2>
      <ul className="mb-4">
        {attendingUsers.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
      <form action={setMealDescription} className="flex flex-col gap-4">
        <input
          type="text"
          name="description"
          placeholder="Today's Meal Description"
          defaultValue={meal?.description || ''}
          className="border p-2"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">
          Set Meal Description
        </button>
      </form>
    </div>
  );
}
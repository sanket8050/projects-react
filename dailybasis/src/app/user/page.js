import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { PrismaClient } from '@prisma/client';
import { isToday, startOfDay } from 'date-fns';
import UserClient from './UserClient';
import { authOptions } from '../api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export default async function UserPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'USER') {
    redirect('/signin');
  }

  // Get user and check daily reset
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  const today = startOfDay(new Date());

  // Dev logs: show fetched user and whether a reset will run
  // eslint-disable-next-line no-console
  console.log('[user page] fetched user=', user, 'today=', today, 'isToday(lastUpdate)=', isToday(user.lastUpdate));

  let attending = user.attending;
  if (!isToday(user.lastUpdate)) {
    // Reset for new day
    attending = user.isRegular; // Default to regular status
    // eslint-disable-next-line no-console
    console.log('[user page] daily reset: setting attending=', attending, 'for', user.email);
    await prisma.user.update({ where: { email: session.user.email }, data: { attending, lastUpdate: today } });
    // refetch so the client receives the actual DB state after reset
    // eslint-disable-next-line no-console
    console.log('[user page] refetching user after reset');
    const refetched = await prisma.user.findUnique({ where: { email: session.user.email } });
    // eslint-disable-next-line no-console
    console.log('[user page] refetched user=', refetched);
  }

  // Get today's meal description
  const meal = await prisma.meal.findFirst({ where: { date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } } });

  return <UserClient user={user} attending={attending} meal={meal} />;
}

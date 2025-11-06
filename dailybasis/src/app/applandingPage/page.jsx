import { PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function AppLandingPage() {
  const today = startOfDay(new Date());
  const meal = await prisma.meal.findFirst({ where: { date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) } } });

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-sky-50 to-white">
      <nav className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sky-600 flex items-center justify-center text-white font-bold">DB</div>
          <div className="text-xl font-bold text-sky-900">DailyBasis</div>
        </div>
        <div className="flex gap-3">
          <Link href="/signin" className="px-4 py-2 bg-sky-600 text-white rounded">Sign In</Link>
          <Link href="/signup" className="px-4 py-2 border border-sky-600 text-sky-600 rounded">Sign Up</Link>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-12">
        <div className="space-y-6">
          <h1 className="text-4xl font-extrabold text-slate-900">Meals made simple. RSVP in one tap.</h1>
          <p className="text-lg text-slate-600">View today's menu, mark your attendance, and manage meals — all in one place. Join your workspace and stay up to date.</p>
          <div className="flex gap-4">
            <Link href="/signup" className="px-6 py-3 bg-sky-600 text-white rounded-lg">Create account</Link>
            <Link href="/signin" className="px-6 py-3 border rounded-lg">Sign in</Link>
          </div>
        </div>

        <aside className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-lg font-semibold">Today's Meal</h3>
          {meal ? (
            <div className="mt-4">
              <p className="text-slate-800 font-medium">{meal.description}</p>
              <p className="text-sm text-slate-500 mt-2">{new Date(meal.date).toLocaleDateString()}</p>
              <div className="mt-4 flex gap-3">
                <Link href="/signin" className="px-4 py-2 bg-sky-600 text-white rounded">Login to RSVP</Link>
                <Link href="/signup" className="px-4 py-2 border rounded">Sign Up</Link>
              </div>
            </div>
          ) : (
            <div className="mt-4 text-slate-600">No offer set for today. Sign in to add the menu.</div>
          )}
        </aside>
      </section>

      <footer className="border-t py-6">
        <div className="max-w-6xl mx-auto px-6 text-sm text-slate-500">© {new Date().getFullYear()} DailyBasis</div>
      </footer>
    </main>
  );
}

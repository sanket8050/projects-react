import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { startOfDay } from "date-fns";
import { authOptions } from "../api/auth/[...nextauth]/route";
import AdminClient from "./client";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/signin");
  }

  const attendingUsers = await prisma.user.findMany({
    where: { attending: true },
    select: { id: true, name: true, isRegular: true },
  });

  const today = startOfDay(new Date());
  const meal = await prisma.meal.findFirst({
    where: {
      date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    },
  });

  return (
    <AdminClient
      users={attendingUsers}
      meal={meal}
      adminName={session.user.name}
    />
  );
}

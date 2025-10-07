import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import { startOfDay } from "date-fns";
import { setMealDescription } from "./actions";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LogoutButton from "@/components/LogoutButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const prisma = new PrismaClient();

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/signin");
  }

  // Fetch attending users
  const attendingUsers = await prisma.user.findMany({
    where: { attending: true },
    select: { id: true, name: true },
  });
  const count = attendingUsers.length;

  // Fetch today’s meal
  const today = startOfDay(new Date());
  const meal = await prisma.meal.findFirst({
    where: {
      date: { gte: today, lt: new Date(today.getTime() + 24 * 60 * 60 * 1000) },
    },
  });

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">
              Admin Dashboard
            </CardTitle>
            <LogoutButton />
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Attendance Summary */}
          <div className="text-center">
            <p className="text-lg font-medium">Attending Today</p>
            <p className="text-3xl font-bold text-green-600">{count}</p>
          </div>

          {/* Attendees Table */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Attendees</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendingUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Meal Form */}
          <form action={setMealDescription} className="flex gap-2">
            <Input
              type="text"
              name="description"
              placeholder="Today's Meal Description"
              defaultValue={meal?.description || ""}
            />
            <Button type="submit">Set Meal</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

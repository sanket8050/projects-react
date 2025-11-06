"use client";

import { format } from "date-fns";
import { setMealDescription } from "./actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RefreshCw } from "lucide-react";
import LogoutButton from "@/components/LogoutButton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdminClient({ users, meal, adminName }) {
  const count = users.length;
  const regularCount = users.filter((u) => u.isRegular).length;

  return (
    <div className="flex flex-col items-center min-h-screen p-8 bg-gray-50">
      <Card className="w-full max-w-3xl shadow-md border border-gray-200">
        <CardHeader className="flex justify-between items-center bg-white rounded-t-xl border-b">
          <CardTitle className="text-2xl font-bold">
            Welcome, {adminName} 👋
          </CardTitle>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => location.reload()}>
              <RefreshCw className="w-4 h-4 mr-1" /> Refresh
            </Button>
            <LogoutButton />
          </div>
        </CardHeader>

        <CardContent className="space-y-8 mt-4">
          {/* Attendance Summary */}
          <div className="flex justify-around text-center">
            <div>
              <p className="text-gray-600">Attending Today</p>
              <p className="text-4xl font-bold text-green-600">{count}</p>
            </div>
            <div>
              <p className="text-gray-600">Regular Users</p>
              <p className="text-4xl font-bold text-blue-600">{regularCount}</p>
            </div>
          </div>

          {/* Meal Form */}
          <div className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold mb-2">Today’s Meal</h2>
            <form action={setMealDescription} className="flex gap-2">
              <Input
                type="text"
                name="description"
                placeholder="Enter today's meal..."
                defaultValue={meal?.description || ""}
              />
              <Button type="submit">Save</Button>
            </form>
            <p className="text-sm text-gray-500 mt-2">
              Last updated: {meal ? format(meal.date, "PPPp") : "Not set"}
            </p>
          </div>

          {/* Attendees Table */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
            <h2 className="text-lg font-semibold p-3 border-b bg-gray-50">
              Attendees List
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Regular</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>
                      {user.isRegular ? (
                        <Badge variant="outline" className="bg-green-100 text-green-700">
                          ✅ Regular
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-100 text-red-700">
                          ❌ Not Regular
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

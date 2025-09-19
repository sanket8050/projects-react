import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const runtime = 'nodejs';

const prisma = new PrismaClient();

// GET all users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {

        id: true,
        name:true,
        email: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Error fetching users" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

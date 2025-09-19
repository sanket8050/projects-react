// import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';
// import bcrypt from 'bcrypt';

// export const runtime = 'nodejs';

// const prisma = new PrismaClient();

// export async function POST(request: Request) {
//   try {
//     const { email, password } = await request.json();

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { message: 'Email and password are required' },
//         { status: 400 }
//       );
//     }

//     // Find user
//     const user = await prisma.user.findUnique({
//       where: { email },
//     });
//     if (!user) {
//       return NextResponse.json(
//         { message: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     // Verify password
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { message: 'Invalid email or password' },
//         { status: 401 }
//       );
//     }

//     return NextResponse.json(
//       { message: 'Login successful' },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error('Login error:', error);
//     return NextResponse.json(
//       { message: 'Error logging in' },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }
// }


import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET || "supersecret"; // put real secret in .env

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Compare password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Sign JWT with user data
    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      SECRET,
      { expiresIn: "1h" }
    );

    // Send JWT as cookie
    const res = NextResponse.json({ message: "Login successful" });
    res.cookies.set("token", token, { httpOnly: true, secure: true, path: "/" });

    return res;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Error logging in" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

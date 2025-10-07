'use server';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { redirect } from 'next/navigation';

export async function signup(formData) {
  try {
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    // Basic validation to catch missing fields early and provide helpful errors
    if (!name || !String(name).trim()) {
      throw new Error('Name is required');
    }
    if (!email || !String(email).trim()) {
      throw new Error('Email is required');
    }
    if (!password || !String(password).trim()) {
      throw new Error('Password is required');
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('Email already exists');
    }

    // Hash password and create user
    const hashedPassword = bcrypt.hashSync(String(password), 10);

    // Log sanitized inputs for debugging (do not log passwords)
    // eslint-disable-next-line no-console
    console.log('[signup] creating user', { name: String(name), email: String(email) });

    await prisma.user.create({
      data: {
        name: String(name),
        email: String(email),
        password: hashedPassword,
        role: 'USER', // Default to USER; set ADMIN manually in DB for learning
      },
    });

    // Successful signup -- continue to redirect after the try/catch so the
    // Next.js internal redirect exception (NEXT_REDIRECT) isn't accidentally
    // caught by the catch block below.
  } catch (error) {
    // For debugging: log the original error and include its message to help
    // identify the root cause while keeping the thrown message concise.
    // eslint-disable-next-line no-console
    console.error('Signup error:', error);
    // If this is a Prisma error, log code and meta for more context
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires,global-require
      const { Prisma } = require('@prisma/client');
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // eslint-disable-next-line no-console
        console.error('Prisma error code:', error.code, 'meta:', error.meta);
      }
    } catch (e) {
      // ignore require errors in environments without prisma at runtime
    }

    const message = error && error.message ? error.message : String(error);
    throw new Error('Signup failed: ' + message);
  }

  // Perform the redirect on success. Placing this outside the try/catch
  // ensures Next.js can handle its special redirect control flow.
  redirect('/signin');
}
'use server';
import { PrismaClient } from '@prisma/client';
import { startOfDay } from 'date-fns';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function setMealDescription(formData) {
  const description = formData.get('description');
  const today = startOfDay(new Date());

  await prisma.meal.upsert({
    where: { date: today },
    update: { description },
    create: { date: today, description },
  });

  redirect('/admin');
}
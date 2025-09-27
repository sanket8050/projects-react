'use server';
import { PrismaClient } from '@prisma/client';
import { redirect } from 'next/navigation';

const prisma = new PrismaClient();

export async function updateAttendance(formData) {
  const userId = parseInt(formData.get('userId'));
  const attending = formData.get('attending') === 'true';
  await prisma.user.update({
    where: { id: userId },
    data: { attending, lastUpdate: new Date() },
  });
  redirect('/user'); // Refresh page
}

export async function updateRegular(formData) {
  const userId = parseInt(formData.get('userId'));
  const isRegular = formData.get('isRegular') === 'on';
  await prisma.user.update({
    where: { id: userId },
    data: { isRegular },
  });
  redirect('/user');
}
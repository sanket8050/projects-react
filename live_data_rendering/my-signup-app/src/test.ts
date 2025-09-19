import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to NeonDB!');
  } catch (error) {
    console.error('Failed to connect to NeonDB:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
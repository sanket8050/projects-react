const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');
  
  // Create a sample admin user (you can change this)
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: '$2a$10$rQZ8K5QjKQjKQjKQjKQjK.QjKQjKQjKQjKQjKQjKQjKQjKQjKQjK', // password: admin123
      role: 'ADMIN',
      attending: false,
      isRegular: false,
    },
  });

  console.log('Admin user created:', adminUser);

  // Create a sample regular user
  const regularUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Regular User',
      email: 'user@example.com',
      password: '$2a$10$rQZ8K5QjKQjKQjKQjKQjK.QjKQjKQjKQjKQjKQjKQjKQjKQjKQjK', // password: user123
      role: 'USER',
      attending: false,
      isRegular: true,
    },
  });

  console.log('Regular user created:', regularUser);

  console.log('Database setup completed!');
  console.log('Admin credentials: admin@example.com / admin123');
  console.log('User credentials: user@example.com / user123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


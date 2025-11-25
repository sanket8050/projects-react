require('dotenv').config();
const { execSync } = require('child_process');

console.log('Running prisma generate with DATABASE_URL...');
try {
    execSync('npx prisma generate', { stdio: 'inherit', env: process.env });
    console.log('Prisma generate completed successfully.');
} catch (error) {
    console.error('Prisma generate failed:', error.message);
    process.exit(1);
}

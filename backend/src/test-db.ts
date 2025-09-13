import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Test connection
    const users = await prisma.user.findMany();
    console.log('Database connection successful!');
    console.log(`Found ${users.length} users in the database.`);
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();

import prisma from '../db/prisma';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// No need to create a new PrismaClient here!

beforeAll(async () => {
  // Clean up database before all tests
  await prisma.user.deleteMany();
  await prisma.threat.deleteMany();
});

afterAll(async () => {
  // Clean up after all tests
  await prisma.user.deleteMany();
  await prisma.threat.deleteMany();
  await prisma.$disconnect();
});

export { prisma }; 
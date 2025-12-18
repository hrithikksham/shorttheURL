// src/config/database.ts
import { PrismaClient } from '@prisma/client';

// Singleton pattern for DB connection
const prisma = new PrismaClient();

export default prisma;
// src/models/url.model.ts
import { Url as PrismaUrl } from '@prisma/client';

// Re-exporting makes our service layer independent of Prisma
export type Url = PrismaUrl;

export interface CreateUrlDTO {
  originalUrl: string;
  customAlias?: string;
}
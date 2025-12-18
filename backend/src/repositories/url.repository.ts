// src/repositories/url.repository.ts
import prisma from '../../config/database';
import { Url } from '../models/url.model';

export class UrlRepository {
  // 1. Create empty record to get an ID (for Base62)
  static async createEmpty(): Promise<Url> {
    return prisma.url.create({
      data: { original: "", shortCode: "" } // Temp placeholder
    });
  }

  // 2. Update record with actual data
  static async update(id: number, original: string, shortCode: string): Promise<Url> {
    return prisma.url.update({
      where: { id },
      data: { original, shortCode }
    });
  }

  static async findByCode(shortCode: string): Promise<Url | null> {
    return prisma.url.findUnique({
      where: { shortCode }
    });
  }
}
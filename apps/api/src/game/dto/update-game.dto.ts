import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const updateGameSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  attributes: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['TEXT', 'NUMBER', 'SELECT']),
    options: z.array(z.string()).optional(),
  })).optional(),
});

export class UpdateGameDto extends createZodDto(updateGameSchema) {}

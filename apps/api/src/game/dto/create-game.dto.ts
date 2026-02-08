import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const createGameSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  attributes: z.array(z.object({
    name: z.string().min(1),
    type: z.enum(['TEXT', 'NUMBER', 'SELECT']),
    options: z.array(z.string()).optional(),
  })).optional(),
});

export class CreateGameDto extends createZodDto(createGameSchema) {}

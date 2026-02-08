import { z } from 'zod';

const attributeTypeEnum = z.enum(['TEXT', 'NUMBER', 'SELECT']);

const gameAttributeSchema = z.object({
  name: z.string().min(1, 'Tên thuộc tính là bắt buộc'),
  type: attributeTypeEnum,
  options: z.array(z.string()).optional(),
});

export const createGameSchema = z.object({
  name: z.string().min(1, 'Tên game là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  attributes: z.array(gameAttributeSchema).optional(),
});

export const updateGameSchema = z.object({
  name: z.string().min(1, 'Tên game là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  thumbnail: z.string().optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  attributes: z.array(gameAttributeSchema).optional(),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
export type UpdateGameInput = z.infer<typeof updateGameSchema>;
export type GameAttributeInput = z.infer<typeof gameAttributeSchema>;

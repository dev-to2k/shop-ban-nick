import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().min(1).email(),
  phone: z.string().optional(),
  password: z.string().min(6),
});

export class RegisterDto extends createZodDto(registerSchema) {}

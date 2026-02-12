import type { z } from 'zod';
import { loginSchema } from '../schemas';
import { registerSchema } from '../schemas';

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

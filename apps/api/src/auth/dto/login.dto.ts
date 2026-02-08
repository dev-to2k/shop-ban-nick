import { createZodDto } from 'nestjs-zod';
import { loginSchema } from '@shop-ban-nick/shared-schemas';

export class LoginDto extends createZodDto(loginSchema) {}

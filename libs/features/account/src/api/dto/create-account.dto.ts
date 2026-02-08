import { createZodDto } from 'nestjs-zod';
import { createAccountSchema } from '@shop-ban-nick/shared-schemas';

export class CreateAccountDto extends createZodDto(createAccountSchema) {}

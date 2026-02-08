import { createZodDto } from 'nestjs-zod';
import { createOrderSchema } from '@shop-ban-nick/shared-schemas';

export class CreateOrderDto extends createZodDto(createOrderSchema) {}

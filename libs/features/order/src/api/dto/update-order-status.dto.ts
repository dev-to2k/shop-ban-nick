import { createZodDto } from 'nestjs-zod';
import { updateOrderStatusSchema } from '@shop-ban-nick/shared-schemas';

export class UpdateOrderStatusDto extends createZodDto(updateOrderStatusSchema) {}

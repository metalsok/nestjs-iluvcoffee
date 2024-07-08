import { PartialType } from '@nestjs/swagger';
import { CreateMongoCoffeeDto } from './create-mongo-coffee.dto';

export class UpdateMongoCoffeeDto extends PartialType(CreateMongoCoffeeDto) {}

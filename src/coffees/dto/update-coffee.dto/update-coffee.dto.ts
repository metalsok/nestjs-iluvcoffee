import { PartialType } from '@nestjs/mapped-types';
import { CreateCoffeeDto } from '../create-cofee.dto/create-coffee.dto';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}

import { CreateCoffeeDto } from '../create-cofee.dto/create-coffee.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateCoffeeDto extends PartialType(CreateCoffeeDto) {}

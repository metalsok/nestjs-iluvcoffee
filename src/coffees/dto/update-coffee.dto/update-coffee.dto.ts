import { PartialType } from '@nestjs/mapped-types';
import { Coffee } from '../../entities/coffee.entity';

export class UpdateCoffeeDto extends PartialType(Coffee) {}

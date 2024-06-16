import { IsArray, IsOptional, IsString } from 'class-validator';
import { Flavor } from '../../entities/flavor.entity';

export class CreateCoffeeDto {
  @IsString()
  name: string;
  @IsString()
  brand: string;

  @IsArray()
  @IsOptional()
  flavors: Flavor[];
}

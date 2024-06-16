import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateCoffeeDto {
  @IsString()
  name: string;
  @IsString()
  brand: string;

  @IsArray()
  @IsOptional()
  flavors: string[];
}

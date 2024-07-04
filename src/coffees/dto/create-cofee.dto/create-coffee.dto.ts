import { IsArray, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCoffeeDto {
  @ApiProperty({ description: 'The name of the coffee' })
  @IsString()
  name: string;

  @IsString()
  brand: string;

  @IsArray()
  @IsOptional()
  flavors: string[];
}

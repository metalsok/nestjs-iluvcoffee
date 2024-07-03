import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CoffeesService } from './coffees.service';
import { CreateCoffeeDto } from './dto/create-cofee.dto/create-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Public } from '../common/decorators/public.decorator';

@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Public()
  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.coffeesService.findAll(paginationQuery);
  }

  @Public()
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne(id);
  }

  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id/recommend')
  update(@Param('id') id: number) {
    return this.coffeesService.recommendCoffee(id);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}

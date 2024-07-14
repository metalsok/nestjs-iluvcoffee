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
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { ApiTags } from '@nestjs/swagger';
import { Protocol } from '../common/decorators/protocol.decorator';

@ApiTags('coffees')
@Controller('coffees')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Public()
  @Get()
  async findAll(
    @Protocol() protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(protocol);
    //    await new Promise((resolve) => setTimeout(resolve, 5000));
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
  recommend(@Param('id') id: number) {
    return this.coffeesService.recommendCoffee(id);
  }

  @Patch(':id/')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}

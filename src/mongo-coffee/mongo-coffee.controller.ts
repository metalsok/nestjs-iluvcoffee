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
import { MongoCoffeeService } from './mongo-coffee.service';
import { CreateMongoCoffeeDto } from './dto/create-mongo-coffee.dto';
import { UpdateMongoCoffeeDto } from './dto/update-mongo-coffee.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';

@Controller('mongo-coffee')
export class MongoCoffeeController {
  constructor(private readonly mongoCoffeeService: MongoCoffeeService) {}

  @Post()
  create(@Body() createMongoCoffeeDto: CreateMongoCoffeeDto) {
    return this.mongoCoffeeService.create(createMongoCoffeeDto);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.mongoCoffeeService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mongoCoffeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMongoCoffeeDto: UpdateMongoCoffeeDto,
  ) {
    return this.mongoCoffeeService.update(id, updateMongoCoffeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mongoCoffeeService.remove(id);
  }
}

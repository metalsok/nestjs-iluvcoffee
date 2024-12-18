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
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { ApiTags } from '@nestjs/swagger';
import { Protocol } from '../common/decorators/protocol.decorator';
import { User } from '../common/decorators/user.decorator';
import { ActiveUserData } from '../iam/models/active-user.interface';
import { Role } from '../users/enums/role.enum';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Permission } from '../iam/models/permission.type';
import { Permissions } from '../iam/decorators/permissions.decorator';

@ApiTags('coffees')
@Controller('coffee')
export class CoffeesController {
  constructor(private readonly coffeesService: CoffeesService) {}

  @Get()
  async findAll(
    @User() user: ActiveUserData,
    @Protocol() protocol: string,
    @Query() paginationQuery: PaginationQueryDto,
  ) {
    console.log(user);
    console.log(protocol);
    //    await new Promise((resolve) => setTimeout(resolve, 5000));
    return this.coffeesService.findAll(paginationQuery);
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.coffeesService.findOne(id);
  }

  //@Roles(Role.Admin)
  @Permissions(Permission.CreateCoffee)
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeesService.create(createCoffeeDto);
  }

  @Patch(':id/recommend')
  recommend(@Param('id') id: number) {
    return this.coffeesService.recommendCoffee(id);
  }

  @Roles(Role.Admin)
  @Patch(':id/')
  update(@Param('id') id: number, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeesService.update(id, updateCoffeeDto);
  }

  @Roles(Role.Admin)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.coffeesService.remove(id);
  }
}

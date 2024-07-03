import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from '../events/entities/event.entity';
import { CommonModule } from '../common/common.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

@Module({
  controllers: [CoffeesController],
  providers: [CoffeesService, ConfigService],
  imports: [
    CommonModule,
    TypeOrmModule.forFeature([Coffee, Flavor, Event]),
    ConfigModule.forFeature(coffeesConfig),
  ],
})
export class CoffeesModule {}

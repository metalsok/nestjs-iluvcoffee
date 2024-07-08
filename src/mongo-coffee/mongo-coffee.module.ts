import { Module } from '@nestjs/common';
import { MongoCoffeeService } from './mongo-coffee.service';
import { MongoCoffeeController } from './mongo-coffee.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoffeeSchema, MongoCoffee } from './entities/mongo-coffee.entity';

@Module({
  controllers: [MongoCoffeeController],
  providers: [MongoCoffeeService],
  imports: [
    MongooseModule.forFeature([
      { name: MongoCoffee.name, schema: CoffeeSchema },
    ]),
  ],
})
export class MongoCoffeeModule {}

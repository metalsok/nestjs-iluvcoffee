import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMongoCoffeeDto } from './dto/create-mongo-coffee.dto';
import { UpdateMongoCoffeeDto } from './dto/update-mongo-coffee.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { MongoCoffee } from './entities/mongo-coffee.entity';
import { Connection, Model } from 'mongoose';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { Event } from './entities/event.entity';

@Injectable()
export class MongoCoffeeService {
  constructor(
    @InjectModel(MongoCoffee.name)
    private readonly coffeeModel: Model<MongoCoffee>,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  create(createMongoCoffeeDto: CreateMongoCoffeeDto) {
    const coffee = new this.coffeeModel(createMongoCoffeeDto);
    return coffee.save();
  }

  findAll(paginationQuery: PaginationQueryDto) {
    return this.coffeeModel
      .find()
      .skip(paginationQuery.offset)
      .limit(paginationQuery.limit)
      .exec();
  }

  async findOne(id: string) {
    const coffee = await this.coffeeModel.findById(id).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return coffee;
  }

  async update(id: string, updateMongoCoffeeDto: UpdateMongoCoffeeDto) {
    const existingCoffee = await this.coffeeModel
      .findOneAndUpdate(
        { _id: id },
        { $set: updateMongoCoffeeDto },
        { new: true },
      )
      .exec();
    if (!existingCoffee) {
      throw new NotFoundException(`Coffee with #${id} not found`);
    }
    return existingCoffee;
  }

  async remove(id: string) {
    const coffee = await this.coffeeModel.findByIdAndDelete(id).exec();
    if (!coffee) {
      throw new NotFoundException(`Coffee with #${id} not found`);
    }
  }

  async recommend(id: string) {
    const coffee = await this.findOne(id);
    const session = await this.connection.startSession();
    session.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new this.eventModel({
        name: 'recommend_coffee',
        type: 'coffee',
        payload: { coffeeId: coffee.id },
      });
      await recommendEvent.save({ session });
      await coffee.save({ session });

      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}

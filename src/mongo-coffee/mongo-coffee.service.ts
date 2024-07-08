import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateMongoCoffeeDto } from './dto/create-mongo-coffee.dto';
import { UpdateMongoCoffeeDto } from './dto/update-mongo-coffee.dto';
import { InjectModel } from '@nestjs/mongoose';
import { MongoCoffee } from './entities/mongo-coffee.entity';
import { Model } from 'mongoose';

@Injectable()
export class MongoCoffeeService {
  constructor(
    @InjectModel(MongoCoffee.name)
    private readonly coffeeModel: Model<MongoCoffee>,
  ) {}

  create(createMongoCoffeeDto: CreateMongoCoffeeDto) {
    const coffee = new this.coffeeModel(createMongoCoffeeDto);
    return coffee.save();
  }

  findAll() {
    return this.coffeeModel.find().exec();
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
}

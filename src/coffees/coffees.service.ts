import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Coffee } from './entities/coffee.entity';
import { Event } from '../events/entities/event.entity';
import { CreateCoffeeDto } from './dto/create-cofee.dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import coffeesConfig from './config/coffees.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class CoffeesService {
  constructor(
    @InjectRepository(Coffee)
    private readonly coffeeRepository: Repository<Coffee>,
    @InjectRepository(Flavor)
    private readonly flavorRepository: Repository<Flavor>,
    private readonly dataSource: DataSource,
    @Inject(coffeesConfig.KEY)
    private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>,
  ) {
    console.log(this.coffeesConfiguration.foo);
  }

  // Get all coffees
  findAll(paginationQuery: PaginationQueryDto) {
    const { offset, limit } = paginationQuery;
    return this.coffeeRepository.find({
      relations: { flavors: true },
      skip: offset,
      take: limit,
    });
  }

  // Get a single coffee by ID
  async findOne(id: number) {
    const coffee = await this.coffeeRepository.findOne({
      where: { id },
      relations: { flavors: true },
    });
    if (!coffee) {
      throw new HttpException(
        `Coffee with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return coffee;
  }

  // Create a new coffee
  async create(createCoffeeDto: CreateCoffeeDto) {
    const flavors = await Promise.all(
      createCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
    );
    const coffee = this.coffeeRepository.create({
      ...createCoffeeDto,
      flavors,
    });
    return this.coffeeRepository.save(coffee);
  }

  // Update a coffee by ID
  async update(id: number, updateCoffeeDto: UpdateCoffeeDto) {
    const flavors =
      updateCoffeeDto.flavors &&
      (await Promise.all(
        updateCoffeeDto.flavors.map((name) => this.preloadFlavorByName(name)),
      ));

    const coffee = await this.coffeeRepository.preload({
      id,
      ...updateCoffeeDto,
      flavors,
    });

    if (!coffee) {
      throw new NotFoundException(`Coffee #${id} not found`);
    }
    return this.coffeeRepository.save(coffee);
  }

  async recommendCoffee(id: number) {
    const queryRunner = this.dataSource.createQueryRunner();
    const coffee = await this.coffeeRepository.findOneBy({ id });

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      coffee.recommendations++;
      const recommendEvent = new Event();

      recommendEvent.name = 'recommend_coffee';
      recommendEvent.type = 'coffee';
      recommendEvent.payload = { coffeeId: coffee.id };

      await queryRunner.manager.save(coffee);
      await queryRunner.manager.save(recommendEvent);

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // Delete a coffee by ID
  async remove(id: number) {
    const coffee = await this.findOne(id);
    return this.coffeeRepository.remove(coffee);
  }

  async preloadFlavorByName(name: string): Promise<Flavor> {
    const flavor = await this.flavorRepository.findOne({
      where: { name },
    });
    if (flavor) {
      return flavor;
    }
    return this.flavorRepository.create({ name });
  }
}

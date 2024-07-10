import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { DataSource, Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Flavor } from './entities/flavor.entity';
import { Coffee } from './entities/coffee.entity';
import { HttpException } from '@nestjs/common';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;
const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoffeesService,
        { provide: DataSource, useValue: {} },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('when coffee with ID exists', async () => {
      const coffeeId = 1;
      const expectedCoffee = {};
      coffeeRepository.findOne.mockReturnValue(expectedCoffee);
      const coffee = await service.findOne(coffeeId);
      expect(coffee).toEqual(expectedCoffee);
    });
    it('should throw the "NotFoundException"', () => {
      expect(service).toBeDefined();
    });
  });

  describe('otherwise', () => {
    it('should throw the "NotFoundException"', async () => {
      const coffeeId = 1;
      coffeeRepository.findOne.mockReturnValue(undefined);
      expect(service).toBeDefined();

      try {
        await service.findOne(coffeeId);
        expect(false).toBeTruthy();
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.message).toEqual(`Coffee with ID ${coffeeId} not found`);
      }
    });
  });
});

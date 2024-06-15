import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class CoffeesService {
  private coffees = [
    {
      id: 1,
      name: 'Shipwreck',
      brand: 'Some cool brand',
      flavors: ['chocolate', 'vanilla'],
    },
  ];

  // Get all coffees
  findAll() {
    return this.coffees;
  }

  // Get a single coffee by ID
  findOne(id: number) {
    const coffee = this.coffees.find((item) => item.id === id);
    if (!coffee) {
      throw new HttpException(
        `Coffee with ID ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
    return coffee;
  }

  // Create a new coffee
  create(createCoffeeDto: any) {
    const newCoffee = {
      id: this.coffees.length + 1,
      ...createCoffeeDto,
    };
    this.coffees.push(newCoffee);
    return newCoffee;
  }

  // Update a coffee by ID
  update(id: number, updateCoffeeDto: any) {
    const existingCoffee = this.findOne(id);
    if (existingCoffee) {
      const updatedCoffee = { ...existingCoffee, ...updateCoffeeDto };
      this.coffees = this.coffees.map((coffee) =>
        coffee.id === id ? updatedCoffee : coffee,
      );
      return updatedCoffee;
    }
  }

  // Delete a coffee by ID
  remove(id: number) {
    const coffeeIndex = this.coffees.findIndex((item) => item.id === id);
    console.log(coffeeIndex);
    if (coffeeIndex === -1) {
      throw new HttpException(`Coffee with ID ${id} not found`, 404);
    }
    this.coffees.splice(coffeeIndex, 1);
    return { message: `Coffee with ID ${id} has been deleted` };
  }
}

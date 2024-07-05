import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class IntegerPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const integer = parseInt(value, 10);
    if (isNaN(integer)) {
      throw new BadRequestException(
        `The provided value "${integer}" is not a number`,
      );
    }
    return integer;
  }
}

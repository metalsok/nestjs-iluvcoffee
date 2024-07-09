import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class MongoCoffee extends Document {
  @Prop({ index: true })
  name: string;
  @Prop()
  brand: string;
  @Prop({ default: 0 })
  recommendations: number;
  @Prop(String)
  flavors: string[];
}

export const CoffeeSchema = SchemaFactory.createForClass(MongoCoffee);
CoffeeSchema.index({ name: 1, brand: -1 });

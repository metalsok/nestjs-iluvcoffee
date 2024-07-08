import { registerAs } from '@nestjs/config';

export default registerAs('common', () => ({
  api_key: process.env.API_KEY,
}));

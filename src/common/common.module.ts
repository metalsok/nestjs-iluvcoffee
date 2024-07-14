import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ApiKeyGuard } from './guards/api-key.guard';
import { ConfigModule } from '@nestjs/config';
import { WrapResponseInterceptor } from './interceptors/wrap-response/wrap-response.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout/timeout.interceptor';
import commonConfig from './common.config';

@Module({
  imports: [ConfigModule.forFeature(commonConfig)],
  providers: [
    { provide: APP_GUARD, useClass: ApiKeyGuard },
    {
      provide: APP_INTERCEPTOR,
      useClass: WrapResponseInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TimeoutInterceptor,
    },
  ],
})
export class CommonModule {}

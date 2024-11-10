import { Module } from '@nestjs/common';
import {
  InternalHttpClientService,
  SINGLE_INTERNAL_HTTP_CLIENT,
} from './services';

@Module({
  imports: [],
  controllers: [],
  providers: [
    InternalHttpClientService,
    {
      provide: SINGLE_INTERNAL_HTTP_CLIENT,
      useFactory() {
        return new InternalHttpClientService(null);
      },
    },
  ],
  exports: [InternalHttpClientService, SINGLE_INTERNAL_HTTP_CLIENT],
})
export class HttpModule {}

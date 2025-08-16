import { Module } from "@nestjs/common";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { TransformInterceptor } from "./interceptors/transform.interceptor";
import { ApiResponseService } from "./services/api-response.service";

@Module({
  providers: [
    ApiResponseService,
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
  exports: [ApiResponseService],
})
export class CommonModule {}

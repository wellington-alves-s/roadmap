import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        // Se a resposta já for um objeto, retorna como está
        if (data && typeof data === 'object') {
          return data;
        }
        
        // Caso contrário, envolve em um objeto
        return { data };
      }),
    );
  }
}

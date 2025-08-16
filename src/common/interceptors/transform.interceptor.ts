import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        // Se a resposta for undefined ou null, retorna um objeto vazio
        if (data === undefined || data === null) {
          return {};
        }

        // Se a resposta já for um objeto e não for um array, retorna como está
        if (typeof data === "object" && !Array.isArray(data)) {
          return data;
        }
        
        // Caso contrário, envolve em um objeto
        return { data };
      }),
    );
  }
}

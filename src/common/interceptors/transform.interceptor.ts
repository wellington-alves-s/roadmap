import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponseService } from "../services/api-response.service";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  constructor(private readonly apiResponseService: ApiResponseService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data: any) => {
        try {
          // Usa o serviço para transformar a resposta
          return this.apiResponseService.transform(data);
        } catch (error) {
          console.error("Erro ao transformar resposta:", error);
          // Em caso de erro, retorna um objeto de erro
          return {
            success: false,
            error: "Erro ao processar dados",
            message: error.message
          };
        }
      }),
    );
  }
}

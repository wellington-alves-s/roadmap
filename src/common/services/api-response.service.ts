import { Injectable } from "@nestjs/common";

@Injectable()
export class ApiResponseService {
  transform(data: any) {
    // Se for null ou undefined, retorna objeto vazio
    if (data === null || data === undefined) {
      return { success: true, data: {} };
    }

    // Se já for um objeto com status/message/data, retorna como está
    if (
      typeof data === "object" &&
      !Array.isArray(data) &&
      (data.hasOwnProperty("status") || data.hasOwnProperty("message") || data.hasOwnProperty("data"))
    ) {
      return { success: true, ...data };
    }

    // Se for um array ou objeto simples, envolve em data
    return {
      success: true,
      data: data
    };
  }
}

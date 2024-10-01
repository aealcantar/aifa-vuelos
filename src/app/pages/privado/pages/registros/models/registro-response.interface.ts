import {Registro} from "./registro.interface";

export interface RegistroResponse {
  estatus: string,
  response: {
    data: Registro[],
    last_page: number,
    total: number
  }
}

import { Pipe, PipeTransform } from '@angular/core';
import {AutenticacionService} from "../services/autenticacion.service";

@Pipe({
  name: 'validarUsuarioLogueado',
  standalone: true,
  pure: true
})
export class ValidarUsuarioLogueadoPipe implements PipeTransform {
  private cache = new Map<string, boolean>();

  constructor(private authService: AutenticacionService) {}

  transform(curp: string): boolean {
    if (!this.cache.has(curp)) {
      const esValido = curp !== this.authService.usuarioSesion?.curp;
      this.cache.set(curp, esValido);
    }
    return this.cache.get(curp) as boolean;
  }

}

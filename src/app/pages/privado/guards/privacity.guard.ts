import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AutenticacionService, TOKEN_FORTALEZA} from "../../../core/services/autenticacion.service";

export const privacityGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AutenticacionService = inject(AutenticacionService);
  const token: string | null = localStorage.getItem(TOKEN_FORTALEZA);
  const privacidad: boolean = localStorage.getItem('privacity') === 'true';
  const privacidadActualizada: boolean = localStorage.getItem('privacityUpdate') === 'true';

  if (!token) {
    void router.navigate(['/publico/inicio-sesion']);
    return false;
  }

  const usuario = authService.usuarioSesion;
  if (usuario && usuario.idRol === 2 && (privacidad || privacidadActualizada)) {
    void router.navigate(['/privado/gestion-contratos']);
    return false;
  }

  if (usuario && usuario.idRol === 2 && (!privacidad || !privacidadActualizada)) {
    return true;
  }

  if (usuario && usuario.idRol === 1) {
    void router.navigate(['/privado/registros']);
    return false;
  }

  return false;
};

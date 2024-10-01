import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AutenticacionService, TOKEN_FORTALEZA} from "../../../core/services/autenticacion.service";

export const adminGIAGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const authService: AutenticacionService = inject(AutenticacionService);
  authService.recuperarSesion();
  const token: string | null = localStorage.getItem(TOKEN_FORTALEZA);
  const usuario = authService.usuarioSesion;

  if (token) {
    if (usuario && usuario.idRol === 1) {
      return true;
    }
    if (usuario && usuario.idRol === 2) {
      void router.navigate(['/privado/gestion-contratos']);
      return false;
    }
  }

  void router.navigate(['/publico/inicio-sesion']);
  return false;
};

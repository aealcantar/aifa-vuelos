import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TOKEN_FORTALEZA } from '../services/autenticacion.service';

export const publicGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const token: string | null = localStorage.getItem(TOKEN_FORTALEZA);

  if (!token) {
    return true;
  } else {
    void router.navigate(['/privado/registros']);
    return false;
  }
};

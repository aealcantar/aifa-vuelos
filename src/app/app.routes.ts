import {Routes} from '@angular/router';
import {PaginaNoEncontradaComponent} from "./components/pagina-no-encontrada/pagina-no-encontrada.component";
import {publicGuard} from "./core/guards/public.guard";
import {authGuard} from "./core/guards/auth.guard";

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'publico',
    pathMatch: 'full',
  },
  {
    path: 'publico',
    loadChildren: () => import('./pages/publico/publico.module').then(m => m.PublicoModule),
    canActivate: [publicGuard]
  },
  {
    path: 'privado',
    loadChildren: () => import('./pages/privado/privado.module').then(m => m.PrivadoModule),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'publico',
    pathMatch: 'full',
  }
];

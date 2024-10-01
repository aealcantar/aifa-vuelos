import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {InicioSesionComponent} from "./inicio-sesion/inicio-sesion.component";
import {CrearCuentaComponent} from "./crear-cuenta/crear-cuenta.component";
import {RegistroInicialComponent} from "./registro-inicial/registro-inicial.component";
import {RestaurarContrasenaComponent} from "./restaurar-contrasena/restaurar-contrasena.component";
import {RestablecerContrasenaComponent} from "./restablecer-contrasena/restablecer-contrasena.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'inicio-sesion',
    pathMatch: 'full',
  },
  {
    path: 'inicio-sesion',
    component: InicioSesionComponent,
  },
  {
    path: 'crear-cuenta/:id',
    component: CrearCuentaComponent,
  },
  {
    path: 'registro-inicial/:id',
    component: RegistroInicialComponent,
  },
  {
    path: 'restaurar-contrasena',
    component: RestaurarContrasenaComponent
  },
  {
    path: 'restablecer-contrasena/:id',
    component: RestablecerContrasenaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicoRoutingModule {
}

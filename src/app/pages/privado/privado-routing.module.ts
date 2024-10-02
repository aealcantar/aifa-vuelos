import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PrivadoComponent } from './privado.component';
import { RegistrosComponent } from './pages/registros/components/registros/registros.component';
import { NuevoRegistroComponent } from './pages/registros/components/nuevo-registro/nuevo-registro.component';
import { RegistrosExternoComponent } from './pages/registros/components/registros-externo/registros-externo.component';
import { adminGIAGuard } from './guards/admin-gia.guard';
import { adminExternoGuard } from './guards/admin-externo.guard';
import { AvisoPrivacidadComponent } from './pages/aviso-privacidad/aviso-privacidad.component';
import { privacityGuard } from './guards/privacity.guard';
import { UsuariosComponent } from './pages/usuarios/components/usuarios/usuarios.component';
import { NuevoUsuarioComponent } from './pages/usuarios/components/nuevo-usuario/nuevo-usuario.component';
import { RegistroComplementarioComponent } from './pages/registros/components/registro-complementario/registro-complementario.component';
import { nuevoRegistroResolver } from './pages/registros/resolvers/nuevo-registro.resolver';
import { registrosResolver } from './pages/registros/resolvers/registros.resolver';
import { ValidacionRegistroComponent } from './pages/registros/components/validacion-registro/validacion-registro.component';
import { validarContratoResolver } from './pages/registros/resolvers/validar-contrato.resolver';
import { usuariosResolver } from './pages/usuarios/resolvers/usuarios.resolver';
import { RegistroExternoResolver } from './pages/registros/resolvers/registro-externo.resolver';
import { detalleRegistroResolver } from './pages/registros/resolvers/detalle-registro.resolver';
import { DetalleRegistroComponent } from './pages/registros/components/detalle-registro/detalle-registro.component';
import { registroComplementarioResolver } from './pages/registros/resolvers/registro-complementario.resolver';

const routes: Routes = [
  {
    path: '',
    component: PrivadoComponent,
    children: [
      {
        path: 'aeropasillos',
        loadComponent: () =>
          import('./pages/aeropasillos/aeropasillos.component').then(
            (m) => m.AeropasillosComponent
          ),
      },
      {
        path: 'registros',
        component: RegistrosComponent,
        canActivate: [adminGIAGuard],
        resolve: {
          respuesta: registrosResolver,
        },
      },
      {
        path: 'gestion-contratos',
        component: RegistrosExternoComponent,
        canActivate: [adminExternoGuard],
        resolve: {
          respuesta: RegistroExternoResolver,
        },
      },
      {
        path: 'gestion-contratos/complementario/:id',
        component: RegistroComplementarioComponent,
        canActivate: [adminExternoGuard],
        resolve: {
          respuesta: registroComplementarioResolver,
        },
      },
      {
        path: 'registros/nuevo-contrato',
        component: NuevoRegistroComponent,
        canActivate: [adminGIAGuard],
        resolve: {
          respuesta: nuevoRegistroResolver,
        },
      },
      {
        path: 'registros/validar-contrato/:id',
        component: ValidacionRegistroComponent,
        canActivate: [adminGIAGuard],
        resolve: {
          respuesta: validarContratoResolver,
        },
      },
      {
        path: 'registros/nuevo-acuerdo',
        component: NuevoRegistroComponent,
        canActivate: [adminGIAGuard],
        resolve: {
          respuesta: nuevoRegistroResolver,
        },
      },
      {
        path: 'gestion-contratos/detalle-registro/:id',
        component: DetalleRegistroComponent,
        resolve: {
          respuesta: detalleRegistroResolver,
        },
      },
      {
        path: 'registros/detalle-registro/:id',
        component: DetalleRegistroComponent,
        resolve: {
          respuesta: detalleRegistroResolver,
        },
      },
      {
        path: 'aviso-privacidad',
        component: AvisoPrivacidadComponent,
        canActivate: [privacityGuard],
      },
      {
        path: '',
        redirectTo: 'aeropasillos',
        pathMatch: 'full',
      },
      {
        path: 'usuarios',
        component: UsuariosComponent,
        resolve: {
          respuesta: usuariosResolver,
        },
      },
      {
        path: 'usuarios/nuevo-usuario',
        component: NuevoUsuarioComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrivadoRoutingModule {}

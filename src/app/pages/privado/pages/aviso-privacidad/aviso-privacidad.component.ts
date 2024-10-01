import { Component } from '@angular/core';
import {ButtonDirective} from "primeng/button";
import { TituloPrincipalComponent } from '../../../../shared/titulo-principal/titulo-principal.component';
import { AvisoPrivacidadService } from '../../../../core/services/aviso-privacidad.service';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AutenticacionService } from '../../../../core/services/autenticacion.service';

@Component({
  selector: 'app-aviso-privacidad',
  standalone: true,
  imports: [TituloPrincipalComponent, ButtonDirective, DividerModule],
  providers: [AvisoPrivacidadService],
  templateUrl: './aviso-privacidad.component.html',
  styleUrl: './aviso-privacidad.component.scss'
})
export class AvisoPrivacidadComponent {
    constructor(
              private avisoPrivacidadService: AvisoPrivacidadService,
              private messageService: MessageService,
              private autenticacion: AutenticacionService,
              private router: Router){}

    aceptar(): void {
        let id_usuario = this.autenticacion.usuarioSesion?.idUsuario;

       if(!id_usuario) {
        this.mostrarAlertaAvisoPrivacidadError("No hay sesion de usuario activa");
        void this.router.navigate(['/publico/inicio-sesion']);
        return;
       }

       this.avisoPrivacidadService.aceptarAvisoPrivacidad(id_usuario)
       .subscribe({
        next: resp => { this.mostrarAlertaAvisodePrivacidad(resp.msg); this.redirect() },
        error: err => { this.manejoMesajeError(err)}
       });
    }

    mostrarAlertaAvisoPrivacidadError(mensaje: string) {
      this.messageService.add({
        severity: 'error',
        summary: '¡Error!',
        detail: mensaje,
      });
    }

    mostrarAlertaAvisodePrivacidad(mensaje: string){
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: mensaje,
      });
    }

    manejoMesajeError(error: HttpErrorResponse): void {
      console.log(error)
      if(error.status === 401) this.mostrarAlertaAvisoPrivacidadError(error.error.message)
      if(error.status === 400) this.mostrarAlertaAvisoPrivacidadError(error.error.msg)
    }

    redirect(): void {
      localStorage.setItem('privacityUpdate', 'true');
      void this.router.navigate(['/privado/gestion-contratos']);
    }
}

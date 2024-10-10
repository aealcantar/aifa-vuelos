//TODO: Mensaje Error de Sistema

import { Component, signal, WritableSignal } from '@angular/core';
import { AsidePublicoAifaComponent } from '../../../components/aside-publico-aifa/aside-publico-aifa.component';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PATRON_CORREO, PATRON_CURP } from '../../../utils/constants';
import { ResetPassRequest } from '../../../core/models/reset-pass-request.interface';
import { LoaderService } from '../../../shared/loader/services/loader.service';

import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificacionesService } from '../../../core/services/notificaciones.service';

@Component({
  selector: 'app-restaurar-contrasena',
  standalone: true,
  imports: [
    AsidePublicoAifaComponent,
    PrimeTemplate,
    TabViewModule,
    ButtonDirective,
    CardModule,
    InputTextModule,
    ReactiveFormsModule,
    NgClass,
    RouterLink,
  ],
  providers: [NotificacionesService],
  templateUrl: './restaurar-contrasena.component.html',
  styleUrl: './restaurar-contrasena.component.scss',
})
export class RestaurarContrasenaComponent {
  restablecerForm!: FormGroup;

  indiceTab: WritableSignal<number> = signal(0);

  constructor(
    private formBuilder: FormBuilder,
    private loaderService: LoaderService,
    private notificacionesService: NotificacionesService,
    private messageService: MessageService,
  ) {
    this.restablecerForm = this.crearFormularioRestablecerContrasena();
  }

  crearFormularioRestablecerContrasena(): FormGroup {
    return this.formBuilder.group({
      curp: ['', [Validators.required, Validators.maxLength(18), Validators.pattern(PATRON_CURP)]],
      correo: ['', [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern(PATRON_CORREO)]],
    });
  }

  irSiguienteSeccion(): void {
    this.indiceTab.update((value) => value + 1);
  }

  validarDatosUsuario(): void {
    if (this.restablecerForm.invalid) return;
    const solicitud: ResetPassRequest = this.crearSolicitudResetPass();
    this.loaderService.activar();
    this.notificacionesService
      .restaurarPassword(solicitud)
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: () => this.manejarRestaurarPassCorrecto(),
        error: (error: HttpErrorResponse) => this.manejarRestaurarPassError(error),
      });
  }

  manejarRestaurarPassCorrecto(): void {
    this.irSiguienteSeccion();
  }

  manejarRestaurarPassError(error: HttpErrorResponse): void {
    console.log(error);
    this.mostrarAlertaDatosInvalidos('El CURP y/o correo ingresados no coinciden con los registrados en sistema, favor de validar.');
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({ severity: 'error', summary: '¡Error!', detail: mensaje });
  }

  crearSolicitudResetPass(): ResetPassRequest {
    return {
      correo: this.restablecerForm.get('correo')?.value,
      curp: this.restablecerForm.get('curp')?.value,
      url: `${window.location.protocol}//${window.location.host}/publico/restablecer-contrasena/`,
    };
  }

  get f() {
    return this.restablecerForm.controls;
  }
}

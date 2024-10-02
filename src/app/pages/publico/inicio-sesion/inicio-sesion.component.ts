import { Component } from '@angular/core';
import { AsidePublicoAifaComponent } from '../../../components/aside-publico-aifa/aside-publico-aifa.component';
import { CardModule } from 'primeng/card';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { NgClass } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { AutenticacionService } from '../../../core/services/autenticacion.service';
import { LoginRequest } from '../../../core/models/login-request.interface';
import { LoaderService } from '../../../shared/loader/services/loader.service';
import { finalize } from 'rxjs';
import { PATRON_CURP } from '../../../utils/constants';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';
import { cambiarVisibilidadPassword } from '../../../utils/password-utils';

@Component({
  selector: 'app-inicio-sesion',
  standalone: true,
  imports: [
    AsidePublicoAifaComponent,
    CardModule,
    ReactiveFormsModule,
    InputTextModule,
    NgClass,
    ButtonDirective,
    RouterLink,
  ],
  providers: [AutenticacionService],
  templateUrl: './inicio-sesion.component.html',
  styleUrl: './inicio-sesion.component.scss',
})
export class InicioSesionComponent {
  authForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AutenticacionService,
    private router: Router,
    private loaderService: LoaderService,
    private messageService: MessageService
  ) {
    this.authForm = this.crearFormulario();
  }

  crearFormulario(): FormGroup {
    return this.formBuilder.group({
      curp: [
        '',
        [
          Validators.required,
          Validators.minLength(18),
          Validators.maxLength(18),
          Validators.pattern(PATRON_CURP),
        ],
      ],
      contrasenia: ['', [Validators.required]],
    });
  }

  iniciarSesion(): void {
    if (this.authForm.invalid) return;
    const solicitud: LoginRequest = this.crearSolicitudLogin();
    this.loaderService.activar();
    this.authService
      .login(solicitud)
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: () => this.manejarInicioSesionCorrecto(),
        error: (error: HttpErrorResponse) =>
          this.manejarInicioSesionError(error),
      });
  }

  manejarInicioSesionCorrecto(): void {
    void this.router.navigate(['/privado/aeropasillos']);
  }

  manejarInicioSesionError(error: HttpErrorResponse): void {
    console.log(error);
    const mensaje: string = this.obtenerMensajeError(error.status);
    this.mostrarAlertaDatosInvalidos(mensaje);
  }

  obtenerMensajeError(status: number): string {
    if (status === 401)
      return 'CURP o contraseña incorrectos, favor de validar.';
    return 'El sistema no se encuentra disponible. Favor de intentar más tarde';
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({
      severity: 'error',
      summary: '¡Error!',
      detail: mensaje,
    });
  }

  crearSolicitudLogin(): LoginRequest {
    return {
      curp: this.authForm.get('curp')?.value,
      password: this.authForm.get('contrasenia')?.value,
    };
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  get f() {
    return this.authForm.controls;
  }

  protected readonly cambiarVisibilidadPassword = cambiarVisibilidadPassword;
}

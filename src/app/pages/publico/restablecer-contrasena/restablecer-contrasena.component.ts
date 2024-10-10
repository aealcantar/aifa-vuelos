import { Component, signal, ViewChild, WritableSignal } from '@angular/core';
import { AsidePublicoAifaComponent } from '../../../components/aside-publico-aifa/aside-publico-aifa.component';
import { MessageService, PrimeTemplate } from 'primeng/api';
import { TabViewModule } from 'primeng/tabview';
import { ButtonDirective } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';
import { InputOtpModule } from 'primeng/inputotp';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CodeRequest } from '../../../core/models/code-request.interface';
import { NotificacionesService } from '../../../core/services/notificaciones.service';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { LoaderService } from '../../../shared/loader/services/loader.service';
import { finalize } from 'rxjs';
import { ChangePassRequest } from '../../../core/models/change-pass-request.interface';
import { Password, PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { cambiarVisibilidadPassword } from '../../../utils/password-utils';
import { CodeResponse } from '../../../core/models/code-response.interface';

@Component({
  selector: 'app-restablecer-contrasena',
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
    InputOtpModule,
    RouterLink,
    PasswordModule,
    DividerModule,
  ],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrl: './restablecer-contrasena.component.scss',
})
export class RestablecerContrasenaComponent {
  @ViewChild('nuevoPass', { static: false }) nuevoPass!: Password;
  @ViewChild('confirmPass', { static: false }) confirmPass!: Password;

  indiceTab: WritableSignal<number> = signal(1);
  id: string = '';
  private curp: string = '';
  private email: string = '';

  codigoForm!: FormGroup;
  registroForm!: FormGroup;
  codigoCaducado: boolean = false;

  REGEX_PASS: RegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]{8,16}$/;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notificacionesService: NotificacionesService,
    private loaderService: LoaderService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.codigoForm = this.crearCodigoForm();
    this.registroForm = this.crearRegistroForm();
    this.id = this.activatedRoute.snapshot.paramMap.get('id') as unknown as string;
  }

  procesarInputsPassword(): void {
    const newPassElement = this.nuevoPass.input.nativeElement;
    const confirmPassElement = this.confirmPass.input.nativeElement;
    if (newPassElement) {
      newPassElement.setAttribute('maxlength', '16');
    }
    if (confirmPassElement) {
      confirmPassElement.setAttribute('maxlength', '16');
    }
  }

  crearCodigoForm(): FormGroup {
    return this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  crearRegistroForm(): FormGroup {
    return this.formBuilder.group({
      nuevaContrasena: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(this.REGEX_PASS)]],
      confirmarContrasena: [
        '',
        [Validators.required, Validators.pattern(this.REGEX_PASS), Validators.minLength(8), Validators.maxLength(16)],
      ],
    });
  }

  irSiguienteSeccion(): void {
    this.indiceTab.update((value) => value + 1);
    this.procesarInputsPassword();
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  validarCodigo(): void {
    const solicitud: CodeRequest = this.crearSolicitudValidarCodigo();
    this.loaderService.activar();
    this.notificacionesService
      .verificarCodigo(solicitud)
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: (respuesta: HttpResponse<CodeResponse>) => this.manejarValidarCodigoCorrecto(respuesta),
        error: (error: HttpErrorResponse) => this.manejarValidarCodigoError(error),
      });
  }

  crearSolicitudValidarCodigo(): CodeRequest {
    return {
      codigo: this.codigoForm.get('codigo')?.value,
      token: this.id,
    };
  }

  manejarValidarCodigoCorrecto(respuesta: HttpResponse<CodeResponse>): void {
    console.log(respuesta);
    this.curp = respuesta.body?.curp as string;
    this.email = respuesta.body?.correo as string;
    this.irSiguienteSeccion();
  }

  cambiarPassword(): void {
    if (this.registroForm.invalid) return;
    if (!this.validarMismoPass()) {
      this.mostrarAlertaDatosInvalidos('Las contraseñas no coinciden, favor de verificar.');
      return;
    }
    const solicitud: ChangePassRequest = this.crearSolicitudCambioPass();
    this.loaderService.activar();
    this.notificacionesService
      .cambiarPassword(solicitud)
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: () => this.manejarCambioPassCorrecto(),
        error: (error: HttpErrorResponse) => this.manejarValidarCodigoError(error),
      });
  }

  crearSolicitudCambioPass(): ChangePassRequest {
    return {
      codigo: this.codigoForm.get('codigo')?.value,
      correo: this.email,
      curp: this.curp,
      pwd: this.registroForm.get('nuevaContrasena')?.value,
    };
  }

  manejarCambioPassCorrecto(): void {
    this.mostrarAlertaDatosValidos('La contraseña se actualizó correctamente');
    void this.router.navigate(['/publico/inicio-sesion']);
  }

  manejarValidarCodigoError(error: HttpErrorResponse): void {
    let MENSAJE_ERROR: string = 'Código de verificación incorrecto, favor de validar';
    if (error.error.caducado) {
      this.codigoCaducado = true;
      MENSAJE_ERROR = 'Su token ha expirado. Favor de solicitar uno nuevo.';
    }
    this.mostrarAlertaDatosInvalidos(MENSAJE_ERROR);
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({ severity: 'error', summary: '¡Error!', detail: mensaje });
  }

  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({ severity: 'success', summary: '¡Exito!', detail: mensaje });
  }

  validarMismoPass(): boolean {
    const nuevaContrasena = this.registroForm.get('nuevaContrasena');
    const confirmarContrasena = this.registroForm.get('confirmarContrasena');
    return nuevaContrasena?.value === confirmarContrasena?.value;
  }

  get f() {
    return this.registroForm.controls;
  }

  protected readonly cambiarVisibilidadPassword = cambiarVisibilidadPassword;
}

import { AfterViewInit, ChangeDetectorRef, Component, ViewChild, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { finalize, mergeMap, forkJoin } from 'rxjs';
import { TabViewModule } from 'primeng/tabview';
import { RouterLink } from '@angular/router';
import { InputOtpModule } from 'primeng/inputotp';
import { CardModule } from 'primeng/card';
import { ButtonDirective } from 'primeng/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageService } from 'primeng/api';
import { DividerModule } from 'primeng/divider';
import { cambiarVisibilidadPassword } from '../../../utils/password-utils';
import { Password, PasswordModule } from 'primeng/password';
import { RegistroService } from '../../../core/services/registro.service';
import { GenerarNuevoCodigo, SolicitarReferenciaCodigoResponse, VerificaCodigo } from '../../../core/models/verifica-codigo.interface';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangePassRequest } from '../../../core/models/change-pass-request.interface';
import { LoaderService } from '../../../shared/loader/services/loader.service';
import { AsidePublicoAifaComponent } from '../../../components/aside-publico-aifa/aside-publico-aifa.component';
import { environment } from '../../../../environments/environment';
import { NotificacionesService } from '../../../core/services/notificaciones.service';
@Component({
  selector: 'app-registro-inicial',
  standalone: true,
  imports: [
    AsidePublicoAifaComponent,
    TabViewModule,
    RouterLink,
    InputOtpModule,
    CardModule,
    ButtonDirective,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    NgClass,
    DividerModule,
  ],
  templateUrl: './registro-inicial.component.html',
  styleUrl: './registro-inicial.component.scss',
})
export class RegistroInicialComponent implements AfterViewInit {
  @ViewChild('crearContrasena', { static: false }) crearContrasena!: Password;
  @ViewChild('confirmContrasena', { static: false }) confirmContrasena!: Password;

  indiceTab: WritableSignal<number> = signal(1);
  curp: string;
  correo: string;
  caducado: boolean;
  codigoForm!: FormGroup;
  registroForm!: FormGroup;
  token: string;
  get isCaducado(): boolean {
    return this.caducado;
  }
  REGEX_PASS: RegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~]{8,16}$/;

  constructor(
    private notificacionesService: NotificacionesService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private registroService: RegistroService,
    private activatedRoute: ActivatedRoute,
    private messageService: MessageService,
    private loaderService: LoaderService,
  ) {
    this.codigoForm = this.crearCodigoForm();
    this.registroForm = this.crearRegistroForm();
    this.correo = '';
    this.curp = '';
    this.caducado = false;
    this.token = this.activatedRoute.snapshot.paramMap.get('id') as unknown as string;
  }

  ngAfterViewInit(): void {
    const contrasenaElement = this.crearContrasena?.input?.nativeElement;
    const confirmarContrasenaElement = this.confirmContrasena?.input?.nativeElement;
    if (contrasenaElement) {
      contrasenaElement.setAttribute('maxlength', '16');
    }
    if (confirmarContrasenaElement) {
      confirmarContrasenaElement.setAttribute('maxlength', '16');
    }
  }

  crearCodigoForm(): FormGroup {
    return this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  crearRegistroForm(): FormGroup {
    return this.formBuilder.group({
      contrasena: ['', [Validators.required, Validators.pattern(this.REGEX_PASS), Validators.minLength(8), Validators.maxLength(16)]],
      confirmarContrasena: [
        '',
        [Validators.required, Validators.pattern(this.REGEX_PASS), Validators.minLength(8), Validators.maxLength(16)],
      ],
    });
  }

  irSiguienteSeccion(): void {
    let verificar: VerificaCodigo = { token: this.token, codigo: this.codigoForm.controls['codigo'].value };
    this.registroService.verificarCodigo(verificar).subscribe({
      next: (resp) => {
        console.log(resp);
        this.mostrarAlertaRegistroInicial(resp.msg);
        this.correo = resp.correo;
        this.curp = resp.curp;
        this.caducado = resp.caducado;
        this.indiceTab.update((value) => value + 1);
      },
      error: (err) => {
        this.caducado = err.error.caducado;
        this.manejoRegistroInicialError(err);
      },
      complete: () => {},
    });
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  cambiarPassword(): void {
    if (!this.validarMismoPass()) {
      this.mostrarAlertaRegistroInicialError('Las contraseñas no coinciden, favor de verificar.');
      return;
    }
    const solicitud: ChangePassRequest = this.crearSolicitudCambioPass();
    this.loaderService.activar();
    this.notificacionesService
      .cambiarPassword(solicitud)
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: () => this.manejarCambioPassCorrecto(),
        error: (error: HttpErrorResponse) => this.mostrarAlertaRegistroInicialError(error.error.msg),
      });
  }

  crearSolicitudCambioPass(): ChangePassRequest {
    return {
      codigo: this.codigoForm.get('codigo')?.value,
      correo: this.correo,
      curp: this.curp,
      pwd: this.registroForm.get('contrasena')?.value,
    };
  }

  validarMismoPass(): boolean {
    const contrasena = this.registroForm.get('contrasena');
    const confirmarContrasena = this.registroForm.get('confirmarContrasena');
    return contrasena?.value && confirmarContrasena?.value && contrasena?.value === confirmarContrasena?.value;
  }

  nuevocodigo(): void {
    let codigo = this.codigoForm.get('codigo')?.value;
    this.registroService
      .solicitarReferenciaCodigo(codigo)
      .pipe(
        finalize(() => this.loaderService.desactivar()),
        mergeMap((respReferenia: SolicitarReferenciaCodigoResponse) => {
          const url = `${window.location.protocol}//${window.location.host}/publico/crear-cuenta`;
          const curp = respReferenia.curp;
          const correo = respReferenia.email;
          const generarCodigo: GenerarNuevoCodigo = { url, curp, dest: [correo] };

          return forkJoin({
            codigo: this.registroService.solicitarNuevoCodigo(generarCodigo),
          });
        }),
      )
      .subscribe({
        next: (resp) => {
          this.mostrarAlertaRegistroInicial('El codigo fue solicitado exitosamente, revisar tu correo electronico');
          console.log(resp);
        },
        error: (err) => {
          this.mostrarAlertaRegistroInicialError(err.error.message);
        },
      });
  }
  get f() {
    return this.registroForm.controls;
  }

  manejoRegistroInicialError(error: HttpErrorResponse): void {
    if (error.status === 409) {
      if (error.error.caducado) {
        this.mostrarAlertaRegistroInicialError('Su token ha expirado. Favor de solicitar uno nuevo');
      } else {
        this.mostrarAlertaRegistroInicialError('Código de verificación incorrecto, favor de validar.');
      }
    }
  }

  mostrarAlertaRegistroInicialError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: '¡Error!',
      detail: mensaje,
    });
  }

  mostrarAlertaRegistroInicial(mensaje: string) {
    this.messageService.add({
      severity: 'success',
      summary: '¡Exito!',
      detail: mensaje,
    });
  }

  manejarCambioPassCorrecto(): void {
    this.mostrarAlertaRegistroInicial('La contraseña se genero correctamente');
    void this.router.navigate(['/publico/inicio-sesion']);
  }
  protected readonly cambiarVisibilidadPassword = cambiarVisibilidadPassword;
}

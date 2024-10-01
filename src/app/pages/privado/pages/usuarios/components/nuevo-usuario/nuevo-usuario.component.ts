import {Component} from '@angular/core';
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {AvatarModule} from "primeng/avatar";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {PanelModule} from "primeng/panel";
import {RadioButtonModule} from "primeng/radiobutton";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PATRON_CORREO, PATRON_CURP} from "../../../../../../utils/constants";
import {NgClass} from "@angular/common";
import {NuevoUsuario} from "../../models/nuevo-usuario.interface";
import {UsuariosService} from "../../services/usuarios.service";
import {MessageService} from "primeng/api";
import {LoaderService} from "../../../../../../shared/loader/services/loader.service";
import {HttpErrorResponse} from "@angular/common/http";
import {finalize} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";
import {NuevoCorreoRegistro} from "../../../registros/models/nuevo-correo-registro.interface";
import {EmpresasService} from "../../../registros/services/empresas.service";

@Component({
  selector: 'app-nuevo-usuario',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    AvatarModule,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    PanelModule,
    RadioButtonModule,
    ReactiveFormsModule,
    NgClass
  ],
  providers: [UsuariosService],
  templateUrl: './nuevo-usuario.component.html',
  styleUrl: './nuevo-usuario.component.scss'
})
export class NuevoUsuarioComponent {
  nuevoUsuarioForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private usuarioService: UsuariosService,
              private messageService: MessageService,
              private loaderService: LoaderService,
              private empresaService: EmpresasService,
              private router: Router,
              private activedRoute: ActivatedRoute) {
    this.nuevoUsuarioForm = this.crearNuevoUsuarioForm();
  }

  crearNuevoUsuarioForm(): FormGroup {
    return this.formBuilder.group({
      curp: ['', [Validators.required, Validators.maxLength(18),
        Validators.minLength(18), Validators.pattern(PATRON_CURP)]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(20)]],
      apellidoMaterno: ['', [Validators.required, Validators.maxLength(20)]],
      correo: ['', [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern(PATRON_CORREO)]],
      cargo: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }

  crearSolicitudNuevoUsuario(): NuevoUsuario {
    return {
      cve_curp: this.nuevoUsuarioForm.get('curp')?.value,
      id_rol: 1,
      ref_cargo: this.nuevoUsuarioForm.get('cargo')?.value,
      ref_email: this.nuevoUsuarioForm.get('correo')?.value,
      ref_nombre: this.nuevoUsuarioForm.get('nombre')?.value,
      ref_primer_apellido: this.nuevoUsuarioForm.get('apellidoPaterno')?.value,
      ref_segundo_apellido: this.nuevoUsuarioForm.get('apellidoMaterno')?.value
    }
  }

  guardarUsuario(): void {
    const solicitud: NuevoUsuario = this.crearSolicitudNuevoUsuario();
    this.loaderService.activar();
    this.usuarioService.crearUsuario(solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: () => this.manejarGuardarUsuarioCorrecto(),
      error: (error: HttpErrorResponse) => this.manejarErrorGuardarUsuario(error)
    });
  }

  manejarGuardarUsuarioCorrecto(): void {
    this.mostrarAlertaDatosValidos('El usuario se ha registrado correctamente');
    void this.router.navigate(['./..'], {relativeTo: this.activedRoute});
    const solicitud: NuevoCorreoRegistro = this.generarSolicitudesCorreo();
    this.empresaService.enviarCorreoNuevoRegistro(solicitud).subscribe({
      next: () => {
      },
      error: (error) => console.log(error)
    })
  }

  manejarErrorGuardarUsuario(error: HttpErrorResponse): void {
    console.log(error);
    if (error.status === 422) {
      this.mostrarAlertaDatosInvalidos('No se puede agregar el usuario, el correo electrónico ya se encuentra registrado en el contrato');
      return;
    }
    this.mostrarAlertaDatosInvalidos('Error al registrar el usuario');
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
  }

  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: '¡Exito!',
      detail: mensaje,
    });
  }

  generarSolicitudesCorreo(): NuevoCorreoRegistro {
    return {
      url: `${window.location.protocol}//${window.location.host}/publico/crear-cuenta`,
      curp: this.nuevoUsuarioForm.get('curp')?.value,
      dest: [this.nuevoUsuarioForm.get('correo')?.value]
    }
  }

  get f() {
    return this.nuevoUsuarioForm.controls;
  }

  cancelar(): void {
    void this.router.navigate(['./..'], {relativeTo: this.activedRoute});
  }
}

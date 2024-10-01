import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {PATRON_CORREO, PATRON_CURP, ROLES_USUARIOS_COMPLENTOS_PRINCIPAL, ROLES_USUARIOS_COMPLENTOS_SIN_PRINCIPAL} from "../../../../../../utils/constants";
import {NgClass} from "@angular/common";
import {MessageService} from "primeng/api";
import { TipoDropdown } from '../../../../../../core/models/tipo-dropdown.interface';

@Component({
  selector: 'app-dialogo-registro-persona-externo',
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    AvatarModule,
    NgClass
  ],
  templateUrl: './dialogo-registro-persona-externo.component.html',
  styleUrl: './dialogo-registro-persona-externo.component.scss'
})
export class DialogoRegistroPersonaExternoComponent {
  agregarPersonalForm!: FormGroup;
  tiposRoles: TipoDropdown[] = [];
  rows: number;
  perfil: number = 2;
  constructor(public ref: DynamicDialogRef,
              private formBuilder: FormBuilder,
              public config: DynamicDialogConfig,
              private messageService: MessageService) {
    
    this.rows = this.config.data.rowsPrincipal
    
   
    if( this.rows < 2 )
      {this.tiposRoles.push(...ROLES_USUARIOS_COMPLENTOS_PRINCIPAL);}
    else 
     { this.perfil=3; this.tiposRoles.push(...ROLES_USUARIOS_COMPLENTOS_SIN_PRINCIPAL); }
      this.agregarPersonalForm = this.crearFormPersonaAutorizada(this.perfil);
  }

  crearPersonaAutorizada(): PersonalAutorizado {
    return {
      idPerfil: this.agregarPersonalForm.get('tipoPerfil')?.value, 
      descCargo: this.agregarPersonalForm.get('cargo')?.value,
      correo: this.agregarPersonalForm.get('correo')?.value,
      curp: this.agregarPersonalForm.get('curp')?.value,
      materno: this.agregarPersonalForm.get('apellidoMaterno')?.value,
      nombre: this.agregarPersonalForm.get('nombre')?.value,
      paterno: this.agregarPersonalForm.get('apellidoPaterno')?.value,
      principal: 0,
      cargo: 0,
    }
  }

  crearFormPersonaAutorizada(perfilId: number): FormGroup {
    return this.formBuilder.group({
      tipoPerfil: [perfilId, [Validators.required]],
      curp: ['', [Validators.required, Validators.maxLength(18),
          Validators.minLength(18), Validators.pattern(PATRON_CURP)]],
      nombre: ['', [Validators.required, Validators.maxLength(20)]],
      apellidoPaterno: ['', [Validators.required, Validators.maxLength(20)]],
      apellidoMaterno: ['', [Validators.required, Validators.maxLength(20)]],
      correo: ['', [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern(PATRON_CORREO)]],
      cargo: ['', [Validators.required, Validators.maxLength(30)]]
    });
  }


  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: '¡Exito!',
      detail: mensaje,
    });
  }

  guardarPersonaAutorizada(): void {
    const persona: PersonalAutorizado = this.crearPersonaAutorizada();
    this.mostrarAlertaDatosValidos('El personal autorizado se agregó correctamente.');
    this.ref.close({persona});
  }

  get f() {
    return this.agregarPersonalForm.controls;
  }
}

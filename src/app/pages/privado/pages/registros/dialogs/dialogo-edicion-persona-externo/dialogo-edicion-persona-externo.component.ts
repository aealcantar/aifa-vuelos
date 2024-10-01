import {Component} from '@angular/core';
import {NgClass} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ButtonDirective} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {MessageService} from "primeng/api";
import {AvatarModule} from "primeng/avatar";
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {PATRON_CORREO, PATRON_CURP, ROLES_USUARIOS_COMPLENTOS_PRINCIPAL, ROLES_USUARIOS_COMPLENTOS_SIN_PRINCIPAL} from "../../../../../../utils/constants";
import {TipoDropdown} from '../../../../../../core/models/tipo-dropdown.interface';
@Component({
  selector: 'app-dialogo-edicion-persona-externo',
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    AvatarModule,
    NgClass
  ],
  templateUrl: './dialogo-edicion-persona-externo.component.html',
  styleUrl: './dialogo-edicion-persona-externo.component.scss'
})
export class DialogoEdicionPersonaExternoComponent {
  tiposRoles: TipoDropdown[] = [];
  editarPersonalForm!: FormGroup;
  personal: PersonalAutorizado;
  rows: number;
  constructor(public ref: DynamicDialogRef,
              private formBuilder: FormBuilder,
              public config: DynamicDialogConfig,
              private messageService: MessageService) {

    this.personal = this.config.data.personal;
    this.rows = this.config.data.rowsPrincipal
    this.editarPersonalForm = this.crearFormPersonaAutorizada(this.personal);
    
    if( this.rows < 2 || this.personal.idPerfil === 2)
        this.tiposRoles.push(...ROLES_USUARIOS_COMPLENTOS_PRINCIPAL);
    else 
        this.tiposRoles.push(...ROLES_USUARIOS_COMPLENTOS_SIN_PRINCIPAL);  
  }

  crearPersonaAutorizada(): PersonalAutorizado {
    return {
      idPerfil: this.editarPersonalForm.get('tipoPerfil')?.value,    
      descCargo: this.editarPersonalForm.get('cargo')?.value,
      correo: this.editarPersonalForm.get('correo')?.value,
      curp: this.editarPersonalForm.get('curp')?.value,
      materno: this.editarPersonalForm.get('apellidoMaterno')?.value,
      nombre: this.editarPersonalForm.get('nombre')?.value,
      paterno: this.editarPersonalForm.get('apellidoPaterno')?.value,
      principal: this.personal.principal,
      cargo: 0,
      id: this.personal.id
    }
  }

  crearFormPersonaAutorizada(personal: PersonalAutorizado): FormGroup {
    return this.formBuilder.group({
      tipoPerfil: [Number(personal.idPerfil), [Validators.required]],
      curp: [personal.curp, [Validators.required, Validators.maxLength(18),
        Validators.minLength(18), Validators.pattern(PATRON_CURP)]],
      nombre: [personal.nombre, [Validators.required, Validators.maxLength(20)]],
      apellidoPaterno: [personal.paterno, [Validators.required, Validators.maxLength(20)]],
      apellidoMaterno: [personal.materno, [Validators.required, Validators.maxLength(20)]],
      correo: [personal.correo, [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern(PATRON_CORREO)]],
      cargo: [personal.descCargo, [Validators.required, Validators.maxLength(30)]]
    });
  }

  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: '¡Exito!',
      detail: mensaje,
    });
  }

  guardarEdicionPersonaAutorizada(): void {
    const persona: PersonalAutorizado = this.crearPersonaAutorizada();
    this.mostrarAlertaDatosValidos('Los datos se actualizaron correctamente.');
    this.ref.close({persona});
  }

  get f() {
    return this.editarPersonalForm.controls;
  }
}

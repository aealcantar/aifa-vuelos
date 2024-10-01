import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {PATRON_CORREO, PATRON_CURP} from "../../../../../../utils/constants";
import {MessageService} from "primeng/api";
import {AvatarModule} from "primeng/avatar";
import {NgClass} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialogo-edicion-persona-autorizada',
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    AvatarModule,
    NgClass
  ],
  templateUrl: './dialogo-edicion-persona-autorizada.component.html',
  styleUrl: './dialogo-edicion-persona-autorizada.component.scss'
})
export class DialogoEdicionPersonaAutorizadaComponent {
  editarPersonalForm!: FormGroup;
  curps: string[] = [];
  tipoRegistro: string = ''

  constructor(public ref: DynamicDialogRef,
              private formBuilder: FormBuilder,
              public config: DynamicDialogConfig,
              private router: Router,
              private messageService: MessageService) {
    const personal: PersonalAutorizado = this.config.data.personal;
    this.curps = [...this.config.data.curps];
    this.editarPersonalForm = this.crearFormPersonaAutorizada(personal);
    this.obtenerTipoRegistro();
  }

  obtenerTipoRegistro(): void {
    const currentRoute: string = this.router.url;
    if (currentRoute === '/privado/registros/nuevo-contrato') {
      this.tipoRegistro = 'contrato';
    }
    if (currentRoute === '/privado/registros/nuevo-acuerdo') {
      this.tipoRegistro = 'acuerdo';
    }
  }

  crearPersonaAutorizada(): PersonalAutorizado {
    return {
      cargo: this.editarPersonalForm.get('cargo')?.value,
      correo: this.editarPersonalForm.get('correo')?.value,
      curp: this.editarPersonalForm.get('curp')?.value,
      materno: this.editarPersonalForm.get('apellidoMaterno')?.value,
      nombre: this.editarPersonalForm.get('nombre')?.value,
      paterno: this.editarPersonalForm.get('apellidoPaterno')?.value,
      principal: 1
    }
  }

  crearFormPersonaAutorizada(personal: PersonalAutorizado): FormGroup {
    return this.formBuilder.group({
      curp: [personal.curp, [Validators.required, Validators.maxLength(18),
        Validators.minLength(18), Validators.pattern(PATRON_CURP)]],
      nombre: [personal.nombre, [Validators.required, Validators.maxLength(20)]],
      apellidoPaterno: [personal.paterno, [Validators.required, Validators.maxLength(20)]],
      apellidoMaterno: [personal.materno, [Validators.required, Validators.maxLength(20)]],
      correo: [personal.correo, [Validators.required, Validators.maxLength(50), Validators.email, Validators.pattern(PATRON_CORREO)]],
      cargo: [personal.cargo, [Validators.required, Validators.maxLength(30)]]
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
    if (this.curps.includes(persona.curp)) {
      this.mostrarAlertaDatosInvalidos(`No se puede editar el personal, el CURP ya se encuentra registrado en el ${this.tipoRegistro}`);
      return;
    }
    this.mostrarAlertaDatosValidos('Los datos se actualizaron correctamente.');
    this.ref.close({persona});
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
  }

  get f() {
    return this.editarPersonalForm.controls;
  }
}


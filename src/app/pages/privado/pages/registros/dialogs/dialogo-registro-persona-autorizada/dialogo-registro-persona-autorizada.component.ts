import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {InputTextModule} from "primeng/inputtext";
import {PaginatorModule} from "primeng/paginator";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AvatarModule} from "primeng/avatar";
import {PATRON_CORREO, PATRON_CURP} from "../../../../../../utils/constants";
import {NgClass} from "@angular/common";
import {MessageService} from "primeng/api";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialogo-registro-persona-autorizada',
  standalone: true,
  imports: [
    ButtonDirective,
    InputTextModule,
    PaginatorModule,
    ReactiveFormsModule,
    AvatarModule,
    NgClass
  ],
  templateUrl: './dialogo-registro-persona-autorizada.component.html',
  styleUrl: './dialogo-registro-persona-autorizada.component.scss'
})
export class DialogoRegistroPersonaAutorizadaComponent {
  agregarPersonalForm!: FormGroup;
  curps: string[] = [];
  tipoRegistro: string = ''

  constructor(public ref: DynamicDialogRef,
              private formBuilder: FormBuilder,
              public config: DynamicDialogConfig,
              private router: Router,
              private messageService: MessageService) {
    this.curps = [...this.config.data];
    this.agregarPersonalForm = this.crearFormPersonaAutorizada();
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
      cargo: this.agregarPersonalForm.get('cargo')?.value,
      correo: this.agregarPersonalForm.get('correo')?.value,
      curp: this.agregarPersonalForm.get('curp')?.value,
      materno: this.agregarPersonalForm.get('apellidoMaterno')?.value,
      nombre: this.agregarPersonalForm.get('nombre')?.value,
      paterno: this.agregarPersonalForm.get('apellidoPaterno')?.value,
      principal: 1
    }
  }

  crearFormPersonaAutorizada(): FormGroup {
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


  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({severity: 'success', summary: '¡Exito!', detail: mensaje});
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
  }

  guardarPersonaAutorizada(): void {
    const persona: PersonalAutorizado = this.crearPersonaAutorizada();
    if (this.curps.includes(persona.curp)) {
      this.mostrarAlertaDatosInvalidos(`No se puede agregar el personal, el CURP ya se encuentra registrado en el ${this.tipoRegistro}`);
      return;
    }
    this.mostrarAlertaDatosValidos('El personal autorizado se agregó correctamente.');
    this.ref.close({persona});
  }

  get f() {
    return this.agregarPersonalForm.controls;
  }
}

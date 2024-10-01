import { Component } from '@angular/core';
import {AvatarModule} from "primeng/avatar";
import {ButtonDirective} from "primeng/button";
import {InputTextareaModule} from "primeng/inputtextarea";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-dialogo-rechazar-validacion',
  standalone: true,
  imports: [
    AvatarModule,
    ButtonDirective,
    InputTextareaModule,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './dialog-rechazar-validacion.component.html',
  styleUrl: './dialog-rechazar-validacion.component.scss'
})
export class DialogRechazarValidacionComponent {
  rechazarValidacionForm!: FormGroup;
  titulo: string = '';

  constructor(private formBuilder: FormBuilder,
              public config: DynamicDialogConfig,
              public ref: DynamicDialogRef) {
    this.titulo = this.config.data;

    this.rechazarValidacionForm = this.crearFormValidacion();
  }

  crearFormValidacion(): FormGroup {
    return this.formBuilder.group({
      'motivoRechazo': ['', Validators.required],
    })
  }

  guardar(): void {
    const motivo = this.rechazarValidacionForm.get('motivoRechazo')?.value;
    this.ref.close(motivo);
  }

  get f() {
    return this.rechazarValidacionForm.controls;
  }
}

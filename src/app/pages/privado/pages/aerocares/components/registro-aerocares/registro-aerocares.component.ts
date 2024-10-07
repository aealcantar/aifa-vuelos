import { Component, OnInit } from '@angular/core';
import { TituloPrincipalComponent } from '../../../../../../shared/titulo-principal/titulo-principal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-registro-aerocares',
  standalone: true,
  imports: [
    PanelModule,
    ReactiveFormsModule,
    RadioButtonModule,
    InputTextModule,
    TituloPrincipalComponent,
    CardModule,
    CalendarModule,
    DropdownModule,
    AngularSignaturePadModule,
    ButtonModule,
    RouterLink,
  ],
  templateUrl: './registro-aerocares.component.html',
  styleUrl: './registro-aerocares.component.scss',
})
export class RegistroAerocaresComponent implements OnInit {
  tiposVuelos: { label: string; value: number }[] = [
    {
      label: 'Vuelo Nacional',
      value: 1,
    },
    {
      label: 'Vuelo Internacional',
      value: 2,
    },
    {
      label: 'Mixto',
      value: 3,
    },
  ];

  tiposVuelosRadios: { label: string; value: number }[] = [
    {
      label: 'Regular',
      value: 1,
    },
    {
      label: 'Cargo',
      value: 2,
    },
    {
      label: 'Charter',
      value: 3,
    },
    {
      label: 'Privado',
      value: 4,
    },
    {
      label: 'Consultar',
      value: 5,
    },
    {
      label: 'Ejecutivo',
      value: 6,
    },
  ];

  lineaAereas: { label: string; value: number }[] = [
    {
      label: 'Aeroméxico',
      value: 1,
    },
    {
      label: 'Volaris',
      value: 2,
    },
    {
      label: 'Interjet',
      value: 3,
    },
  ];

  empleados: { label: string; value: number }[] = [
    {
      label: 'Empleado 1',
      value: 1,
    },
    {
      label: 'Empleado 2',
      value: 2,
    },
    {
      label: 'Empleado 3',
      value: 3,
    },
  ];

  numerosVuelos: { label: string; value: number }[] = [
    {
      label: 'No Vuelo 1',
      value: 1,
    },
    {
      label: 'No Vuelo 2',
      value: 2,
    },
    {
      label: 'No Vuelo 3',
      value: 3,
    },
  ];

  aerocares: { label: string; value: number }[] = [
    {
      label: 'Aerocar 1',
      value: 1,
    },
    {
      label: 'Aerocar 2',
      value: 2,
    },
    {
      label: 'Aerocar 3',
      value: 3,
    },
  ];

  bases: { label: string; value: number }[] = [
    {
      label: 'Base 1',
      value: 1,
    },
    {
      label: 'Base 2',
      value: 2,
    },
    {
      label: 'Base 3',
      value: 3,
    },
  ];

  posiciones: { label: string; value: number }[] = [
    {
      label: 'Posición 1',
      value: 1,
    },
    {
      label: 'Posición 2',
      value: 2,
    },
    {
      label: 'Posición 3',
      value: 3,
    },
  ];

  matriculas: { label: string; value: number }[] = [
    {
      label: 'Matricula 1',
      value: 1,
    },
    {
      label: 'Matricula 2',
      value: 2,
    },
    {
      label: 'Matricula 3',
      value: 3,
    },
  ];

  conformidadesAerolineasNombres: { label: string; value: number }[] = [
    {
      label: 'Nombre 1',
      value: 1,
    },
    {
      label: 'Nombre 2',
      value: 2,
    },
    {
      label: 'Nombre 3',
      value: 3,
    },
  ];

  coordinatoresAerocares: { label: string; value: number }[] = [
    {
      label: 'Nombre 1',
      value: 1,
    },
    {
      label: 'Nombre 2',
      value: 2,
    },
    {
      label: 'Nombre 3',
      value: 3,
    },
  ];

  registroForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.registroForm = this.formBuilder.group({
      informacionVuelo: this.formBuilder.group({
        tipoVuelo: [{ value: 1, disabled: false }, [Validators.nullValidator]],
        numeroFolio: [{ value: null, disabled: false }, [Validators.nullValidator]],
      }),
      solicitud: this.formBuilder.group({
        fechaSalida: [{ value: null, disabled: false }, [Validators.nullValidator]],
        horaSolicitudAerolinea: [{ value: null, disabled: false }, [Validators.nullValidator]],
        lineaAerea: [{ value: null, disabled: false }, [Validators.nullValidator]],
        solicitadoPor: [{ value: null, disabled: false }, [Validators.nullValidator]],
      }),
      salidas: this.formBuilder.group({
        abordajePax: [{ value: null, disabled: false }, [Validators.nullValidator]],
        terminoServicio: [{ value: null, disabled: false }, [Validators.nullValidator]],
        codigoVuelo: [{ value: null, disabled: false }, [Validators.nullValidator]],
        numeroVuelo: [{ value: null, disabled: false }, [Validators.nullValidator]],
      }),
      operacion: this.formBuilder.group({
        aerocar: [{ value: null, disabled: false }, [Validators.nullValidator]],
        base: [{ value: null, disabled: false }, [Validators.nullValidator]],
        posicion: [{ value: null, disabled: false }, [Validators.nullValidator]],
      }),
      adicionales: this.formBuilder.group({
        horaEntrega: [{ value: null, disabled: false }, [Validators.nullValidator]],
        horaSalidaEdificio: [{ value: null, disabled: false }, [Validators.nullValidator]],
        origen: [{ value: null, disabled: false }, [Validators.nullValidator]],
        matricua: [{ value: null, disabled: false }, [Validators.nullValidator]],
        tipoVuelo: [{ value: null, disabled: false }, [Validators.nullValidator]],
        observacionesAerolinea: [{ value: null, disabled: false }, [Validators.nullValidator]],
        conformidadAerolineaNombre: [{ value: null, disabled: false }, [Validators.nullValidator]],
        conformidadAerolineaFirma: [{ value: null, disabled: false }, [Validators.nullValidator]],
        observacionesOperador: [{ value: null, disabled: false }, [Validators.nullValidator]],
        coordinadorAerocare: [{ value: null, disabled: false }, [Validators.nullValidator]],
        coordinadorAerocareFirma: [{ value: null, disabled: false }, [Validators.nullValidator]],
      }),
    });
  }
}

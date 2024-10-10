import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TituloPrincipalComponent } from '../../../../../../shared/titulo-principal/titulo-principal.component';
import { CardModule } from 'primeng/card';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AngularSignaturePadModule } from '@almothafar/angular-signature-pad';
import { ButtonModule } from 'primeng/button';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
@Component({
  selector: 'app-registro-aeropasillos',
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
  templateUrl: './registro-aeropasillos.component.html',
  styleUrl: './registro-aeropasillos.component.scss',
})
export class RegistroAeropasillosComponent implements OnInit {
  fechaActual: Date = new Date();
  registroForm!: FormGroup;
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

  constructor(private formBuilder: FormBuilder, private destroyRef: DestroyRef) {}
  ngOnInit(): void {
    this.inicializarFormulario();
  }

  inicializarFormulario(): void {
    this.registroForm = this.formBuilder.group({
      informacionVuelo: this.formBuilder.group({
        tipoVuelo: [{ value: 1, disabled: false }, Validators.nullValidator],
        numeroFolio: [{ value: null, disabled: false }, Validators.nullValidator],
        fechaLlegada: [{ value: null, disabled: false }, Validators.nullValidator],
        codigo: [{ value: null, disabled: false }, Validators.nullValidator],
        lineaAerea: [{ value: null, disabled: false }, Validators.nullValidator],
        matricula: [{ value: null, disabled: false }, Validators.nullValidator],
        aeronave: [{ value: null, disabled: false }, Validators.nullValidator],
        posicion: [{ value: null, disabled: false }, Validators.nullValidator],
        fechaSalida: [{ value: null, disabled: false }, Validators.nullValidator],
        esPernocta: [{ value: true, disabled: false }, Validators.nullValidator],
      }),
      llegada: this.formBuilder.group({
        numeroVuelo: [{ value: null, disabled: false }, Validators.nullValidator],
        origen: [{ value: null, disabled: false }, Validators.nullValidator],
        pasajeros: [{ value: null, disabled: false }, Validators.nullValidator],
        horaCalzos: [{ value: null, disabled: false }, Validators.nullValidator],
        horaAcople: [{ value: null, disabled: false }, Validators.nullValidator],
        numeroEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firmaAcople: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      salida: this.formBuilder.group({
        numeroVuelo: [{ value: null, disabled: false }, Validators.nullValidator],
        destino: [{ value: null, disabled: false }, Validators.nullValidator],
        pasajeros: [{ value: null, disabled: false }, Validators.nullValidator],
        horaDesacople: [{ value: null, disabled: false }, Validators.nullValidator],
        horaSalida: [{ value: null, disabled: false }, Validators.nullValidator],
        numeroEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firmaAcople: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      servicioGpu: this.formBuilder.group({
        horaInicio: [{ value: null, disabled: false }, Validators.nullValidator],
        horaTermino: [{ value: null, disabled: false }, Validators.nullValidator],
        tiempoTotal: [{ value: null, disabled: false }, Validators.nullValidator],
        mecanico: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      servicioPca: this.formBuilder.group({
        horaInicio: [{ value: null, disabled: false }, Validators.nullValidator],
        horaTermino: [{ value: null, disabled: false }, Validators.nullValidator],
        tiempoTotal: [{ value: null, disabled: false }, Validators.nullValidator],
        mecanico: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      vgds: this.formBuilder.group({
        vgds: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firmaRepresentanteAerolinea: [{ value: null, disabled: false }, Validators.nullValidator],
        observaciones: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      tiempoTotal: this.formBuilder.group({
        tiempoTotalAcople: [{ value: null, disabled: false }, Validators.nullValidator],
        posicion: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      quienRecibe: this.formBuilder.group({
        numeroEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firma: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      // tiempoTotalPernocta: this.formBuilder.group({
      //   tiempoTotalAcople: [{ value: null, disabled: false }, Validators.nullValidator],
      //   posicion: [{ value: null, disabled: false }, Validators.nullValidator],
      //   esPernocta: [{ value: true, disabled: false }, Validators.nullValidator],
      // }),
      llegadaPernocta: this.formBuilder.group({
        fechaLlegada: [{ value: null, disabled: false }, Validators.nullValidator],
        horaCalzos: [{ value: null, disabled: false }, Validators.nullValidator],
        horaAcople: [{ value: null, disabled: false }, Validators.nullValidator],
        numeroEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firmaAcople: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      salidaPernocta: this.formBuilder.group({
        fechaSalida: [{ value: null, disabled: false }, Validators.nullValidator],
        horaDesacople: [{ value: null, disabled: false }, Validators.nullValidator],
        horaSalida: [{ value: null, disabled: false }, Validators.nullValidator],
        numeroEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firmaAcople: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      servicioGpuPernocta: this.formBuilder.group({
        horaInicio: [{ value: null, disabled: false }, Validators.nullValidator],
        horaTermino: [{ value: null, disabled: false }, Validators.nullValidator],
        tiempoTotal: [{ value: null, disabled: false }, Validators.nullValidator],
        mecanico: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      servicioPcaPernocta: this.formBuilder.group({
        horaInicio: [{ value: null, disabled: false }, Validators.nullValidator],
        horaTermino: [{ value: null, disabled: false }, Validators.nullValidator],
        tiempoTotal: [{ value: null, disabled: false }, Validators.nullValidator],
        mecanico: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
      vgdsPernocta: this.formBuilder.group({
        vgds: [{ value: null, disabled: false }, Validators.nullValidator],
        nombreEmpleado: [{ value: null, disabled: false }, Validators.nullValidator],
        firmaRepresentanteAerolinea: [{ value: null, disabled: false }, Validators.nullValidator],
        observaciones: [{ value: null, disabled: false }, Validators.nullValidator],
      }),
    });
    this.escucharCambiosEsPernocta();
  }

  escucharCambiosEsPernocta(): void {
    this.informacionVueloForm['esPernocta'].valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (this.esValorFalso(value)) {
        (this.registroForm.get('llegadaPernocta') as FormGroup).reset();
        (this.registroForm.get('salidaPernocta') as FormGroup).reset();
        (this.registroForm.get('servicioGpuPernocta') as FormGroup).reset();
        (this.registroForm.get('servicioPcaPernocta') as FormGroup).reset();
        (this.registroForm.get('vgdsPernocta') as FormGroup).reset();
      }
    });
  }

  calcularTiempoTotal(): void {
    const horaInicio: Date = this.servicioGpuForm['horaInicio'].value;
    const horaTermino: Date = this.servicioGpuForm['horaTermino'].value;

    // this.servicioGpuForm['tiempoTotal'].setValue(new Date(tiempoTotal));
  }

  esValorFalso(valor: any): boolean {
    return !valor;
  }

  get informacionVueloForm(): {
    [key: string]: AbstractControl<any>;
  } {
    return (this.registroForm.get('informacionVuelo') as FormGroup).controls;
  }

  get llegadaForm(): {
    [key: string]: AbstractControl<any>;
  } {
    return (this.registroForm.get('llegada') as FormGroup).controls;
  }

  get servicioGpuForm(): {
    [key: string]: AbstractControl<any>;
  } {
    return (this.registroForm.get('servicioGpu') as FormGroup).controls;
  }
}

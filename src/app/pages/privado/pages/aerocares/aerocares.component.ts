import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { PaginatorModule } from 'primeng/paginator';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { TituloPrincipalComponent } from '../../../../shared/titulo-principal/titulo-principal.component';
import { DIEZ_ELEMENTOS_POR_PAGINA } from '../../../../utils/constants';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-aerocares',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    ReactiveFormsModule,
    PanelModule,
    DropdownModule,
    RadioButtonModule,
    CalendarModule,
    InputTextModule,
    ButtonModule,
    TableModule,
    PaginatorModule,
    RouterLink,
  ],
  templateUrl: './aerocares.component.html',
  styleUrl: './aerocares.component.scss',
})
export class AerocaresComponent implements OnInit {
  busquedaForm!: FormGroup;
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

  registros: any[] = [
    {
      tipoVuelo: 'Vuelo Nacional',
      numeroFolio: '123456',
      fechaSalida: '2021-10-01',
      horaSolicitudAerolinea: '15:00',
      lineaAerea: 'Aeroméxico',
    },
    {
      tipoVuelo: 'Vuelo Nacional',
      numeroFolio: '123456',
      fechaSalida: '2021-10-01',
      horaSolicitudAerolinea: '15:00',
      lineaAerea: 'Aeroméxico',
    },
    {
      tipoVuelo: 'Vuelo Nacional',
      numeroFolio: '123456',
      fechaSalida: '2021-10-01',
      horaSolicitudAerolinea: '16:00',
      lineaAerea: 'Volaris',
    },
  ];

  paginacionConFiltrado: boolean = false;

  cantElementosPorPagina: number = DIEZ_ELEMENTOS_POR_PAGINA;

  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;
  paginasTotales: number = 0;

  activeIndex: 0 | 1 = 0;

  constructor(private formBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.inicializarBusquedaForm();
  }

  inicializarBusquedaForm(): void {
    this.busquedaForm = this.formBuilder.group({
      tipoVuelo: [{ value: 1, disabled: false }, Validators.nullValidator],
      numeroFolio: [{ value: null, disabled: false }, Validators.nullValidator],
      fechaSalida: [{ value: null, disabled: false }, [Validators.nullValidator]],
      horaSolicitudAerolinea: [{ value: null, disabled: false }, [Validators.nullValidator]],
      lineaAerea: [{ value: null, disabled: false }, [Validators.nullValidator]],
    });
  }

  buscar() {
    console.log(this.busquedaForm.value);
  }

  seleccionarPaginacion(event?: TableLazyLoadEvent): void {
    // if (this.authService.validarUsuarioLogueado()) return;
    if (event) {
      this.numPaginaActual = Math.floor((event.first ?? 0) / (event.rows ?? 1)) + 1;
    }
    if (this.paginacionConFiltrado) {
      this.paginarConFiltros();
    } else {
      this.paginar();
    }
  }

  paginar(): void {
    // this.loaderService.activar();
    // const solicitud: RequestRegistro = this.crearSolicitud();
    // this.registrosService
    //   .paginarContratosInicial(
    //     this.numPaginaActual,
    //     this.cantElementosPorPagina,
    //     solicitud
    //   )
    //   .pipe(finalize(() => this.loaderService.desactivar()))
    //   .subscribe({
    //     next: (respuesta: RegistroResponse) =>
    //       this.procesarRespuestaPaginacion(respuesta),
    //     error: (error: HttpErrorResponse): void =>
    //       this.manejarMensajeError(error),
    //   });
  }

  paginarConFiltros(): void {
    // const solicitud: any = this.crearSolicitudPaginado();
    // this.loaderService.activar();
    // this.registrosService.paginarContratosFiltrado(this.numPaginaActual, this.cantElementosPorPagina, solicitud).pipe(
    //   finalize(() => this.loaderService.desactivar())
    // ).subscribe({
    //   next: (respuesta: RegistroResponse) => this.procesarRespuestaPaginacion(respuesta),
    //   error: (error: HttpErrorResponse): void => this.manejarMensajeError(error)
    // });
  }

  get cantInferiorPagina(): number {
    if (this.numPaginaActual <= 1) return 1;
    return (this.numPaginaActual - 1) * this.cantElementosPorPagina + 1;
  }

  get cantSuperiorPagina(): number {
    if (this.numPaginaActual <= 1) return 10;
    const valorSuperior: number = (this.numPaginaActual - 1) * this.cantElementosPorPagina + 10;
    return valorSuperior > this.totalElementos ? this.totalElementos : valorSuperior;
  }
}

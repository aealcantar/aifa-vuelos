import { Component, OnInit } from '@angular/core';
import { TituloPrincipalComponent } from '../../../../shared/titulo-principal/titulo-principal.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { DIEZ_ELEMENTOS_POR_PAGINA } from '../../../../utils/constants';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { TablaAccionesOverlayComponent } from '../../../../shared/tabla-acciones-overlay/components/tabla-acciones-overlay/tabla-acciones-overlay.component';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { TagModule } from 'primeng/tag';
@Component({
  selector: 'app-aeropasillos',
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
    TablaAccionesOverlayComponent,
    ButtonModule,
    TagModule,
  ],
  templateUrl: './aeropasillos.component.html',
  styleUrl: './aeropasillos.component.scss',
})
export class AeropasillosComponent implements OnInit {
  EDITAR: number = 0;
  ELIMINAR: number = 1;
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
      id: 1,
      tipoVuelo: 'Vuelo Nacional',
      numeroFolio: '123456',
      fechaLlegada: '2021-10-01',

      lineaAerea: 'Aeroméxico',
      matricula: 'X-1234',
      fechaSalida: '2021-10-01',
      esPernocta: true,
    },
    {
      id: 2,
      tipoVuelo: 'Vuelo Internacional',
      numeroFolio: '123456',
      fechaLlegada: '2021-10-01',
      lineaAerea: 'Volaris',
      matricula: 'X-1234',
      fechaSalida: '2021-10-01',
      esPernocta: false,
    },
    {
      id: 3,
      tipoVuelo: 'Mixto',
      numeroFolio: '123456',
      fechaLlegada: '2021-10-01',
      lineaAerea: 'Interjet',
      matricula: 'X-1234',
      fechaSalida: '2021-10-01',
      esPernocta: true,
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

  items: MenuItem[] | undefined = [];

  constructor(private formBuilder: FormBuilder, private router: Router, private activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.inicializarBusquedaForm();
    this.cargarOpcionesMenu();
  }

  cargarOpcionesMenu(): void {
    this.items = [
      {
        label: 'Editar',
        icon: 'pi pi-pencil',
        command: (): void => {
          console.log('Editar');
        },
      },
      {
        label: 'Eliminar',
        icon: 'pi pi-trash',
        command: (): void => {
          console.log('Eliminar');
        },
      },
    ];
  }

  inicializarBusquedaForm(): void {
    this.busquedaForm = this.formBuilder.group({
      tipoVuelo: [{ value: 1, disabled: false }, Validators.nullValidator],
      numeroFolio: [{ value: null, disabled: false }, Validators.nullValidator],
      fechaLlegada: [{ value: null, disabled: false }, Validators.nullValidator],

      lineaAerea: [{ value: null, disabled: false }, Validators.nullValidator],
      matricula: [{ value: null, disabled: false }, Validators.nullValidator],

      fechaSalida: [{ value: null, disabled: false }, Validators.nullValidator],
      esPernocta: [{ value: true, disabled: false }, Validators.nullValidator],
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

  obtenerAccionSeleccionada(idAccion: number, registro: any): void {
    switch (idAccion) {
      case this.EDITAR:
        this.router.navigate(['../registro-aeropasillos', registro.id], {
          relativeTo: this.activatedRoute,
        });
        break;
      case this.ELIMINAR:
        break;
      default:
        break;
    }
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

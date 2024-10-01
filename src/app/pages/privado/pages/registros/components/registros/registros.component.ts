import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {TabViewModule} from "primeng/tabview";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {CalendarModule} from "primeng/calendar";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {
  TablaAccionesOverlayComponent
} from "../../../../../../shared/tabla-acciones-overlay/components/tabla-acciones-overlay/tabla-acciones-overlay.component";
import {TipoDropdown} from "../../../../../../core/models/tipo-dropdown.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {AvatarModule} from "primeng/avatar";
import {finalize} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {LoaderService} from "../../../../../../shared/loader/services/loader.service";
import {DIEZ_ELEMENTOS_POR_PAGINA} from "../../../../../../utils/constants";
import {EmpresasService} from "../../services/empresas.service";
import {Registro, RegistroUsuario} from "../../models/registro.interface";
import {RegistroResponse} from "../../models/registro-response.interface";
import {MessageService} from "primeng/api";
import {DatePipe, UpperCasePipe} from "@angular/common";
import {RequestRegistro} from "../../models/request-registro.interface";
import {calcularDiferenciaFechas, mapearArregloTipoDropdown} from "../../../../../../utils/funciones";
import {
  TagEstatusContratoComponent
} from "../../../../../../components/tag-estatus-contrato/tag-estatus-contrato.component";
import {
  TagVigenciaContratoComponent
} from "../../../../../../components/tag-vigencia-contrato/tag-vigencia-contrato.component";
import {PaginatorModule} from "primeng/paginator";
import {TranslateModule} from "@ngx-translate/core";
import moment from "moment";

@Component({
  selector: 'app-registros',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    TabViewModule,
    ReactiveFormsModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    TableModule,
    TablaAccionesOverlayComponent,
    AvatarModule,
    UpperCasePipe,
    TagEstatusContratoComponent,
    TagVigenciaContratoComponent,
    PaginatorModule,
    DatePipe,
    TranslateModule
  ],
  providers: [EmpresasService],
  templateUrl: './registros.component.html',
  styleUrl: './registros.component.scss'
})
export class RegistrosComponent implements OnInit {
  readonly VALIDAR: number = 2;
  readonly VER_DETALLE: number = 3;

  readonly acciones: number[] = [3];
  readonly accionesEstatusValidacion: number[] = [2, 3];

  busquedaForm!: FormGroup;

  tiposProveedor: TipoDropdown[] = [];
  estatus: TipoDropdown[] = [];

  paginacionConFiltrado: boolean = false;

  cantElementosPorPagina: number = DIEZ_ELEMENTOS_POR_PAGINA;

  first: number = 0;
  rows: number = 10;

  numPaginaActual: number = 0;
  totalElementos: number = 0;
  paginasTotales: number = 0;


  registros: WritableSignal<Registro[]> = signal([])

  activeIndex: 0 | 1 = 0;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private loaderService: LoaderService,
              private registrosService: EmpresasService,
              private messageService: MessageService,
  ) {
    this.busquedaForm = this.crearFormularioAdmin();
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      const [organismos, estatus] = respuesta;
      this.tiposProveedor = mapearArregloTipoDropdown(organismos.data, 'referencia', 'idTipoProveedor');
      this.estatus = mapearArregloTipoDropdown(estatus, 'referencia', 'idEstatus');
    });
  }

  ngOnInit(): void {
    this.obtenerCatalogos();
  }

  crearFormularioAdmin(): FormGroup {
    return this.formBuilder.group({
      numeroContrato: [null],
      razonSocial: [null],
      rfc: [null],
      inicioVigencia: [null],
      tipoProveedor: [null],
      estatus: [null],
    });
  }

  obtenerAccionSeleccionada(idAccion: number, registro: Registro): void {
    switch (idAccion) {
      case this.VALIDAR:
        this.validarContrato(registro.idContrato);
        break;
      case this.VER_DETALLE:
        this.verDetalleContrato(registro.idContrato);
        break;
      default:
        break;
    }
  }

  validarContrato(id: number): void {
    void this.router.navigate(['./validar-contrato', id], {relativeTo: this.activatedRoute});
  }

  verDetalleContrato(id: number): void {
    void this.router.navigate(['./detalle-registro', id], {relativeTo: this.activatedRoute});
  }

  navegarNuevoContrato(): void {
    void this.router.navigate(['./nuevo-contrato'], {relativeTo: this.activatedRoute});
  }

  navegarNuevoAcuerdo(): void {
    void this.router.navigate(['./nuevo-acuerdo'], {relativeTo: this.activatedRoute});
  }

  paginar(): void {
    this.loaderService.activar();
    const solicitud: RequestRegistro = this.crearSolicitud()
    this.registrosService.paginarContratosInicial(this.numPaginaActual, this.cantElementosPorPagina, solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (respuesta: RegistroResponse) => this.procesarRespuestaPaginacion(respuesta),
      error: (error: HttpErrorResponse): void => this.manejarMensajeError(error)
    });
  }

  procesarRespuestaPaginacion(respuesta: RegistroResponse): void {
    this.registros.update((value: Registro[]) => respuesta.response.data);
    this.totalElementos = respuesta.response.total;
    this.paginasTotales = respuesta.response.last_page;
    if (!respuesta.response || respuesta.response.data.length === 0) {
      this.registros.update((value: Registro[]) => []);
      this.mostrarAlertaDatosInvalidos('No se encontró información, favor de validar la información.');
    }
  }

  private manejarMensajeError(error: HttpErrorResponse): void {
    console.error(error);
    this.registros.update((value: Registro[]) => []);
    this.mostrarAlertaDatosInvalidos('No se encontró información, favor de validar la información.');
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
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

  paginarConFiltros(): void {
    const solicitud: any = this.crearSolicitudPaginado();
    this.loaderService.activar();
    this.registrosService.paginarContratosFiltrado(this.numPaginaActual, this.cantElementosPorPagina, solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (respuesta: RegistroResponse) => this.procesarRespuestaPaginacion(respuesta),
      error: (error: HttpErrorResponse): void => this.manejarMensajeError(error)
    });
  }

  crearSolicitud(): RequestRegistro {
    return {
      fechaVigencia: null,
      idTipoContrato: this.activeIndex === 0 ? 1 : 0,
      idEstatus: null,
      idTipoProveedor: null,
      razonSocial: null,
      refContratoAcuerdo: null,
      rfc: null,
    }
  }

  crearSolicitudPaginado(): RequestRegistro {
    let fechaVigencia = this.busquedaForm.get('inicioVigencia')?.value;
    if (fechaVigencia) {
      fechaVigencia = moment(fechaVigencia).format('YYYY-MM-DD');
    }
    return {
      fechaVigencia,
      idTipoContrato: this.activeIndex === 0 ? 1 : 0,
      idEstatus: this.busquedaForm.get('estatus')?.value,
      idTipoProveedor: this.busquedaForm.get('tipoProveedor')?.value,
      razonSocial: this.busquedaForm.get('razonSocial')?.value,
      refContratoAcuerdo: this.busquedaForm.get('numeroContrato')?.value,
      rfc: this.busquedaForm.get('rfc')?.value
    }
  }

  buscar(): void {
    this.numPaginaActual = 0;
    this.paginacionConFiltrado = true;
    this.paginarConFiltros();
  }

  limpiar(): void {
    this.paginacionConFiltrado = false;
    this.busquedaForm.reset();
    this.numPaginaActual = 0;
    this.paginar();
  }

  obtenerPersonaPrincipal(registros: RegistroUsuario[]): string {
    const personalFiltrado: RegistroUsuario[] = registros.filter((registro: RegistroUsuario) => registro.principal);
    const nombresAutorizaods: string[] = personalFiltrado.map((personal: RegistroUsuario) =>
      `${personal.nombre} ${personal.apellidoPaterno} ${personal.apellidoMaterno}`);
    return nombresAutorizaods.join(', ');
  }

  get cantInferiorPagina(): number {
    if (this.numPaginaActual <= 1) return 1;
    return (this.numPaginaActual - 1) * this.cantElementosPorPagina + 1;
  }

  get cantSuperiorPagina(): number {
    if (this.numPaginaActual <= 1) return 10;
    const valorSuperior: number = (this.numPaginaActual - 1) * this.cantElementosPorPagina + 10;
    return (valorSuperior > this.totalElementos) ? this.totalElementos : valorSuperior;
  }

  protected readonly calcularDiferenciaFechas = calcularDiferenciaFechas;
}

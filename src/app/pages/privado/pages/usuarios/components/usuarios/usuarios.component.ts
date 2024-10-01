import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {AvatarModule} from "primeng/avatar";
import {ButtonDirective} from "primeng/button";
import {CalendarModule} from "primeng/calendar";
import {DropdownModule} from "primeng/dropdown";
import {InputTextModule} from "primeng/inputtext";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TipoDropdown} from "../../../../../../core/models/tipo-dropdown.interface";
import {TabViewModule} from "primeng/tabview";
import {PanelModule} from "primeng/panel";
import {ActivatedRoute, Router} from "@angular/router";
import {AutenticacionService} from "../../../../../../core/services/autenticacion.service";
import {TableLazyLoadEvent, TableModule} from "primeng/table";
import {UsuariosService} from "../../services/usuarios.service";
import {Usuario} from "../../models/usuario.interface";
import {TagModule} from "primeng/tag";
import {DIEZ_ELEMENTOS_POR_PAGINA, ESTATUS_USUARIOS, ROLES_USUARIOS} from "../../../../../../utils/constants";
import {ResponseUsuarios} from "../../models/response-usuarios.interface";
import {HttpErrorResponse} from "@angular/common/http";
import {MessageService} from "primeng/api";
import {LoaderService} from "../../../../../../shared/loader/services/loader.service";
import {finalize} from "rxjs";
import {BusquedaUsuario} from "../../models/busqueda-usuario.interface";
import {UpperCasePipe} from "@angular/common";
import {mapearArregloTipoDropdown} from "../../../../../../utils/funciones";
import {PaginatorModule} from "primeng/paginator";

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    AvatarModule,
    ButtonDirective,
    CalendarModule,
    DropdownModule,
    InputTextModule,
    ReactiveFormsModule,
    TabViewModule,
    PanelModule,
    TableModule,
    TagModule,
    UpperCasePipe,
    PaginatorModule
  ],
  providers: [UsuariosService],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  busquedaUsuariosForm!: FormGroup;
  roles: TipoDropdown[] = [...ROLES_USUARIOS];
  estatus: TipoDropdown[] = [...ESTATUS_USUARIOS];
  idRol!: number | undefined;

  paginacionConFiltrado: boolean = false;
  numPaginaActual: number = 0;
  cantElementosPorPagina: number = DIEZ_ELEMENTOS_POR_PAGINA;
  totalElementos: number = 0;
  paginasTotales: number = 0;

  tiposProveedor: TipoDropdown[] = [];

  usuarios: WritableSignal<Usuario[]> = signal([]);

  first: number = 0;
  rows: number = 10;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private authService: AutenticacionService,
              private usuariosService: UsuariosService,
              private messageService: MessageService,
              private loaderService: LoaderService) {
    this.idRol = this.authService.usuarioSesion?.idRol
    this.busquedaUsuariosForm = this.crearBusquedaForm();
  }

  ngOnInit(): void {
    this.obtenerCatalogos();
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      this.tiposProveedor = mapearArregloTipoDropdown(respuesta.data, 'referencia', 'idTipoProveedor');
    });
  }


  crearBusquedaForm(): FormGroup {
    return this.formBuilder.group({
      rol: [null],
      cargo: [null],
      nombre: [null],
      apellidoPaterno: [null],
      apellidoMaterno: [null],
      correo: [null],
      curp: [null],
      estatus: [null],
      tipoUsuario: [null],
      razonSocial: [null],
      tipoProveedor: [null],
      numeroDocumento: [null],
    });
  }

  limpiarCampos(): void {
    this.busquedaUsuariosForm.get('correo')?.setValue(null)
    this.busquedaUsuariosForm.get('cargo')?.setValue(null)
    this.busquedaUsuariosForm.get('estatus')?.setValue(null)
    this.busquedaUsuariosForm.get('tipoUsuario')?.setValue(null)
    this.busquedaUsuariosForm.get('razonSocial')?.setValue(null)
    this.busquedaUsuariosForm.get('tipoProveedor')?.setValue(null)
    this.busquedaUsuariosForm.get('numeroDocumento')?.setValue(null)
  }

  navegarNuevoUsuario(): void {
    void this.router.navigate(['./nuevo-usuario'], {relativeTo: this.activatedRoute});
  }

  paginar(): void {
    this.loaderService.activar();
    this.usuariosService.paginarUsuarios(this.numPaginaActual, this.cantElementosPorPagina).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (respuesta) => this.procesarRespuestaPaginacion(respuesta),
      error: (error: HttpErrorResponse): void => this.manejarMensajeError(error)
    });
  }

  procesarRespuestaPaginacion(respuesta: ResponseUsuarios): void {
    this.usuarios.update(value => respuesta.data);
    this.totalElementos = respuesta.total;
    this.paginasTotales = respuesta.last_page;
    if (respuesta.data.length === 0) {
      this.mostrarAlertaDatosInvalidos('No se encontró información, favor de validar la información.');
    }
  }

  private manejarMensajeError(error: HttpErrorResponse): void {
    console.error(error);
    this.usuarios.update(value => []);
    this.mostrarAlertaDatosInvalidos('No se encontró información, favor de validar la información.');
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({
      severity: 'error',
      summary: '¡Error!',
      detail: mensaje,
    });
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
    const solicitud: BusquedaUsuario = this.crearSolicitudPaginado();
    this.loaderService.activar();
    this.usuariosService.paginarUsuariosFiltrado(this.numPaginaActual, this.cantElementosPorPagina, solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (respuesta) => this.procesarRespuestaPaginacion(respuesta),
      error: (error: HttpErrorResponse): void => this.manejarMensajeError(error)
    });
  }

  crearSolicitudPaginado(): BusquedaUsuario {
    return {
      id_tipo_proveedor: this.busquedaUsuariosForm.get('tipoProveedor')?.value,
      numero_documento: this.busquedaUsuariosForm.get('numeroDocumento')?.value,
      ref_razon_social: this.busquedaUsuariosForm.get('razonSocial')?.value,
      ind_activo: this.busquedaUsuariosForm.get('estatus')?.value,
      ref_cargo: this.busquedaUsuariosForm.get('cargo')?.value,
      cve_curp: this.busquedaUsuariosForm.get('curp')?.value,
      ref_email: this.busquedaUsuariosForm.get('correo')?.value,
      ref_nombre: this.busquedaUsuariosForm.get('nombre')?.value,
      ref_primer_apellido: this.busquedaUsuariosForm.get('apellidoPaterno')?.value,
      ref_segundo_apellido: this.busquedaUsuariosForm.get('apellidoMaterno')?.value,
      id_rol: this.busquedaUsuariosForm.get('rol')?.value
    }
  }

  buscar(): void {
    this.numPaginaActual = 0;
    this.paginacionConFiltrado = true;
    this.paginarConFiltros();
  }

  limpiar(): void {
    this.paginacionConFiltrado = false;
    this.busquedaUsuariosForm.reset();
    this.numPaginaActual = 0;
    this.paginar();
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

}

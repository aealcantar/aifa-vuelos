import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DropdownModule} from "primeng/dropdown";
import {TipoDropdown} from "../../../../../../core/models/tipo-dropdown.interface";
import {PanelModule} from "primeng/panel";
import {CalendarModule} from "primeng/calendar";
import {RadioButtonModule} from "primeng/radiobutton";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {
  DialogoRegistroPersonaAutorizadaComponent
} from "../../dialogs/dialogo-registro-persona-autorizada/dialogo-registro-persona-autorizada.component";
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {TableModule} from "primeng/table";
import {NuevoRegistro} from "../../models/nuevo-registro.interface";
import {OPCIONES_RADIO_BUTTON, PATRON_RFC} from "../../../../../../utils/constants";
import {
  DialogoEdicionPersonaAutorizadaComponent
} from "../../dialogs/dialogo-edicion-persona-autorizada/dialogo-edicion-persona-autorizada.component";
import {
  TablaAccionesOverlayComponent
} from "../../../../../../shared/tabla-acciones-overlay/components/tabla-acciones-overlay/tabla-acciones-overlay.component";
import {AvatarModule} from "primeng/avatar";
import {MessageService} from "primeng/api";
import {ActivatedRoute, Router} from "@angular/router";
import {NumberDirective} from "../../../../../../core/directives/only-numbers.directive";
import {NgClass} from "@angular/common";
import {mapearArregloTipoDropdown} from "../../../../../../utils/funciones";
import moment from "moment";
import {EmpresasService} from "../../services/empresas.service";
import {concatMap, finalize, from} from "rxjs";
import {LoaderService} from "../../../../../../shared/loader/services/loader.service";
import {HttpErrorResponse} from "@angular/common/http";
import {AutenticacionService} from "../../../../../../core/services/autenticacion.service";
import {NuevoCorreoRegistro} from "../../models/nuevo-correo-registro.interface";
import {OnCloseOnNavigationDirective} from "../../../../../../core/directives/close-on-navigation.directive";
import {TooltipModule} from "primeng/tooltip";
import {RespuestaNuevoRegistro, RespuestaNuevoRegistroUsuario} from "../../models/respuesta-nuevo-registro.interface";

@Component({
  selector: 'app-nuevo-registro',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    ButtonDirective,
    CardModule,
    FormsModule,
    InputTextModule,
    ReactiveFormsModule,
    DropdownModule,
    PanelModule,
    CalendarModule,
    RadioButtonModule,
    TableModule,
    TablaAccionesOverlayComponent,
    AvatarModule,
    NumberDirective,
    NgClass,
    OnCloseOnNavigationDirective,
    TooltipModule
  ],
  providers: [DialogService, EmpresasService],
  templateUrl: './nuevo-registro.component.html',
  styleUrl: './nuevo-registro.component.scss'
})
export class NuevoRegistroComponent implements OnInit {
  readonly EDICION: number = 0;
  readonly ELIMINAR: number = 1;

  nuevoRegistroForm!: FormGroup;

  tiposProveedor: TipoDropdown[] = [];

  personalAutorizado: WritableSignal<PersonalAutorizado[]> = signal([]);
  sucursal: WritableSignal<boolean> = signal(false);

  avsecOpciones: { name: string; key: string; value: boolean }[] = [...OPCIONES_RADIO_BUTTON];
  sucursalOpciones: { name: string; key: string; value: boolean }[] = [...OPCIONES_RADIO_BUTTON];

  agregarRegistroRef: DynamicDialogRef | undefined;
  editarRegistroRef: DynamicDialogRef | undefined;

  id!: number;
  idPersonalSeleccionado!: number;
  tipoContrato!: number;

  acciones: number[] = [0, 1];

  constructor(private formBuilder: FormBuilder,
              public dialogService: DialogService,
              private messageService: MessageService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private empresaService: EmpresasService,
              private loaderService: LoaderService,
              private authService: AutenticacionService) {
    this.nuevoRegistroForm = this.crearNuevoRegistroForm();
  }

  ngOnInit(): void {
    const currentRoute: string = this.router.url;
    if (currentRoute === '/privado/registros/nuevo-contrato') {
      this.tipoContrato = 1;
    }
    if (currentRoute === '/privado/registros/nuevo-acuerdo') {
      this.tipoContrato = 0;
    }
    this.id = this.authService.usuarioSesion?.idUsuario as number;
    this.establecerValidacionesSucursal();
    this.obtenerCatalogos();
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      this.tiposProveedor = mapearArregloTipoDropdown(respuesta.data, 'referencia', 'idTipoProveedor');
    });
  }

  establecerValidacionesSucursal(): void {
    this.nuevoRegistroForm.get('sucursal')?.valueChanges
      .subscribe(value => this.actualizarValidacionesNombreSucursal(value));
  }

  actualizarValidacionesNombreSucursal(sucursal: boolean): void {
    if (sucursal) {
      this.sucursal.update(value => true);
      this.nuevoRegistroForm.get('nombreSucursal')?.setValidators([Validators.required, Validators.maxLength(50)]);
      this.nuevoRegistroForm.get('nombreSucursal')?.updateValueAndValidity();
      return;
    }
    this.sucursal.update(value => false);
    this.nuevoRegistroForm.get('nombreSucursal')?.clearValidators();
    this.nuevoRegistroForm.get('nombreSucursal')?.setValue('');
    this.nuevoRegistroForm.get('nombreSucursal')?.updateValueAndValidity();
  }

  crearNuevoRegistroForm(): FormGroup {
    return this.formBuilder.group({
      numeroContrato: ['', [Validators.required, Validators.maxLength(20)]],
      razonSocial: ['', [Validators.required, Validators.maxLength(50)]],
      rfc: ['', [Validators.required, Validators.maxLength(13), Validators.minLength(13),
        Validators.pattern(PATRON_RFC)]],
      tipoProveedor: ['', [Validators.required]],
      marca: ['', [Validators.required, Validators.maxLength(30)]],
      numColaboradores: ['', [Validators.required, Validators.maxLength(3)]],
      inicioVigencia: ['', [Validators.required]],
      finVigencia: ['', [Validators.required]],
      avsec: [false, [Validators.required]],
      sucursal: [false, [Validators.required]],
      nombreSucursal: [''],
    });
  }

  registrarPersonal(): void {
    const curpExistentes: string[] = this.personalAutorizado().map(personal => personal.curp);
    const config: DynamicDialogConfig = this.crearConfiguracionDialog(curpExistentes);
    this.agregarRegistroRef = this.dialogService.open(DialogoRegistroPersonaAutorizadaComponent, config);
    this.agregarRegistroRef.onClose.subscribe(({persona}) => this.procesarNuevoPersonal(persona))
  }

  crearConfiguracionDialog(data: any): DynamicDialogConfig {
    return {
      showHeader: false,
      width: '650px',
      focusOnShow: false,
      data
    }
  }

  procesarNuevoPersonal(personal?: PersonalAutorizado): void {
    if (!personal) return;
    const personalActualizado: PersonalAutorizado[] = [...this.personalAutorizado(), personal];
    this.personalAutorizado.update((value: PersonalAutorizado[]) => personalActualizado);
  }

  actualizarPersonal(personal: PersonalAutorizado): void {
    const curpExistentes: string[] = this.personalAutorizado().map(personal => personal.curp);
    const curpExistentesFiltrados: string[] = curpExistentes.filter(curp => curp !== personal.curp);
    const config: DynamicDialogConfig = this.crearConfiguracionDialog({ curps: curpExistentesFiltrados, personal });
    this.editarRegistroRef = this.dialogService.open(DialogoEdicionPersonaAutorizadaComponent, config);
    this.editarRegistroRef.onClose.subscribe(({persona}) => this.procesarActualizacionPersonal(persona))
  }

  procesarActualizacionPersonal(personal?: PersonalAutorizado): void {
    if (!personal) return;
    const personalActualizado: PersonalAutorizado[] = [...this.personalAutorizado().slice(0, this.idPersonalSeleccionado),
      personal, ...this.personalAutorizado().slice(this.idPersonalSeleccionado + 1)];
    this.personalAutorizado.update(value => personalActualizado);
  }

  eliminarPersonal(): void {
    const personalActualizado: PersonalAutorizado[] = [...this.personalAutorizado().slice(0, this.idPersonalSeleccionado),
      ...this.personalAutorizado().slice(this.idPersonalSeleccionado + 1)];
    this.personalAutorizado.update((value: PersonalAutorizado[]) => personalActualizado);
    this.mostrarAlertaDatosValidos('El registro se eliminó correctamente');
  }

  obtenerAccionSeleccionada(idAccion: number, registro: PersonalAutorizado, id: number): void {
    this.idPersonalSeleccionado = id;
    switch (idAccion) {
      case this.EDICION:
        this.actualizarPersonal(registro);
        break;
      case this.ELIMINAR:
        this.eliminarPersonal();
        break;
      default:
        break;
    }
  }

  crearSolicitudNuevoRegistro(): NuevoRegistro {
    return {
      contrato: {
        fechFinVig: moment(this.nuevoRegistroForm.get('finVigencia')?.value).format('DD/MM/YYYY'),
        fechIniVig: moment(this.nuevoRegistroForm.get('inicioVigencia')?.value).format('DD/MM/YYYY'),
        refContratoAcuerdo: this.nuevoRegistroForm.get('numeroContrato')?.value,
        tipoContrato: this.tipoContrato
      },
      usuario: [...this.personalAutorizado()],
      proveedor: {
        avsec: this.nuevoRegistroForm.get('avsec')?.value,
        indSucursal: this.nuevoRegistroForm.get('sucursal')?.value,
        marca: this.nuevoRegistroForm.get('marca')?.value,
        nombreSucursal: this.nuevoRegistroForm.get('nombreSucursal')?.value,
        numCol: this.nuevoRegistroForm.get('numColaboradores')?.value,
        razonSocial: this.nuevoRegistroForm.get('razonSocial')?.value,
        rfc: this.nuevoRegistroForm.get('rfc')?.value,
        tipoProveedor: this.nuevoRegistroForm.get('tipoProveedor')?.value,
        sigla: this.nuevoRegistroForm.get('marca')?.value
      },
      usuarioAlta: this.id
    }
  }

  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({severity: 'success', summary: '¡Exito!', detail: mensaje});
  }

  guardarRegistro(): void {
    const solicitud: NuevoRegistro = this.crearSolicitudNuevoRegistro();
    this.loaderService.activar();
    this.empresaService.crearContrato(solicitud).pipe(
      finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: (respuesta: RespuestaNuevoRegistro) => this.manejarRespuestaCorrecta(respuesta),
        error: error => this.manejarErrorGuardarContrato(error)
      })
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
  }

  manejarErrorGuardarContrato(error: HttpErrorResponse): void {
    console.log(error);
    this.mostrarAlertaDatosInvalidos('Error al crear el contrato');
  }

  manejarRespuestaCorrecta(respuesta: RespuestaNuevoRegistro): void {
    const solicitudesCorreo: NuevoCorreoRegistro[] = this.generarSolicitudesCorreo(respuesta.data.usuario);
    const registro: string = this.tipoContrato === 1 ? 'contrato' : 'acuerdo';
    this.mostrarAlertaDatosValidos('El ' + registro + ' se creó exitosamente');
    void this.router.navigate(['./..'], {relativeTo: this.activatedRoute});
    if (solicitudesCorreo.length === 0 ) return;
    from(solicitudesCorreo).pipe(
      concatMap(solicitud => this.empresaService.enviarCorreoNuevoRegistro(solicitud))
    ).subscribe({
      next: () => {},
      error: (error) => console.log(error)
    });
  }

  generarSolicitudesCorreo(usuarios: RespuestaNuevoRegistroUsuario[]): NuevoCorreoRegistro[] {
    const nuevosUsuarios = usuarios.filter(usuario => usuario.tipo === 0);
    return nuevosUsuarios.map(usuario => {
      return {
        url: `${window.location.protocol}//${window.location.host}/publico/crear-cuenta`,
        curp: usuario.curp,
        dest: [usuario.correo]
      }
    });
  }

  cancelar(): void {
    void this.router.navigate(['./..'], {relativeTo: this.activatedRoute});
  }

  get f() {
    return this.nuevoRegistroForm.controls;
  }
}

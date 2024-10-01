import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {HttpErrorResponse} from '@angular/common/http';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TableModule} from "primeng/table";
import {finalize} from 'rxjs';
import {ButtonDirective} from "primeng/button";
import {CardModule} from "primeng/card";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {FileUploadModule} from "primeng/fileupload";
import {ToastModule} from "primeng/toast";
import {BadgeModule} from "primeng/badge";
import {NgClass} from "@angular/common";
import {DropdownModule} from "primeng/dropdown";
import {AvatarModule} from "primeng/avatar";
import {MessageService, PrimeNGConfig} from "primeng/api";
import {ActivatedRoute, Router} from '@angular/router';
import {PanelModule} from "primeng/panel";
import {CalendarModule} from "primeng/calendar";
import {RadioButtonModule} from "primeng/radiobutton";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {NumberDirective} from "../../../../../../core/directives/only-numbers.directive";
import {PersonalAutorizado} from '../../models/personal-autorizado.interface';
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {ACUERDO, CONTRATO, OPCIONES_RADIO_BUTTON} from "../../../../../../utils/constants";
import {TipoDropdown} from "../../../../../../core/models/tipo-dropdown.interface";
import {LoaderService} from '../../../../../../shared/loader/services/loader.service';
import {RegistrosExternosService} from '../../services/registros-externos.service';
import {
  Contrato,
  Personal,
  ProveedorContratoUpdate,
  UsuarioUpdate,
  ProveedorContratoResponse,
  Documento,
  ContratoEstatusUpdate
} from '../../../../../../core/models/proveedor-contrato.interface';
import {mapearArregloTipoDropdown} from '../../../../../../utils/funciones';
import {EmpresasService} from '../../services/empresas.service';
import {
  DialogoEdicionPersonaExternoComponent
} from '../../dialogs/dialogo-edicion-persona-externo/dialogo-edicion-persona-externo.component';
import {
  TablaAccionesOverlayComponent
} from "../../../../../../shared/tabla-acciones-overlay/components/tabla-acciones-overlay/tabla-acciones-overlay.component";
import {
  DialogoRegistroPersonaExternoComponent
} from '../../dialogs/dialogo-registro-persona-externo/dialogo-registro-persona-externo.component';
import {TooltipModule} from "primeng/tooltip";
import {OnCloseOnNavigationDirective} from "../../../../../../core/directives/close-on-navigation.directive";
import {AutenticacionService} from '../../../../../../core/services/autenticacion.service';
import {ValidarUsuarioLogueadoPipe} from "../../../../../../core/pipes/validar-usuario-logueado.pipe";

@Component({
  selector: 'app-registro-complementario',
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
    NumberDirective,
    AvatarModule,
    DialogModule,
    FileUploadModule,
    ToastModule,
    BadgeModule,
    NgClass,
    TooltipModule,
    OnCloseOnNavigationDirective,
    ValidarUsuarioLogueadoPipe
  ],

  providers: [DialogService, RegistrosExternosService],
  templateUrl: './registro-complementario.component.html',
  styleUrl: './registro-complementario.component.scss'
})
export class RegistroComplementarioComponent implements OnInit {

  readonly EDICION: number = 0;
  readonly ELIMINAR: number = 1;

  proveedorContrato!: ProveedorContratoResponse;

  nuevoRegistroForm!: FormGroup;

  id_proveedor: number;
  tiposProveedor: TipoDropdown[] = [];
  personalAutorizado: WritableSignal<PersonalAutorizado[]> = signal([]);
  documentos: WritableSignal<string[]> = signal([]);

  avsecOpciones: { name: string; key: string; value: boolean }[] = [...OPCIONES_RADIO_BUTTON];
  sucursalOpciones: { name: string; key: string; value: boolean }[] = [...OPCIONES_RADIO_BUTTON];

  agregarRegistroRef: DynamicDialogRef | undefined;
  editarRegistroRef: DynamicDialogRef | undefined;

  idPersonalSeleccionado!: number;

  acciones: number[] = [0, 1];

 // tipoContrato!: number;

  cargarImagen: boolean = false;

  sucursal: WritableSignal<boolean> = signal(false);
  paginaTitulo: string = "";
  labelTitulo: string = "";
  labelRechazo: string = "";
  files = [];
  totalSize: number = 0;
  totalSizePercent: number = 0;

  get numPersonal(): boolean {
    return ((this.personalAutorizado().filter(item => item.idPerfil === 3).length > 0) && (this.personalAutorizado().filter(item => item.idPerfil === 2).length > 0))
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogService: DialogService,
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private registroExtService: RegistrosExternosService,
    private empresaService: EmpresasService,
    private config: PrimeNGConfig,
    private authService: AutenticacionService
  ) {
    this.id_proveedor = this.activatedRoute.snapshot.params['id'];
    this.nuevoRegistroForm = this.registroForm();
    this.obtenerCatalogos();
    this.establecerValidacionesSucursal();
  }

  ngOnInit(): void {
  }

  obtenerCatalogos(): void {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      this.tiposProveedor = mapearArregloTipoDropdown(respuesta[0].data, 'referencia', 'idTipoProveedor');
      this.proveedorContrato = respuesta[1];
      if (this.proveedorContrato.contrato.idTipo == CONTRATO) {
        this.paginaTitulo = "Registro complementario de contrato";
        this.labelTitulo = "Número de contrato:";
        this.labelRechazo = "Contrato rechazado"
      } else {
        this.paginaTitulo = "Registro complementario de acuerdo";
        this.labelTitulo = "Número de documento:";
        this.labelRechazo = "Acuerdo rechazado"
      }
      this.asignarDatos(this.nuevoRegistroForm, respuesta[1].contrato, respuesta[1].personal, respuesta[1].documento);
      this.loaderService.desactivar();
    });
  }

  actualizarListaPersonal(personal: Personal[]) {
    let lstPersonal: PersonalAutorizado[] = [];
    personal.forEach((item: Personal) => {
      lstPersonal.push({
        id: item.idUsuario,
        idPerfil: item.idRol,
        paterno: item.refPrimerApellido,
        materno: item.refSegundoApellido,
        nombre: item.refNombre,
        correo: item.refMail,
        curp: item.cveCurp,
        cargo: 0,
        descCargo: item.refCargo,
        principal: item.indPrincipal ? 1 : 0,
        indAltaGia: item.indAltaGia
      });
    });
    this.personalAutorizado.set(lstPersonal);
  }

  asignarDatos(formulario: FormGroup, contrato: Contrato, personal: Personal[], documento: Documento): void {
    formulario.get('numeroContrato')?.setValue(contrato.refContrato)
    formulario.get('inicioVigencia')?.setValue(new Date(contrato.fecInicioVigencia))
    formulario.get('finVigencia')?.setValue(new Date(contrato.fecFinVigencia))
    formulario.get('razonSocial')?.setValue(contrato.razonSocial)
    formulario.get('marca')?.setValue(contrato.siglasEmpresa)
    formulario.get('rfc')?.setValue(contrato.rfc)
    formulario.get('giroEmpresa')?.setValue(contrato.refGiro)
    formulario.get('numColaboradores')?.setValue(contrato.numColaboradores)
    formulario.get('direccion')?.setValue(contrato.refDireccion)
    formulario.get('numEmpleadosOperativos')?.setValue(contrato.numOperativos)
    formulario.get('numEmpleadosAdministrativos')?.setValue(contrato.numAdministrativos)
    formulario.get('tipoProveedor')?.setValue(contrato.tipoProveedor)
    formulario.get('avsec')?.setValue(contrato.indCursoAvsec)
    formulario.get('sucursal')?.setValue(contrato.indSucursal)
    formulario.get('nombreSucursal')?.setValue(contrato.nomSucursal)


    let lstPersonal: PersonalAutorizado[] = [];
    personal.forEach((item: Personal) => {
      lstPersonal.push({
        id: item.idUsuario,
        idPerfil: item.idRol,
        paterno: item.refPrimerApellido,
        materno: item.refSegundoApellido,
        nombre: item.refNombre,
        correo: item.refMail,
        curp: item.cveCurp,
        cargo: 0,
        descCargo: item.refCargo,
        principal: item.indPrincipal ? 1 : 0,
        indAltaGia: item.indAltaGia
      });
    });
    this.personalAutorizado.set(lstPersonal);
    if (!documento) return;
    this.documentos.update(value => [documento.nombre])
  }

  establecerValidacionesSucursal(): void {
    this.nuevoRegistroForm.get('sucursal')?.valueChanges.subscribe(value => {
        if (value) {
          this.sucursal.update(value => true);
          this.nuevoRegistroForm.get('nombreSucursal')?.setValidators([Validators.required]);
          this.nuevoRegistroForm.get('nombreSucursal')?.updateValueAndValidity();
        } else {
          this.sucursal.update(value => false);
          this.nuevoRegistroForm.get('nombreSucursal')?.clearValidators();
          this.nuevoRegistroForm.get('nombreSucursal')?.setValue('');
          this.nuevoRegistroForm.get('nombreSucursal')?.updateValueAndValidity();
        }
      }
    );
  }

  registroForm(): FormGroup {
    return this.formBuilder.group({
      numeroContrato: [{value: '', disabled: true}, [Validators.required]],
      razonSocial: [{value: '', disabled: true}, [Validators.required]],
      rfc: [{value: '', disabled: true}, [Validators.required]],
      tipoProveedor: [{value: '', disabled: true}, [Validators.required]],
      marca: ['', [Validators.required]],
      numColaboradores: ['', [Validators.required]],
      inicioVigencia: [{value: '', disabled: true}, [Validators.required]],
      finVigencia: [{value: '', disabled: true}, [Validators.required]],
      avsec: [false, [Validators.required]],
      giroEmpresa: ['', [Validators.required]],
      direccion: ['', [Validators.required]],
      numEmpleadosOperativos: ['', [Validators.required]],
      numEmpleadosAdministrativos: ['', [Validators.required]],
      sucursal: [false, [Validators.required]],
      nombreSucursal: [''],
    });
  }

  registrarPersonal(): void {
    const rowsPrincipal = this.personalAutorizado().filter(item => item.idPerfil === 2).length;
    const config: DynamicDialogConfig = {
      showHeader: false,
      width: '550px',
      focusOnShow: false,
      data: {rowsPrincipal}
    };
    this.agregarRegistroRef = this.dialogService.open(DialogoRegistroPersonaExternoComponent, config);
    this.agregarRegistroRef.onClose.subscribe(({persona}) => this.procesarNuevoPersonal(persona))
  }

  procesarNuevoPersonal(personal?: PersonalAutorizado): void {
    if (!personal) return;

    if (personal.idPerfil === 2) personal.principal = 1;
    else personal.principal = 0;

    const personalActualizado: PersonalAutorizado[] = [...this.personalAutorizado(), personal];
    this.personalAutorizado.update(value => personalActualizado);
  }

  actualizarPersonal(personal: PersonalAutorizado): void {
    const rowsPrincipal = this.personalAutorizado().filter(item => item.idPerfil === 2).length;
    const config: DynamicDialogConfig = {
      showHeader: false,
      width: '550px',
      focusOnShow: false,
      data: {personal, rowsPrincipal}
    }

    this.editarRegistroRef = this.dialogService.open(DialogoEdicionPersonaExternoComponent, config);
    this.editarRegistroRef.onClose.subscribe(({persona}) => this.procesarActualizacionPersonal(persona))
  }

  procesarActualizacionPersonal(personal?: PersonalAutorizado): void {
    if (!personal) return;
    const personalActualizado: PersonalAutorizado[] = [...this.personalAutorizado().slice(0, this.idPersonalSeleccionado),
      personal, ...this.personalAutorizado().slice(this.idPersonalSeleccionado + 1)];
    this.personalAutorizado.update(value => personalActualizado);
  }

  eliminarPersonal(registro: PersonalAutorizado): void {
    const personalActualizado: PersonalAutorizado[] = this.personalAutorizado().filter(personal => !(personal == registro));
    this.personalAutorizado.update(value => personalActualizado);
    this.mostrarAlertaDatosValidos('El usuario se eliminó correctamente');
  }

  obtenerAccionSeleccionada(idAccion: number, registro: PersonalAutorizado, id: number): void {
    this.idPersonalSeleccionado = id;
    switch (idAccion) {
      case this.EDICION:
        this.actualizarPersonal(registro);
        break;
      case this.ELIMINAR:
        this.eliminarPersonal(registro);
        break;
      default:
        break;
    }
  }

  actualizarRegistro(formulario: FormGroup): ProveedorContratoUpdate {

    const usuarios: UsuarioUpdate[] = this.personalAutorizado()
      .map(item => {
        return {
          idUsuario: item.id,
          cveCurp: item.curp,
          idRol: item.idPerfil,
          indActivo: 1,
          indPrincipal: item.principal,
          refNombre: item.nombre,
          refCargo: item.descCargo,
          refPrimerApellido: item.paterno,
          refSegundoApellido: item.materno,
          refMail: item.correo
        }
      });
    return {
      nomProveedor: formulario.get('marca')?.value,
      numColaboradores: formulario.get('numColaboradores')?.value,
      indCursoAvsec: formulario.get('avsec')?.value,
      indSucursal: formulario.get('sucursal')?.value,
      nomSucursal: formulario.get('nombreSucursal')?.value,
      refGiro: formulario.get('giroEmpresa')?.value,
      refDireccion: formulario.get('direccion')?.value,
      numEmpleadosOperativos: formulario.get('numEmpleadosOperativos')?.value,
      numEmpleadosAdministrativos: formulario.get('numEmpleadosAdministrativos')?.value,
      usuarios: [...usuarios]
    }
  }

  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({
      severity: 'success',
      summary: '¡Exito!',
      detail: mensaje,
    });
  }

  mostrarAlertaDatosError(mensaje: string): void {
    this.messageService.add({
      severity: 'error',
      summary: '¡Error!',
      detail: mensaje,
    });
  }

  guardarRegistro(): void {
    const id: number = this.id_proveedor;
    const solicitud: ProveedorContratoUpdate = this.actualizarRegistro(this.nuevoRegistroForm);

    this.loaderService.activar()
    this.registroExtService.updateProveedorContrato(id, solicitud)
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        next: (resp) => {
          this.mostrarAlertaDatosValidos(resp.message);
          this.actualizarListaPersonal(resp.contrato.data.usuarios);
        },
        error: (err) => this.mostrarAlertaDatosError("No se actualizo el contrato")
      })

  }

  finalizarRegistro(): void {

    const idContratoAcuerdo: number = this.proveedorContrato.contrato.idContratoAcuerdo;
    const idEstatus: number = 2;
    const usuarioModifica: number = this.authService.usuarioSesion?.idUsuario ?? 0;
    const statuContrato: ContratoEstatusUpdate = {idContratoAcuerdo, idEstatus, usuarioModifica};

    this.registroExtService.updateEstatusContrato(statuContrato).subscribe(() => {
      this.cancelar();
    });

  }

  cancelar(): void {
    void this.router.navigate(['./..'], {relativeTo: this.activatedRoute});
  }

  cancelarCargaArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('clear_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
    this.cargarImagen = false;
  }

  seleccionarArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('choose_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }

  cargarArchivo(): void {
    const elemento: HTMLElement | null = document.getElementById('load_btn');
    if (!elemento) return;
    elemento.querySelector('button')?.click();
  }


  descargarFormato(event: MouseEvent): void {
    const id: number = this.id_proveedor;
    this.loaderService.activar();
    this.empresaService.descargarDocumento(id).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        window.open(fileURL, '_blank');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.mostrarAlertaDatosError('Error al descargar el documento')
      }
    })
  }

  toggle(event: MouseEvent): void {
    const id: number = this.proveedorContrato.contrato.idContratoAcuerdo;
    this.loaderService.activar();
    this.empresaService.descargarDocumento(id).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (response: Blob) => {
        const fileURL = URL.createObjectURL(response);
        window.open(fileURL, '_blank');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.mostrarAlertaDatosError('Error al descargar el documento')
      }
    })
  }

  toggleDeleted(event: MouseEvent) {
    const id: number = this.proveedorContrato.contrato.idContratoAcuerdo;
    this.loaderService.activar();
    this.registroExtService.eliminarDocumento(id).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (resp) => {
        this.documentos.update(value => [])
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.mostrarAlertaDatosError('Error al eliminar el documento')
      }
    })
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  choose(event: any, callback: any) {
    callback();
  }

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
    removeFileCallback(event, index);
    this.totalSize -= parseInt(this.formatSize(file.size));
    this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
    clear();
    this.totalSize = 0;
    this.totalSizePercent = 0;
  }

  onTemplatedUpload() {
    this.messageService.add({severity: 'success', summary: 'Success', detail: 'El formato de personal autorizado se cargó correctamente.', life: 3000});
    setTimeout(() => {
      this.cancelarCargaArchivo();
    }, 2000)
  }

  onSelectedFiles(event: any) {
    this.files = event.currentFiles;
    this.files.forEach((file: any) => {
      this.totalSize += parseInt(this.formatSize(file.size));
    });
    this.totalSizePercent = this.totalSize / 10;
  }

  uploadEvent(callback: any) {
    this.enviarActualizacionDocumento()
    callback();
  }

  enviarActualizacionDocumento(): void {
    if (this.files.length === 0) return;
    const formData = new FormData();
    formData.append('file', this.files[0]);
    this.registroExtService.actualizarDocumento(this.id_proveedor, formData).subscribe({
      next: (resp) => {
        this.mostrarAlertaDatosValidos(resp.msg);
        this.documentos.update(value => ["Formato.Pdf"]);
        this.cancelarCargaArchivo()
      },
      error: (error) => {
        this.mostrarAlertaDatosError("hubo un fallo al cargar el formato")
      }
    })
  }

  formatSize(bytes: any) {
    const k = 1024;
    const dm = 3;
    const sizes: any = this.config.translation.fileSizeTypes;
    if (bytes === 0) {
      return `0 ${sizes[0]}`;
    }

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

    return `${formattedSize} ${sizes[i]}`;
  }

  protected readonly document = document;

  get f() {
    return this.nuevoRegistroForm.controls;
  }

}

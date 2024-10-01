import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {AvatarModule} from "primeng/avatar";
import {PanelModule} from "primeng/panel";
import {ButtonDirective} from "primeng/button";
import {
  TablaAccionesOverlayComponent
} from "../../../../../../shared/tabla-acciones-overlay/components/tabla-acciones-overlay/tabla-acciones-overlay.component";
import {TableModule} from "primeng/table";
import {ActivatedRoute, Router} from "@angular/router";
import {Personal, RegistroDetalle} from "../../models/registro-detalle.interface";
import {DialogService, DynamicDialogConfig} from "primeng/dynamicdialog";
import {
  DialogRechazarValidacionComponent
} from "../../dialogs/dialogo-rechazar-validacion/dialog-rechazar-validacion.component";
import {AceptarRechazarRegistro} from "../../models/aceptar-rechazar-registro.interface";
import {EmpresasService} from "../../services/empresas.service";
import {LoaderService} from "../../../../../../shared/loader/services/loader.service";
import {concatMap, finalize, from} from "rxjs";
import {AutenticacionService} from "../../../../../../core/services/autenticacion.service";
import {MessageService} from "primeng/api";
import {HttpErrorResponse} from "@angular/common/http";
import {DatePipe} from "@angular/common";
import {OnCloseOnNavigationDirective} from "../../../../../../core/directives/close-on-navigation.directive";
import {NuevoCorreoRegistro} from "../../models/nuevo-correo-registro.interface";

@Component({
  selector: 'app-validacion-registro',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    AvatarModule,
    PanelModule,
    ButtonDirective,
    TablaAccionesOverlayComponent,
    TableModule,
    DatePipe,
    OnCloseOnNavigationDirective
  ],
  providers: [DialogService],
  templateUrl: './validacion-registro.component.html',
  styleUrl: './validacion-registro.component.scss'
})
export class ValidacionRegistroComponent implements OnInit {

  personalAutorizado: WritableSignal<Personal[]> = signal([]);
  documentos: WritableSignal<string[]> = signal([]);

  detalleRegistro!: RegistroDetalle;
  id!: number;
  correoUsuariosNuevos: NuevoCorreoRegistro[] = [];

  constructor(private router: Router,
              private activatedRoute: ActivatedRoute,
              public dialogService: DialogService,
              private empresaService: EmpresasService,
              private loaderService: LoaderService,
              private messageService: MessageService,
              private authService: AutenticacionService
  ) {
  }

  ngOnInit(): void {
    this.id = this.authService.usuarioSesion?.idUsuario as number;
    this.obtenerDatos();
  }

  obtenerDatos(): void {
    this.activatedRoute.data.subscribe(({respuesta}) => {
      this.detalleRegistro = respuesta;
      this.personalAutorizado.update(value => respuesta.personal);
      this.correoUsuariosNuevos = this.generarSolicitudesCorreo(this.personalAutorizado());
      if (!respuesta.documento) return;
      this.documentos.update(value => [respuesta.documento.nombre])
    });
  }

  cancelar(): void {
    void this.router.navigate(['./..'], {relativeTo: this.activatedRoute});
  }

  abrirRechazarDialog(): void {
    const data = this.detalleRegistro.contrato.idTipo === 1 ? 'Contrato' : 'Acuerdo'
    const config: DynamicDialogConfig = {
      showHeader: false,
      width: '550px',
      focusOnShow: false,
      data
    };
    const ref = this.dialogService.open(DialogRechazarValidacionComponent, config);
    ref.onClose.subscribe(respuesta => this.rechazar(respuesta))
  }

  rechazar(motivo: string): void {
    if (!motivo) return;
    const solicitud: AceptarRechazarRegistro = this.generarSolicitudValidacion(3, motivo);
    this.loaderService.activar();
    this.empresaService.validarContrato(solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: () => this.manejarRechazoCorrecta(),
      error: (error) => this.manejarErrorGuardarContrato(error)
    });
  }

  aprobar(): void {
    const solicitud: AceptarRechazarRegistro = this.generarSolicitudValidacion(4);
    this.loaderService.activar();
    this.empresaService.validarContrato(solicitud).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: () => this.manejarAprobacionCorrecta(),
      error: (error) => this.manejarErrorGuardarContrato(error)
    });
  }

  manejarAprobacionCorrecta(): void {
    const id = this.detalleRegistro.contrato.idContratoAcuerdo;
    const valor = this.detalleRegistro.contrato.idTipo === 1 ? 'contrato' : 'acuerdo'
    this.mostrarAlertaDatosValidos('El ' + valor + ' se aprobó.');
    void this.router.navigate(['./..'], {relativeTo: this.activatedRoute});
    this.envioCorreos();
    this.mandarCorreoValidacionAceptada(id);

  }

  mandarCorreoValidacionAceptada(id: number): void {
    this.empresaService.enviarCorreoValidacionAceptada(id).subscribe({
      next: (respuesta) => console.log(respuesta),
      error: (error) => console.log(error)
    })
  }

  manejarRechazoCorrecta(): void {
    const id = this.detalleRegistro.contrato.idContratoAcuerdo;
    const valor = this.detalleRegistro.contrato.idTipo === 1 ? 'contrato' : 'acuerdo'
    this.mostrarAlertaDatosValidos('El ' + valor + ' se rechazó.');
    void this.router.navigate(['./..'], {relativeTo: this.activatedRoute});
    this.empresaService.enviarCorreoValidacionRechazada(id).subscribe({
      next: (respuesta) => console.log(respuesta),
      error: (error) => console.log(error)
    })
  }

  mostrarAlertaDatosValidos(mensaje: string): void {
    this.messageService.add({severity: 'success', summary: '¡Exito!', detail: mensaje});
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
  }

  manejarErrorGuardarContrato(error: HttpErrorResponse): void {
    console.log(error);
    this.mostrarAlertaDatosInvalidos('Error al validar el contrato');
  }

  generarSolicitudValidacion(estatus: 2 | 3 | 4 = 2, motivoCancelacion?: string): AceptarRechazarRegistro {
    if (estatus === 2 || estatus === 4) {
      return {
        idContratoAcuerdo: this.detalleRegistro.contrato.idContratoAcuerdo,
        idEstatus: estatus,
        usuarioModifica: this.id
      }
    }
    return {
      idContratoAcuerdo: this.detalleRegistro.contrato.idContratoAcuerdo,
      idEstatus: 3,
      usuarioModifica: this.id,
      motivoCancelacion
    }
  }

  toggle(event: MouseEvent): void {
    const id: number = this.detalleRegistro.contrato.idContratoAcuerdo;
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
        this.mostrarAlertaDatosInvalidos('Error al descargar el documento')
      }
    })
  }

  generarSolicitudesCorreo(usuarios: Personal[]): NuevoCorreoRegistro[] {
    const nuevosUsuarios = usuarios.filter(usuario => !usuario.indAltaGia);
    return nuevosUsuarios.map(usuario => {
      return {
        url: `${window.location.protocol}//${window.location.host}/publico/crear-cuenta`,
        curp: usuario.cveCurp,
        dest: [usuario.refMail]
      }
    });
  }

  envioCorreos(): void {
    if (this.correoUsuariosNuevos.length === 0) return;
    from(this.correoUsuariosNuevos).pipe(
      concatMap(solicitud => this.empresaService.enviarCorreoNuevoRegistro(solicitud))
    ).subscribe({
      next: () => {
      },
      error: (error) => console.log(error)
    });
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }
}

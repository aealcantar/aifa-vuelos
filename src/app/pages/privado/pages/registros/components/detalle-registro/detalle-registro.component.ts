import {Component, signal, WritableSignal} from '@angular/core';
import {PersonalAutorizado} from "../../models/personal-autorizado.interface";
import {RegistroDetalle} from "../../models/registro-detalle.interface";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from "primeng/dynamicdialog";
import {EmpresasService} from "../../services/empresas.service";
import {LoaderService} from "../../../../../../shared/loader/services/loader.service";
import {MessageService} from "primeng/api";
import {AutenticacionService} from "../../../../../../core/services/autenticacion.service";
import {TituloPrincipalComponent} from "../../../../../../shared/titulo-principal/titulo-principal.component";
import {AvatarModule} from "primeng/avatar";
import {PanelModule} from "primeng/panel";
import {TableModule} from "primeng/table";
import {finalize} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {DatePipe, UpperCasePipe} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {MessagesModule} from "primeng/messages";

@Component({
  selector: 'app-detalle-registro',
  standalone: true,
  imports: [
    TituloPrincipalComponent,
    AvatarModule,
    PanelModule,
    TableModule,
    DatePipe,
    UpperCasePipe,
    TooltipModule,
    MessagesModule
  ],
  templateUrl: './detalle-registro.component.html',
  styleUrl: './detalle-registro.component.scss'
})
export class DetalleRegistroComponent {

  personalAutorizado: WritableSignal<PersonalAutorizado[]> = signal([]);
  documentos: WritableSignal<string[]> = signal([]);

  detalleRegistro!: RegistroDetalle;
  id!: number;

  constructor(private activatedRoute: ActivatedRoute,
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
      if (!respuesta.documento) return;
      this.documentos.update(value => [respuesta.documento.nombre])
    });
  }

  toggle(event: MouseEvent): void {
    const id: number = this.detalleRegistro.contrato.idContratoAcuerdo;
    this.loaderService.activar();
    this.empresaService.descargarDocumento(id).pipe(
      finalize(() => this.loaderService.desactivar())
    ).subscribe({
      next: (response: Blob) => {
        const fileURL: string = URL.createObjectURL(response);
        window.open(fileURL, '_blank');
      },
      error: (error: HttpErrorResponse) => {
        console.log(error);
        this.mostrarAlertaDatosInvalidos('Error al descargar el documento')
      }
    })
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  mostrarAlertaDatosInvalidos(mensaje: string): void {
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: mensaje});
  }

}

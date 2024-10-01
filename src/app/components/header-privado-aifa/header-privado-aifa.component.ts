import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {AutenticacionService} from "../../core/services/autenticacion.service";
import {UsuarioSesion} from "../../core/models/usuario-sesion.interface";
import {DialogService, DynamicDialogRef} from "primeng/dynamicdialog";
import {CerrarSesionDialogComponent} from "../../dialogs/cerrar-sesion-dialog/cerrar-sesion-dialog.component";
import {NotificacionesService} from "../../core/services/notificaciones.service";
import {BadgeModule} from "primeng/badge";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {MessagesModule} from "primeng/messages";
import {Notificacion} from "../../core/models/notificaciones.interface";
import {StyleClassModule} from "primeng/styleclass";

@Component({
  selector: 'app-header-privado-aifa',
  standalone: true,
  imports: [
    BadgeModule,
    OverlayPanelModule,
    MessagesModule,
    StyleClassModule
  ],
  providers: [DialogService, NotificacionesService],
  templateUrl: './header-privado-aifa.component.html',
  styleUrl: './header-privado-aifa.component.scss'
})
export class HeaderPrivadoAifaComponent implements OnInit {
  usuarioSesion!: UsuarioSesion | null;
  ref: DynamicDialogRef | undefined;

  notificaciones: WritableSignal<Notificacion[]> = signal([]);

  constructor(private autenticacionService: AutenticacionService,
              public dialogService: DialogService,
              private notificacionesService: NotificacionesService) {
  }

  ngOnInit(): void {
    this.usuarioSesion = this.autenticacionService.usuarioSesion;
    this.obtenerNotificaciones()
  }

  obtenerNotificaciones(): void {
    this.notificacionesService.obtenerNotificaciones().subscribe({
      next: (respuesta) => {
        this.notificaciones.update(valor => respuesta.body);
      }
      }
    )
  }

  cerrarSesion(): void {
    this.ref = this.dialogService.open(CerrarSesionDialogComponent, {showHeader: false, width: '550px', focusOnShow:false})
    this.ref.onClose.subscribe((cerrarSesion: boolean) => {
      if (cerrarSesion) this.autenticacionService.cerrarSesion()
    });
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }

  cerrarNotificacion(id: number): void {
    const notificaciones: Notificacion[] = this.notificaciones().filter(notificacion => notificacion.ID_NOTIFICACION !== id);
    this.notificaciones.update(value => notificaciones);
    this.servicioCerrarNotificacion(id);
  }

  servicioCerrarNotificacion(id: number): void {
    this.notificacionesService.cerrarNotificacion(id).subscribe({
      next: (respuesta) => { console.log(respuesta)},
      error: (error) => { console.log(error)},
    })
  }
}

import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { AutenticacionService } from '../../core/services/autenticacion.service';
import { UsuarioSesion } from '../../core/models/usuario-sesion.interface';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CerrarSesionDialogComponent } from '../../dialogs/cerrar-sesion-dialog/cerrar-sesion-dialog.component';
import { NotificacionesService } from '../../core/services/notificaciones.service';
import { BadgeModule } from 'primeng/badge';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { MessagesModule } from 'primeng/messages';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-header-privado-aifa',
  standalone: true,
  imports: [BadgeModule, OverlayPanelModule, MessagesModule, StyleClassModule],
  providers: [DialogService, NotificacionesService],
  templateUrl: './header-privado-aifa.component.html',
  styleUrl: './header-privado-aifa.component.scss',
})
export class HeaderPrivadoAifaComponent implements OnInit {
  usuarioSesion!: UsuarioSesion | null;
  ref: DynamicDialogRef | undefined;

  constructor(private autenticacionService: AutenticacionService, public dialogService: DialogService) {}

  ngOnInit(): void {
    this.usuarioSesion = this.autenticacionService.usuarioSesion;
  }

  cerrarSesion(): void {
    this.ref = this.dialogService.open(CerrarSesionDialogComponent, { showHeader: false, width: '550px', focusOnShow: false });
    this.ref.onClose.subscribe((cerrarSesion: boolean) => {
      if (cerrarSesion) this.autenticacionService.cerrarSesion();
    });
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }
}

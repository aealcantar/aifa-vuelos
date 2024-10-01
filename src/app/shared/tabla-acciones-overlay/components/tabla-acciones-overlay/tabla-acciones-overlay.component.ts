import {Component, EventEmitter, Input, Output, ViewChild, ViewEncapsulation} from '@angular/core';
import {OverlayPanel, OverlayPanelModule} from "primeng/overlaypanel";
import {TieneAccionDirective} from "../../directives/tiene-accion.directive";

@Component({
  selector: 'app-tabla-acciones-overlay',
  standalone: true,
  imports: [
    OverlayPanelModule,
    TieneAccionDirective
  ],
  templateUrl: './tabla-acciones-overlay.component.html',
  styleUrl: './tabla-acciones-overlay.component.scss',
})
export class TablaAccionesOverlayComponent {
  readonly EDITAR: number = 0;
  readonly ELIMINAR: number = 1;
  readonly VALIDAR: number = 2;
  readonly VER_DETALLE: number = 3;
  readonly COMPLEMENTAR: number = 15;

  @Input()
  idsAcciones: number[] = [];

  @Input()
  estatusToggle: boolean = true;

  @Output()
  opcionSeleccionada: EventEmitter<number> = new EventEmitter<number>();

  @ViewChild('op') overlayPanel!: OverlayPanel;

  emitir(idAccion: number): void {
    this.overlayPanel.hide();
    this.opcionSeleccionada.next(idAccion);
  }

  toggle(event: MouseEvent): void {
    if (this.estatusToggle) this.overlayPanel.toggle(event);
  }

  handleKeyDown($event: KeyboardEvent): void {
    $event.preventDefault();
  }
}


import {Component} from '@angular/core';
import {ButtonDirective} from "primeng/button";
import {DynamicDialogRef} from "primeng/dynamicdialog";

@Component({
  selector: 'app-cerrar-sesion-dialog',
  standalone: true,
  imports: [
    ButtonDirective
  ],
  templateUrl: './cerrar-sesion-dialog.component.html',
  styleUrl: './cerrar-sesion-dialog.component.scss'
})
export class CerrarSesionDialogComponent {

  constructor(public ref: DynamicDialogRef,) {
  }
}

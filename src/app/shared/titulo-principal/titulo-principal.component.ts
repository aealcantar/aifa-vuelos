import {Component, Input} from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-titulo-principal',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './titulo-principal.component.html',
  styleUrl: './titulo-principal.component.scss'
})
export class TituloPrincipalComponent {
  @Input() titulo!: string;
  @Input() subtitulo!: string;
  @Input() ruta!: string;

}

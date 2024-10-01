import {Component, Input} from '@angular/core';
import {TagModule} from "primeng/tag";

@Component({
  selector: 'app-tag-estatus-contrato',
  standalone: true,
  imports: [
    TagModule
  ],
  templateUrl: './tag-estatus-contrato.component.html',
  styleUrl: './tag-estatus-contrato.component.scss'
})
export class TagEstatusContratoComponent {
  @Input() label: string = '';
}

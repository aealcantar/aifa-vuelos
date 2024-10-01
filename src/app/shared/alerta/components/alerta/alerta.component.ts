import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-alerta',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './alerta.component.html',
  styleUrl: './alerta.component.scss'
})
export class AlertaComponent {
  @Input() message!: any;
}

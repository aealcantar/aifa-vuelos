import { Component, Input, OnInit } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-tag-vigencia-contrato',
  standalone: true,
  imports: [TagModule],
  templateUrl: './tag-vigencia-contrato.component.html',
  styleUrls: ['./tag-vigencia-contrato.component.scss'],
})
export class TagVigenciaContratoComponent implements OnInit {
  @Input() fechaInicio!: string; // Fecha de inicio en formato yyyy-mm-dd
  @Input() fechaFin!: string;    // Fecha de fin en formato yyyy-mm-dd

  vigencia: number = 0; // -1: Vigente, 0: Próximo a vencer, 1: Vencido

  ngOnInit(): void {
    this.calcularVigencia();
  }

  calcularVigencia(): void {
    const fechaActual: Date = new Date();
    const inicio: Date = new Date(`${this.fechaInicio}T00:00:00`);
    const fin: Date = new Date(`${this.fechaFin}T00:00:00`);

    if (fechaActual >= inicio && fechaActual <= fin) {
      const diasParaVencimiento: number = Math.floor((fin.getTime() - fechaActual.getTime()) / (1000 * 60 * 60 * 24));

      if (diasParaVencimiento <= 30) {
        this.vigencia = 0; // Próximo a vencer
      } else {
        this.vigencia = -1; // Vigente
      }
    } else if (fechaActual > fin) {
      this.vigencia = 1; // Vencido
    }
  }

}

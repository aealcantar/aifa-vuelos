import {Directive, Input, TemplateRef, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appTieneAccion]',
  standalone: true
})
export class TieneAccionDirective {
  constructor(private templateRef: TemplateRef<any>, private viewContainer: ViewContainerRef) {
  }

  @Input() set appTieneAccion(acciones: [idsRecibidos: number[], idAccion: number]) {
    const [idsRecibidos, idAccion] = acciones;

    if (idsRecibidos && Array.isArray(idsRecibidos)) {
      const idExiste: number = idsRecibidos.findIndex((id) => id === idAccion);
      if (idExiste !== -1) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      } else {
        this.viewContainer.clear();
      }
    } else {
      this.viewContainer.clear();
    }
  }
}

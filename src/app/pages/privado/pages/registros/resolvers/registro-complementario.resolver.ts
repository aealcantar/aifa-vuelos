import {ResolveFn, Router} from '@angular/router';
import {CatalogosService} from "../../../../../core/services/catalogos.service";
import {inject} from "@angular/core";
import {RegistrosExternosService} from "../services/registros-externos.service";
import {catchError, forkJoin, of} from "rxjs";
import {MessageService} from "primeng/api";

export const registroComplementarioResolver: ResolveFn<any> = (route, state) => {
  const idContrato: number = route.paramMap.get('id') as unknown as number;
  const registroExtService = inject(RegistrosExternosService)
  const router: Router = inject(Router);
  const catalogosService: CatalogosService = inject(CatalogosService);
  const messageService: MessageService = inject(MessageService);

  const $estatus = catalogosService.obtenerEstatus();
  const $contrato =  registroExtService.getProveedorContrato(idContrato)

  return forkJoin([ $estatus, $contrato ]).pipe(
    catchError(error => {
      messageService.add({severity: 'error', summary: '¡Error!', detail: 'Servicio no disponible.'});
      void router.navigate(['/privado/registros']);
      return of(null);
    })
  );
};

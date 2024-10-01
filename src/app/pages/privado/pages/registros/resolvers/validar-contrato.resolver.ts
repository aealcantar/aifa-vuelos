import {ResolveFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {EmpresasService} from "../services/empresas.service";
import {MessageService} from "primeng/api";
import {catchError, of} from "rxjs";

export const validarContratoResolver: ResolveFn<any> = (route, state) => {
  const idContrato: number = route.paramMap.get('id') as unknown as number;
  const empresaService: EmpresasService = inject(EmpresasService);
  const router: Router = inject(Router);
  const messageService: MessageService = inject(MessageService);


  return empresaService.obtenerContrato(idContrato).pipe(
    catchError(error => {
      messageService.add({severity: 'error', summary: '¡Error!', detail: 'Servicio no disponible.'});
      void router.navigate(['/privado/registros']);
      return of(null);
    })
  );
};

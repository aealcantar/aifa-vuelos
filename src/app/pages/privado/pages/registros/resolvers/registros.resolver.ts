import { ResolveFn } from '@angular/router';
import {CatalogosService} from "../../../../../core/services/catalogos.service";
import {inject} from "@angular/core";
import {forkJoin, Observable} from "rxjs";

export const registrosResolver: ResolveFn<Observable<[any, any]>> = (route, state) => {
  const catalogosService: CatalogosService = inject(CatalogosService);

  const $organismos = catalogosService.obtenerTipoOrganismo();
  const $estatus = catalogosService.obtenerEstatus();

  return forkJoin([$organismos, $estatus]);
};

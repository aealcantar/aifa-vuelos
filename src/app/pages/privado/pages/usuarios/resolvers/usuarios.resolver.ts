import { ResolveFn } from '@angular/router';
import {CatalogosService} from "../../../../../core/services/catalogos.service";
import {inject} from "@angular/core";

export const usuariosResolver: ResolveFn<boolean> = (route, state) => {
  const catalogosService: CatalogosService = inject(CatalogosService);

  return catalogosService.obtenerTipoOrganismo();
};

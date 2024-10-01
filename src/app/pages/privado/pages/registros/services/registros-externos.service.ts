import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {environment} from "../../../../../../environments/environment";
import {ContratoEstatusUpdate, ProveedorContratoResponse, ProveedorContratoUpdate} from '../../../../../core/models/proveedor-contrato.interface';
import { LoaderService } from '../../../../../shared/loader/services/loader.service';
import { ProveedorContratoUpdateResponse } from '../../../../../core/models/proveedor-contrato-complementos.interface';

@Injectable({ providedIn: 'root'})
export class RegistrosExternosService {
  readonly _url_proveedor_contrato: string = `${environment.api.expedientes}datos/`;
  readonly _url_proveedor_contrato_update: string = environment.api.complementarios;
  readonly _url_estatus_contrato_update: string = environment.api.actualizarestatus;
  constructor(
              private httpClient: HttpClient,
              private loaderService: LoaderService
            ) { }

  getProveedorContrato(id: number): Observable<ProveedorContratoResponse> {
     this.loaderService.activar();
    return this.httpClient.get<ProveedorContratoResponse>(`${this._url_proveedor_contrato}${id}`);
  }

  updateProveedorContrato(id:number, contrato: ProveedorContratoUpdate) {
    return this.httpClient.put<ProveedorContratoUpdateResponse>(`${this._url_proveedor_contrato_update}${id}`, contrato);
  }

  actualizarDocumento(id: number, formData: FormData): Observable<any> {
    return this.httpClient.post<any>(`${environment.api.expedientes}upload/${id}`, formData, {headers: {}});
  }

  eliminarDocumento(id: number): Observable<any>{
    return this.httpClient.delete<any>(`${environment.api.eliminarformato}${id}`);
  }

  updateEstatusContrato(estusContrato: ContratoEstatusUpdate) {
    return this.httpClient.put<any>(`${this._url_estatus_contrato_update}`, estusContrato);
  }
}

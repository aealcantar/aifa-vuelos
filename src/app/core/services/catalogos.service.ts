import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CatalogosService {
  readonly _url_base: string = environment.api.catalogos;
  readonly _url_tipo_organismo: string = 'tipoProveedor'
  readonly _url_estatus: string = 'estatusContrato'

  constructor(private httpClient: HttpClient) {
  }

  obtenerTipoOrganismo(): Observable<any> {
    return this.httpClient.get<Observable<any>>(`${this._url_base}${this._url_tipo_organismo}`);
  }

  obtenerEstatus(): Observable<any> {
    return this.httpClient.get<Observable<any>>(`${this._url_base}${this._url_estatus}`);
  }
}

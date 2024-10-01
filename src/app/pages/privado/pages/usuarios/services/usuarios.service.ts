import {Injectable} from '@angular/core';
import {NuevoUsuario} from "../models/nuevo-usuario.interface";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {environment} from "../../../../../../environments/environment";
import {Observable} from "rxjs";
import {ResponseUsuarios} from "../models/response-usuarios.interface";
import {BusquedaUsuario} from "../models/busqueda-usuario.interface";

@Injectable()
export class UsuariosService {
  readonly _url_base: string = environment.api.usuarios;
  readonly _url_crear_usuario: string = 'crear';
  readonly _url_listado_usuario: string = 'obtener-todos';
  readonly _url_filtros_usuario: string = 'buscar';

  constructor(private httpClient: HttpClient) {
  }

  crearUsuario(usuario: NuevoUsuario): Observable<HttpResponse<any>> {
    return this.httpClient.post<HttpResponse<any>>(`${this._url_base}${this._url_crear_usuario}`, usuario);
  }

  paginarUsuarios(page: number = 1, perPage: number = 10): Observable<ResponseUsuarios>  {
    const params: HttpParams = new HttpParams()
      .append('page', page.toString())
      .append('perPage', perPage.toString());
    return this.httpClient.get<ResponseUsuarios>(`${this._url_base}${this._url_listado_usuario}`, {params});
  }

  paginarUsuariosFiltrado(page: number = 1, perPage: number = 10, busqueda: BusquedaUsuario): Observable<any>  {
    const params: HttpParams = new HttpParams()
      .append('page', page.toString())
      .append('perPage', perPage.toString());
    return this.httpClient.post<any>(`${this._url_base}${this._url_filtros_usuario}`, busqueda, {params});
  }
}

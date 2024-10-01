import {Injectable} from '@angular/core';
import {environment} from "../../../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {RegistroResponse} from "../models/registro-response.interface";
import {NuevoRegistro} from "../models/nuevo-registro.interface";
import {RequestRegistro} from "../models/request-registro.interface";
import {AceptarRechazarRegistro} from "../models/aceptar-rechazar-registro.interface";
import {NuevoCorreoRegistro} from "../models/nuevo-correo-registro.interface";
import {RespuestaNuevoRegistro} from "../models/respuesta-nuevo-registro.interface";

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  readonly _url_base: string = environment.api.empresa;
  readonly _url_crear_contratos: string = 'createEmpresa';
  readonly _url_listado_contratos: string = 'empresaSearch';
  readonly  _url_buscar_contrato: string = 'datos';
  readonly  _url_validar_contrato: string = 'update-status';
  readonly _url_enviar_correo_aprobado: string = 'contrato/aprobado';
  readonly _url_enviar_correo_rechazado: string = 'contrato/recahzado';

  constructor(private httpClient: HttpClient) {
  }

  paginarContratosFiltrado(page: number = 1, perPage: number = 10, busqueda: {} | RequestRegistro = {}): Observable<RegistroResponse> {
    return this.httpClient.post<RegistroResponse>(`${this._url_base}${this._url_listado_contratos}`,
      {page, perPage, search: busqueda});
  }

  paginarContratosInicial(page: number = 1, perPage: number = 10, busqueda: {} | RequestRegistro = {}): Observable<RegistroResponse> {
    return this.httpClient.post<RegistroResponse>(`${this._url_base}${this._url_listado_contratos}`,
      {page, perPage, search: busqueda, sortBy: "estatusContrato", sortOrder: "asc"});
  }

  crearContrato(contrato: NuevoRegistro): Observable<RespuestaNuevoRegistro> {
    return this.httpClient.post<RespuestaNuevoRegistro>(`${this._url_base}${this._url_crear_contratos}`,
      contrato);
  }

  obtenerContrato(id: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.api.expedientes}${this._url_buscar_contrato}/${id}`);
  }

  validarContrato(validacion: AceptarRechazarRegistro): Observable<any> {
    return this.httpClient.put<any>(`${environment.api.expedientes}${this._url_validar_contrato}`, validacion);
  }

  enviarCorreoNuevoRegistro(correo: NuevoCorreoRegistro): Observable<any> {
    return this.httpClient.post<any>(`${environment.api.notificaciones}nuevo`, correo)
  }

  descargarDocumento(id: number): Observable<Blob> {
    return this.httpClient.get(`${environment.api.expedientes}generate-pdf/${id}`, { responseType: 'blob' });
  }

  enviarCorreoValidacionAceptada(id: number): Observable<any> {
    return this.httpClient.post<any>(`${environment.api.notificaciones_usuario}${this._url_enviar_correo_aprobado}`, { ID_CONTRATO_ACUERDO: id})
  }

  enviarCorreoValidacionRechazada(id: number): Observable<any> {
    return this.httpClient.post<any>(`${environment.api.notificaciones_usuario}${this._url_enviar_correo_rechazado}`, { ID_CONTRATO_ACUERDO: id})
  }
}

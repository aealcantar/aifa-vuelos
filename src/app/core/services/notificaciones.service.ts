import {Injectable} from '@angular/core';
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ResetPassRequest} from "../models/reset-pass-request.interface";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {CodeRequest} from "../models/code-request.interface";
import {ChangePassRequest} from "../models/change-pass-request.interface";
import {CodeResponse} from "../models/code-response.interface";

@Injectable()
export class NotificacionesService {
  private readonly _url_recuperar_pass: string = 'resetpwd';
  private readonly _url_verificar_codigo: string = 'verifica-codigo';
  private readonly _url_new_pass: string = 'nueva-contrasena';
  private readonly _url_read_notify: string = 'leido';

  constructor(
    private httpClient: HttpClient,
  ) {
  }

  restaurarPassword(resetRequest: ResetPassRequest): Observable<any> {
    return this.httpClient.post<any>(`${environment.api.notificaciones}${this._url_recuperar_pass}`,
      resetRequest, {observe: 'response'});
  }

  verificarCodigo(codeRequest: CodeRequest): Observable<HttpResponse<CodeResponse>> {
    return this.httpClient.post<CodeResponse>(`${environment.api.password}${this._url_verificar_codigo}`,
      codeRequest, {observe: 'response'});
  }

  cambiarPassword(changePassRequest: ChangePassRequest): Observable<any> {
    return this.httpClient.post<any>(`${environment.api.password}${this._url_new_pass}`,
      changePassRequest, {observe: 'response'});
  }

  obtenerNotificaciones(): Observable<any> {
    return this.httpClient.get(`${environment.api.notificaciones_usuario}`, {observe: 'response'});
  }

  cerrarNotificacion(id: number) {
    return this.httpClient.post<any>(`${environment.api.notificaciones_usuario}${this._url_read_notify}`,
      { ID_NOTIFICACION: id }, {observe: 'response'});
  }
}

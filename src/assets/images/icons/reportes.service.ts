import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { FiltroDeterminaciones } from '../pages/privado/pages/determinaciones/models/filtroDeterminaciones.interface';
import {
  SolicitudPaginadoRiesgosResolucion
} from '../pages/privado/pages/determinaciones/models/solicitudPaginadoRiesgos.interface';


@Injectable()
export class ReportesService {
  private readonly _base: string = environment.api.reportes;
  private readonly _declaracion: string = 'xls/declaraciones';
  private readonly _declaracion_riesgos: string = 'xls/riesgos';
  private readonly _declaracionSeleccionada: string = 'xls/declaraciones-lista';
  private readonly _confronta: string = 'xls/resultadosConfronta';
  private readonly _confrontaSeleccionada: string = 'xls/resultadosConfrontaLista';

  constructor(private httpClient: HttpClient) { }

  generarExcelDeclaraciones(filtros: FiltroDeterminaciones | {}): Observable<Blob>  {
    return this.httpClient.post(`${this._base}${this._declaracion}`, filtros, { responseType: 'blob' });
  }

  generarExcelDeclaracionesSeleccionadas(filtros: any): Observable<Blob>  {
    return this.httpClient.post(`${this._base}${this._declaracionSeleccionada}`, filtros, { responseType: 'blob' });
  }

  generarExcelRiesgos(solicitud: SolicitudPaginadoRiesgosResolucion): Observable<Blob>  {
    return this.httpClient.post(`${this._base}${this._declaracion_riesgos}`, solicitud, { responseType: 'blob' });
  }

  generarExcelConfronta(filtros: FiltroDeterminaciones | {}): Observable<Blob>  {
    return this.httpClient.post(`${this._base}${this._confronta}`, filtros, { responseType: 'blob' });
  }

  generarExcelConfrontaSeleccionada(filtros: any): Observable<Blob>  {
    return this.httpClient.post(`${this._base}${this._confrontaSeleccionada}`, filtros, { responseType: 'blob' });
  }
}

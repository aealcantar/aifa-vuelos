import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { LoaderService } from '../../shared/loader/services/loader.service';
import { environment } from '../../../environments/environment';
import { ActivarCuenta } from '../models/activar-cuenta.interface';
import { ValidarIdentidad } from '../models/validar-identidad..interface';
import {
  GenerarNuevoCodigo,
  SolicitarReferenciaCodigoResponse,
  VerificaCodigo,
  VerificaCodigoResponse,
} from '../models/verifica-codigo.interface';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  constructor(private _http: HttpClient, private loaderService: LoaderService) {}

  obtenerIdentidad(codigo: string): Observable<ActivarCuenta> {
    this.loaderService.activar();
    return this._http.post<ActivarCuenta>(environment.api.identidad, { codigo }).pipe(
      map((response: ActivarCuenta) => {
        this.loaderService.desactivar();
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.desactivar();
        return this.handleError(error);
      }),
    );
  }

  generarValidacion(validar: ValidarIdentidad): Observable<any> {
    this.loaderService.activar;
    return this._http.post<any>(environment.api.validacion, validar).pipe(
      map((response: any) => {
        this.loaderService.desactivar();
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.desactivar();
        return this.handleError(error);
      }),
    );
  }

  verificarCodigo(verificaCodigo: VerificaCodigo): Observable<VerificaCodigoResponse> {
    this.loaderService.activar();
    return this._http.post<any>(environment.api.verificar, verificaCodigo).pipe(
      map((response: any) => {
        this.loaderService.desactivar();
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        this.loaderService.desactivar();
        return this.handleError(error);
      }),
    );
  }

  solicitarReferenciaCodigo(codigo: string): Observable<SolicitarReferenciaCodigoResponse> {
    this.loaderService.activar();
    return this._http.post<SolicitarReferenciaCodigoResponse>(environment.api.codigonuevo, { codigo });
  }

  solicitarNuevoCodigo(generarCodigo: GenerarNuevoCodigo): Observable<any> {
    return this._http.post<any>(environment.api.generarnuevocodigo, generarCodigo);
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    this.loaderService.desactivar();
    if (error.status === HttpStatusCode.Unauthorized) {
      console.log('Warnnig: ', 'Codigo No Valido');
    } else if (error.status === HttpStatusCode.InternalServerError) {
      console.log('error: ', 'Error interno');
    } else if (error.status === HttpStatusCode.BadRequest) {
      console.log('mensaje: ', error.error.msg);
    }
    return throwError(() => error);
  }
}

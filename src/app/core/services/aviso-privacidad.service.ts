import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoaderService } from '../../shared/loader/services/loader.service';
import { Observable, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class AvisoPrivacidadService {

  constructor(private _Http: HttpClient, private loaderService: LoaderService ) { }

  aceptarAvisoPrivacidad(id_usuario: number): Observable<any> {
    this.loaderService.activar();
    return this._Http.post<any>(environment.api.aviso, {id_usuario}).pipe(finalize(()=>this.loaderService.desactivar()));

  }
}

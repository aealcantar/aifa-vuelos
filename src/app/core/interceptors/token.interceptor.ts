import {AutenticacionService, TOKEN_FORTALEZA} from "../services/autenticacion.service";
import {HttpHandlerFn, HttpInterceptorFn, HttpRequest} from "@angular/common/http";
import {inject} from "@angular/core";
import {MessageService} from "primeng/api";
import {catchError, switchMap, throwError} from "rxjs";
import {RefreshTokenSuccess} from "../models/refresh-token-success.interface";

export const tokenInterceptor: HttpInterceptorFn = (request: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const autenticacionService: AutenticacionService = inject(AutenticacionService);
  const messageService: MessageService = inject(MessageService);

  const token: string | null = localStorage.getItem(TOKEN_FORTALEZA);

  if (token) {

    if (request.url.includes('refresh')) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next(request);
    }

    if (autenticacionService.isTokenExpired(token)) {
      console.log('Token expirado, intentando refrescar...');

      // Retorna el observable refreshToken y se continúa con el flujo
      return autenticacionService.refreshToken().pipe(
        catchError((error) => {
          console.error('Error al refrescar el token:', error);
          messageService.add({
            severity: 'error',
            summary: '¡Error!',
            detail: 'Ha ocurrido un error al refrescar el token',
          });
          autenticacionService.cerrarSesionInterceptor();
          return throwError(() => error);
        }),
        switchMap((success: RefreshTokenSuccess) => {
          console.log('Token refrescado con éxito:', success.access_token);
          // Clonar la request con el nuevo token refrescado
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${success.access_token}`,
            },
          });
          return next(request);
        })
      );
    }

    // Si el token no ha expirado
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Retornar la request en caso de que no haya expirado o no haya token
  return next(request);
};

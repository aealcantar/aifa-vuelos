import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {TiempoSesion} from "./core/models/tiempo-sesion.interface";
import {TIEMPO_MAXIMO_SESION} from "./utils/tokens";
import {HttpClient, provideHttpClient, withInterceptors} from "@angular/common/http";
import {LoaderService} from "./shared/loader/services/loader.service";
import {MessageService} from "primeng/api";
import {provideAnimations} from "@angular/platform-browser/animations";
import {AutenticacionService} from "./core/services/autenticacion.service";
import {tokenInterceptor} from "./core/interceptors/token.interceptor";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";

export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimations(),
    {
      provide: TIEMPO_MAXIMO_SESION,
      useValue: {
        // tiempoMaximoInactividad: 600,
        tiempoMaximoInactividad: 12000,
        mostrarAlertaCuandoFalten: 60,
      } as TiempoSesion,
    },
    provideHttpClient(
      withInterceptors([tokenInterceptor])
    ),
    LoaderService,
    MessageService,
    AutenticacionService,
    importProvidersFrom(
      TranslateModule.forRoot({
        defaultLanguage: 'es',
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
      })
    ),
  ]
};

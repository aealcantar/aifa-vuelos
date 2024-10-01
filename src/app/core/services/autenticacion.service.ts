import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {MessageService} from "primeng/api";
import {BehaviorSubject, catchError, finalize, Observable, Subject, Subscription, throwError} from "rxjs";
import {map} from "rxjs/operators";
import {UsuarioSesion} from "../models/usuario-sesion.interface";
import {LoginRequest} from "../models/login-request.interface";
import {LoginSuccess} from "../models/login-success.interface";
import {BnNgIdleService} from "bn-ng-idle";
import {JwtHelperService} from "@auth0/angular-jwt";
import {TIEMPO_MAXIMO_SESION} from "../../utils/tokens";
import {TiempoSesion} from "../models/tiempo-sesion.interface";
import {environment} from "../../../environments/environment";
import {JwtPayload} from "../models/jwt-payload.interface";
import {LoaderService} from "../../shared/loader/services/loader.service";
import {RefreshTokenSuccess} from "../models/refresh-token-success.interface";

/*
* Es la clave que se usa para guardar el token en localStorage, NO ES EL VALOR.
*/
export const TOKEN_FORTALEZA = '78fn38fj2093k0f982n';

@Injectable()
export class AutenticacionService {
  subsSesionInactivaTemporizador!: Subscription;
  private usuarioSesionSubject = new BehaviorSubject<UsuarioSesion | null>(null);
  private jwtHelperService = new JwtHelperService();
  private mostrarAlertaSesionInactivaSubject = new Subject<boolean>();
  mostrarAlertaSesionInactivaS: Observable<boolean> = this.mostrarAlertaSesionInactivaSubject.asObservable();

  private readonly _url_login: string = 'login';
  private readonly _url_logout: string = 'logout';
  private readonly _url_refresh: string = 'refresh';
  private readonly _url_base: string = environment.api.autenticacion;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private inactividadSesionService: BnNgIdleService,
    @Inject(TIEMPO_MAXIMO_SESION) private tiempoSesion: TiempoSesion,
    private messageService: MessageService,
    private loaderService: LoaderService,
  ) {
    this.recuperarSesion();
  }

  get usuarioSesion() {
    return this.usuarioSesionSubject.value;
  }

  recuperarSesion(): void {
    const token: string | null = localStorage.getItem(TOKEN_FORTALEZA);

    try {
      token ? this.crearSesion(token) : this.cerrarSesion();
    } catch (e) {
      this.cerrarSesion();
    }

  }

  login(loginRequest: LoginRequest): Observable<HttpResponse<LoginSuccess>> {
    return this.httpClient.post<LoginSuccess>(`${this._url_base}${this._url_login}`,
      loginRequest, {observe: 'response'})
      .pipe(map(this.manejoTokenRespuestaLogin.bind(this)));
  }

  private manejoTokenRespuestaLogin(respuesta: HttpResponse<LoginSuccess>): HttpResponse<LoginSuccess> {
    if (!respuesta.body) {
      throw new Error('Respuesta vacía del servidor.');
    }

    const {access_token} = respuesta.body;

    if (!access_token) {
      throw new Error('El token de acceso no se encontró en la respuesta.');
    }

    this.crearSesion(access_token);
    return respuesta;
  }

  private crearSesion(token: string): void {
    this.agregarUsuarioSesion(token);
    this.agregarTokenLocalStorage(token);
    this.cargarCookies(token);
    this.iniciarTemporizadorSesion();
  }

  cerrarSesion(): void {
    const urlActual: string = this.router.url;
    if (urlActual.includes('/publico')) return;
    this.logout();
    this.detenerTemporizadorSesion();
    this.removerTokenLocalStorage();
    this.removerUsuarioSesion();
    this.redirigirPantallaInicioSesion();
  }

  cerrarSesionInterceptor(): void {
    this.detenerTemporizadorSesion();
    this.removerTokenLocalStorage();
    this.removerUsuarioSesion();
    this.redirigirPantallaInicioSesion();
  }


  private agregarUsuarioSesion(accessToken: string): void {
    const usuarioSesion: UsuarioSesion = this.obtenerUsuarioJwtPayload(accessToken);
    this.usuarioSesionSubject.next(usuarioSesion);
  }

  private cargarCookies(accessToken: string): void {
    const {indPrivacidad} = this.obtenerUsuarioJwtPayload(accessToken);
    localStorage.setItem('privacity', indPrivacidad.toString());
  }

  private agregarTokenLocalStorage(accessToken: string): void {
    localStorage.setItem(TOKEN_FORTALEZA, accessToken);
  }

  private logout(): void {
    const token: string = localStorage.getItem(TOKEN_FORTALEZA) as string;
    if (!token) return;
    this.loaderService.activar();
    this.httpClient.post<void>(`${this._url_base}${this._url_logout}`, {})
      .pipe(finalize(() => this.loaderService.desactivar()))
      .subscribe({
        error: (error: HttpErrorResponse) => this.manejoErrorCerrarSesion(error),
      });
  }

  manejoErrorCerrarSesion(error: HttpErrorResponse): void {
    console.error(error);
    const ERROR_MESSAGE: string = 'Ha ocurrido un error al intentar finalizar la sesión';
    this.messageService.add({severity: 'error', summary: '¡Error!', detail: ERROR_MESSAGE});
  }

  refreshToken(): Observable<RefreshTokenSuccess> {
    return this.httpClient.post<RefreshTokenSuccess>(`${this._url_base}${this._url_refresh}`, {})
      .pipe(map((success: RefreshTokenSuccess) => {
          this.crearSesion(success.access_token);
          return success;
        }),
      );
  }

  isTokenExpired(token: string): boolean {
      const expirationDate = this.jwtHelperService.getTokenExpirationDate(token);

      if (!expirationDate) {
        return true; // Si no se puede obtener la fecha de expiración, el token no es válido
      }

      const now = new Date();
      const timeBeforeExpiration = 15 * 60 * 1000; // 15 minutos antes de la expiración

      // Compara si el token expira dentro de los próximos 15 minutos
      return expirationDate.getTime() - now.getTime() < timeBeforeExpiration;
  }

  iniciarTemporizadorSesion(): void {
    this.subsSesionInactivaTemporizador = this.inactividadSesionService
      .startWatching(this.tiempoSesion.tiempoMaximoInactividad - this.tiempoSesion.mostrarAlertaCuandoFalten)
      .subscribe((estaElUsuarioConSesionInactiva: boolean) => {
        if (estaElUsuarioConSesionInactiva) {
          this.mostrarAlertaSesionInactivaSubject.next(true);
        }
      });
  }

  detenerTemporizadorSesion(): void {
    if (!this.subsSesionInactivaTemporizador) return;
    this.inactividadSesionService?.stopTimer();
    this.subsSesionInactivaTemporizador.unsubscribe();
  }

  removerTokenLocalStorage(): void {
    localStorage.clear();
  }

  removerUsuarioSesion(): void {
    this.usuarioSesionSubject.next(null);
  }

  redirigirPantallaInicioSesion(): void {
    void this.router.navigate(['/publico/inicio-sesion']);
  }

  obtenerUsuarioJwtPayload(token: string): UsuarioSesion | never {
    const jwtPayload: JwtPayload | null = this.jwtHelperService.decodeToken<JwtPayload>(token);
    if (jwtPayload) {
      return {
        curp: jwtPayload.curp,
        nombre: jwtPayload.nombre,
        rol: jwtPayload.rol,
        idRol: jwtPayload.idRol,
        indPrivacidad: jwtPayload.indPrivacidad,
        idUsuario: jwtPayload.sub
      } as UsuarioSesion;
    } else {
      throw new Error('Error al intentar obtener los datos del payload en el token JWT');
    }
  }
}

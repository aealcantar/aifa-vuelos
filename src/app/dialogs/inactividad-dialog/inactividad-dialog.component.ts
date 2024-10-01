import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {DialogModule} from "primeng/dialog";
import {ButtonDirective} from "primeng/button";
import {Subscription} from "rxjs";
import {AutenticacionService} from "../../core/services/autenticacion.service";
import {TIEMPO_MAXIMO_SESION} from "../../utils/tokens";
import {TiempoSesion} from "../../core/models/tiempo-sesion.interface";

@Component({
  selector: 'app-inactividad-dialog',
  standalone: true,
  imports: [
    DialogModule,
    ButtonDirective
  ],
  templateUrl: './inactividad-dialog.component.html',
  styleUrl: './inactividad-dialog.component.scss'
})
export class InactividadDialogComponent implements OnInit, OnDestroy {
  dialogFinalizacionSesion: boolean = false;
  subMostrarAlertaSesionInactiva!: Subscription;


  timerIniciado: boolean = false;
  intervaloId: any;

  constructor(private autenticacionService: AutenticacionService,
              @Inject(TIEMPO_MAXIMO_SESION) private tiempoSesion: TiempoSesion,) {
  }

  ngOnInit(): void {
    this.subMostrarAlertaSesionInactiva = this.autenticacionService.mostrarAlertaSesionInactivaS.subscribe(
      (mostrarAlerta: boolean) => this.mostrarAlertaSesionInactiva(mostrarAlerta),
    );
  }

  mostrarAlertaSesionInactiva(mostrarAlerta: boolean): void {
    if (!mostrarAlerta || this.timerIniciado) return;
    this.timerIniciado = true;
    this.iniciarTemporizador(this.tiempoSesion.mostrarAlertaCuandoFalten);
  }

  iniciarTemporizador(duracion: number): void {
    let temporizador: number = duracion;
    this.intervaloId = setInterval(() => this.actualizarTemporizador(--temporizador), 1000);
  }

  actualizarTemporizador(temporizador: number): void {
    this.dialogFinalizacionSesion = true;
    if (temporizador >= 0) return;
    clearInterval(this.intervaloId);
    this.cerrarSesion();
  }


  continuarSesion(): void {
    this.dialogFinalizacionSesion = false;
    clearInterval(this.intervaloId);
    this.timerIniciado = false;
  }

  cerrarSesion(): void {
    this.dialogFinalizacionSesion = false;
    clearInterval(this.intervaloId);
    this.autenticacionService.cerrarSesion();
  }

  ngOnDestroy(): void {
    this.subMostrarAlertaSesionInactiva?.unsubscribe();
  }
}

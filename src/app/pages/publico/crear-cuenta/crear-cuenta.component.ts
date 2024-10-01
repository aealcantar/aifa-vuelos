import {Component, signal, WritableSignal} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {MessageService} from 'primeng/api';
import {HttpErrorResponse} from '@angular/common/http';
import { ButtonModule } from 'primeng/button';
import { finalize, mergeMap, forkJoin } from 'rxjs';
import {TabViewModule} from "primeng/tabview";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {NgClass} from "@angular/common";
import {ButtonDirective} from "primeng/button";
import {RouterLink} from "@angular/router";
import {CardModule} from "primeng/card";
import {PATRON_CORREO, PATRON_CURP} from "../../../utils/constants";
import {RegistroService} from '../../../core/services/registro.service';
import {ValidarIdentidad} from '../../../core/models/validar-identidad..interface';
import {AsidePublicoAifaComponent} from "../../../components/aside-publico-aifa/aside-publico-aifa.component";
import { LoaderService } from '../../../shared/loader/services/loader.service';
import { GenerarNuevoCodigo, SolicitarReferenciaCodigoResponse } from '../../../core/models/verifica-codigo.interface';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-crear-cuenta',
  standalone: true,
  imports: [
    AsidePublicoAifaComponent,
    TabViewModule,
    ReactiveFormsModule,
    InputTextModule,
    NgClass,
    ButtonDirective,
    RouterLink,
    CardModule,
    ButtonModule
  ],
  providers: [RegistroService, LoaderService],
  templateUrl: './crear-cuenta.component.html',
  styleUrl: './crear-cuenta.component.scss'
})
export class CrearCuentaComponent {
  registroForm!: FormGroup;
  indiceTab: WritableSignal<number> = signal(0);
  codigo: string;
  caducado_expirado: boolean; 
  get f() {
    return this.registroForm.controls;
  }
  constructor(private formBuilder: FormBuilder,
              private activatedRoute : ActivatedRoute,
              private registroService: RegistroService,
              private messageService: MessageService,
              private loader: LoaderService ) {

    this.codigo = this.activatedRoute.snapshot.params['id'];
    this.registroForm = this.crearFormularioRegistro();
    if(this.codigo) this.loadServices();
    this.caducado_expirado = false;
  
  }
/*
  crearFormularioRegistro() {
    return this.formBuilder.group({
      curp: [{value: '', disabled: true}, [Validators.required, Validators.pattern(PATRON_CURP)]],
      nombre: [{value: '', disabled: true}, Validators.required],
      correo: [{value: '', disabled: true}, [Validators.required, Validators.email, Validators.pattern(PATRON_CORREO)]],
      confirmarCorreo: ['', [Validators.required, Validators.email, Validators.pattern(PATRON_CORREO)]],
    }, {
      validators: [
        correosDiferentesValidator,
      ]
    });
  }
  */
  crearFormularioRegistro() {
    return this.formBuilder.group({
      curp: [{value: '', disabled: true}, [Validators.required, Validators.pattern(PATRON_CURP)]],
      nombre: [{value: '', disabled: true}, Validators.required],
      correo: [{value: '', disabled: true}, [Validators.required, Validators.email, Validators.pattern(PATRON_CORREO)]],
      confirmarCorreo: ['', [Validators.required, Validators.email, Validators.pattern(PATRON_CORREO)]],
    });
  }
  confirmarCorreos(): boolean {
    const nuevoCorreo = this.f['correo'];
    const confirmarCorreo = this.f['confirmarCorreo'];
   
    return nuevoCorreo && confirmarCorreo &&  String(nuevoCorreo.value).toUpperCase() === String(confirmarCorreo.value).toUpperCase() ;
  }
  irSiguienteSeccion(): void {

    if(this.confirmarCorreos()) {

      let dato: ValidarIdentidad = { url: `${window.location.protocol}//${window.location.host}/publico/registro-inicial/`, curp: this.f['curp'].value, correo: this.f['correo'].value }
  
      this.registroService.generarValidacion(dato)
      .subscribe({
          next: (resp) => { this.mostrarAlertaValidacion(resp.msg); this.indiceTab.update(value => value + 1); },
          error: (err) => this.manejoIdentidadError(err),
          complete: () => { }
      });
      
    } else {
      this.mostrarAlertaIdentidadError("El correo ingresado no coincide con el registrado en el sistema, favor de verificar.")
    }
  }

  nuevocodigo(): void{
    this.registroService.solicitarReferenciaCodigo(this.codigo)
    .pipe(
      finalize(() => this.loader.desactivar() ),
      mergeMap((respReferenia: SolicitarReferenciaCodigoResponse) => {
        
        const url = `${window.location.protocol}//${window.location.host}/publico/crear-cuenta`;
        const curp = respReferenia.curp;
        const correo = respReferenia.email;
        const generarCodigo: GenerarNuevoCodigo = {url, curp, dest: [correo]};

        return forkJoin({
          codigo: this.registroService.solicitarNuevoCodigo(generarCodigo),      
        })
      }))
    .subscribe({
      next: (resp) => { this.mostrarAlertaValidacion("El codigo fue solicitado exitosamente, revisar tu correo electronico"); console.log(resp) },
      error: (err) => { this.manejoIdentidadError(err) }
    })
  }

  loadServices(): void {

    this.registroService.obtenerIdentidad(this.codigo)
    .subscribe( {
                  next: (data) => { this.mostrarAlertaValidacion(data.msg); this.f['curp'].setValue(data.curp); this.f['nombre'].setValue(data.nombre_completo); this.f['correo'].setValue(data.email); },
                  error: (err) => {this.manejoIdentidadError(err)},
                  complete: () => {}
                });
  }

  manejoIdentidadError(error: HttpErrorResponse): void {
    if(error.status === 401) {this.mostrarAlertaIdentidadError(error.error.message)}
    if(error.status === 400) {this.caducado_expirado=true; this.mostrarAlertaIdentidadError("Código de acceso expirado")}
  }

  mostrarAlertaIdentidadError(mensaje: string) {
    this.messageService.add({
      severity: 'error',
      summary: '¡Error!',
      detail: mensaje,
    });
  }

  mostrarAlertaValidacion(mensaje: string){
    this.messageService.add({
      severity: 'success',
      summary: '¡Exito!',
      detail: mensaje,
    });
  }

  protected readonly console = console;
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {HeaderPrivadoAifaComponent} from "./components/header-privado-aifa/header-privado-aifa.component";
import {FooterPrivadoAifaComponent} from "./components/footer-privado-aifa/footer-privado-aifa.component";
import {ToastModule} from "primeng/toast";
import {MessageService} from "primeng/api";
import {LoaderComponent} from "./shared/loader/components/loader/loader.component";
import {AlertaComponent} from "./shared/alerta/components/alerta/alerta.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderPrivadoAifaComponent, FooterPrivadoAifaComponent, ToastModule, LoaderComponent, AlertaComponent],
  providers: [MessageService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent  {
  title: string = 'Sistema Fortaleza';


}

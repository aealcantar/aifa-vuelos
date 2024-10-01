import {AfterViewInit, Component, OnInit} from '@angular/core';
import {HeaderPrivadoAifaComponent} from "../../components/header-privado-aifa/header-privado-aifa.component";
import {FooterPrivadoAifaComponent} from "../../components/footer-privado-aifa/footer-privado-aifa.component";
import {RouterModule, RouterOutlet} from "@angular/router";
import {MenuPrivadoAifaComponent} from "../../components/menu-privado-aifa/menu-privado-aifa.component";
import {InactividadDialogComponent} from "../../dialogs/inactividad-dialog/inactividad-dialog.component";
import {PrimeNGConfig} from "primeng/api";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-privado',
  standalone: true,
  imports: [
    HeaderPrivadoAifaComponent,
    FooterPrivadoAifaComponent,
    RouterOutlet,
    MenuPrivadoAifaComponent,
    InactividadDialogComponent,
    RouterModule
  ],
  template: `
    <app-header-privado-aifa/>
    <app-menu-privado-aifa/>
    <router-outlet></router-outlet>
    <app-inactividad-dialog/>
    <app-footer-privado-aifa/>
  `,
  styleUrls: ['./privado.component.scss']
})
export class PrivadoComponent implements OnInit, AfterViewInit  {

  constructor(private primengConfig: PrimeNGConfig, private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    this.translateService.setDefaultLang('es');
  }

  translateChange(lang: string) {
    this.translateService.use(lang);
    this.translateService.get('primeng').subscribe((res) => this.primengConfig.setTranslation(res));
  }

  ngAfterViewInit(): void {
    this.translateChange('es');
  }
}

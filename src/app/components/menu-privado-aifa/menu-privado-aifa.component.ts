import {Component, OnInit, signal, WritableSignal} from '@angular/core';
import {Router} from "@angular/router";
import {MenuItem} from "primeng/api";
import {TabMenuModule} from "primeng/tabmenu";
import {CommonModule} from "@angular/common";
import {AutenticacionService} from "../../core/services/autenticacion.service";

@Component({
  selector: 'app-menu-privado-aifa',
  standalone: true,
  imports: [TabMenuModule, CommonModule],
  templateUrl: './menu-privado-aifa.component.html',
  styleUrl: './menu-privado-aifa.component.scss'
})
export class MenuPrivadoAifaComponent implements OnInit {
  items: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);
  activeItem: WritableSignal<MenuItem | undefined> = signal<MenuItem | undefined>(undefined);
  rol: WritableSignal<number> = signal(0);

  constructor(private router: Router,
              private authService: AutenticacionService) {
    const rol = authService.usuarioSesion?.idRol;
    if (rol) {
      this.rol.update(value => rol);
    }
  }

  ngOnInit(): void {
    this.items.set([
      {
        label: 'Inicio',
        icon: 'icon-empresas',
        route: '/privado/gestion-contratos',
        role: [2],
        command: (): void => {
          void this.router.navigate(['/privado/gestion-contratos']);
        }
      },
      {
        label: 'Empresas',
        icon: 'icon-empresas',
        route: '/privado/registros',
        role: [1],
        command: (): void => {
          void this.router.navigate(['/privado/registros']);
        }
      },
      {
        label: 'Expedientes',
        icon: 'icon-expedientes',
        role: [1, 2],
        disabled: true
      },
      {
        label: 'Tarjetas',
        icon: 'icon-tarjetas',
        role: [1, 2],
        disabled: true
      },
      {
        label: 'Citas',
        icon: 'icon-citas',
        role: [1, 2],
        disabled: true
      },
      {
        label: 'Usuarios',
        icon: 'icon-usuarios',
        role: [1, 2],
        route: '/privado/usuarios',
        command: (): void => {
          void this.router.navigate(['/privado/usuarios']);
        }
      }
    ]);

    const currentRoute = this.router.url;
    const foundItem = this.items().find(item => currentRoute.includes(item['route']));

    if (foundItem) {
      this.activeItem.set(foundItem);
    }
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem.set(event);
  }
}

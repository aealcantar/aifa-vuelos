import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { CommonModule } from '@angular/common';
import { AutenticacionService } from '../../core/services/autenticacion.service';

@Component({
  selector: 'app-menu-privado-aifa',
  standalone: true,
  imports: [TabMenuModule, CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './menu-privado-aifa.component.html',
  styleUrl: './menu-privado-aifa.component.scss',
})
export class MenuPrivadoAifaComponent implements OnInit {
  items: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);
  activeItem: WritableSignal<MenuItem | undefined> = signal<MenuItem | undefined>(undefined);
  rol: WritableSignal<number> = signal(0);

  constructor(private router: Router, private authService: AutenticacionService) {
    const rol = authService.usuarioSesion?.idRol;
    if (rol) {
      this.rol.update((value) => rol);
    }
  }

  ngOnInit(): void {
    this.items.set([
      {
        label: 'Aeropasillos',
        icon: 'icon-empresas',
        route: '/privado/aeropasillos',
        role: [1],
        command: (): void => {
          void this.router.navigate(['/privado/aeropasillos']);
        },
      },
      // {
      //   label: 'Registros',
      //   icon: 'icon-empresas',
      //   route: '/privado/registros',
      //   role: [1],
      //   command: (): void => {
      //     void this.router.navigate(['/privado/registros']);
      //   },
      // },
      {
        label: 'Aerocares',
        icon: 'icon-expedientes',
        route: '/privado/aerocares',
        role: [1],
        command: (): void => {
          void this.router.navigate(['/privado/aerocares']);
        },
      },
      {
        label: 'Empleados AIFA',
        icon: 'icon-usuarios',
        role: [1, 2],
        route: '/privado/usuarios',
        command: (): void => {
          void this.router.navigate(['/privado/usuarios']);
        },
      },
      {
        label: 'Empleados Alta',
        icon: 'icon-usuarios',
        role: [1, 2],
        route: '/privado/usuarios',
        command: (): void => {
          void this.router.navigate(['/privado/usuarios']);
        },
      },
    ]);

    const currentRoute = this.router.url;
    const foundItem = this.items().find((item) => currentRoute.includes(item['route']));

    if (foundItem) {
      this.activeItem.set(foundItem);
    }
  }

  onActiveItemChange(event: MenuItem) {
    this.activeItem.set(event);
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { menu } from '../interface/menu.interface';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [RouterLink,RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {




listMenu:menu[]=[];


ngOnInit(): void {
  this.listMenu=[
    {
      ruta:'/libros',
      pagina:'Libros'
    },
    {
      ruta:'/clientes',
      pagina:'Clientes'
    },
    {
      ruta:'/registrar-pedido',
      pagina:'Registrar Pedido'
    },
    {
      ruta:'/reportes',
      pagina:'Reportes'
    }
  ];
}



}

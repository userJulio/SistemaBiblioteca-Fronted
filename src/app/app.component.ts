import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MenuComponent } from "./shared/menu/menu.component";
import { ClienteService } from './clientes/services/cliente.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'SistemaBiblioteca';
  router=inject(Router);



  ngOnInit(): void {
   
  }

}

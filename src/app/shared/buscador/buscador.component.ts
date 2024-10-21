import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { map, Observable } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { Clientes } from '../../clientes/interfaces/cliente.interface';
import { Libros } from '../../libros/interfaces/libros.interface';

@Component({
  selector: 'app-buscador',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  templateUrl: './buscador.component.html',
  styleUrl: './buscador.component.css',
})
export class BuscadorComponent implements OnInit {
  buscadorInput = new FormControl('');
  listFiltroValores: Clientes[] | Libros[]= [];

  @Input()
  listaCliente: Clientes[] | Libros[]= [];

  @Output()
  inputBusqueda = new EventEmitter<string>();

  ngOnInit(): void {
   
    this.listFiltroValores = this.listaCliente || [];
    this.buscadorInput.valueChanges.subscribe((valores) => {

      let busqueda = !valores ? '' : valores;
      this.listFiltroValores = this.listaCliente.slice(0,10);
      this.inputBusqueda.emit(busqueda);
    });
  }
}

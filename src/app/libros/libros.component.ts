import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { BuscadorComponent } from '../shared/buscador/buscador.component';
import { MatDialog } from '@angular/material/dialog';
import { Libros } from './interfaces/libros.interface';
import { LibroService } from './services/libro.service';

@Component({
  selector: 'app-libros',
  standalone: true,
  imports: [MatTableModule,
    MatPaginatorModule,
    JsonPipe,
    BuscadorComponent,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './libros.component.html',
  styleUrl: './libros.component.css'
})
export class LibrosComponent implements OnInit {

  libroservice= inject(LibroService);
  displayedColumns: string[] = [
    'id',
    'nombre',
    'autor',
    'isbn',
    'estado',
    'acciones',
  ];
  dataSource: Libros[] = [];

  TotalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  pageEvent?: PageEvent;
  pageIndexPaginator: number = 0;
  dialog = inject(MatDialog);

  ngOnInit(): void {
    
    this.getLibros('',this.pageIndex,this.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.TotalRecords = e.length;
    this.pageSize = e.pageSize;
    this.pageIndexPaginator = e.pageIndex;
    let pagina = this.pageIndexPaginator + 1;
    //this.getClientes(this.inputBusqueda, paginaCliente, this.pageSize);
  }

  getLibros(nombre:string,pageindex:number,pagesize:number){

    this.libroservice.getLibros(nombre,pageindex,pagesize)
        .subscribe((resultado)=>{
          if (!resultado) return;
          if (resultado) {
            let totalregistro = resultado.headers.get('TotalRegistros');
            if (resultado.body) {
              let libro = resultado.body;
              let libroData = !libro.data ? [] : libro.data;
              this.dataSource = libroData;
              let cantidadRegistros = !totalregistro ? 0 : Number(totalregistro);
              this.TotalRecords = cantidadRegistros;
            }
          }
        });
  }

  BuscarLibro(valorbusqueda:string){

  }

  actualizarLibro(idlibro:number){

  }
  eliminarLibro(idlibro:number){

  }

}

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
import { AddLibroComponent } from './components/add-libro/add-libro.component';
import { UpdateLibroComponent } from './components/update-libro/update-libro.component';
import { ModalConfirmationComponent } from '../shared/modal-confirmation/modal-confirmation.component';

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
  inputBusqueda: string = '';
  listaBusqueda:string[]=[];
  titleBusqueda:string="Por Nombre";

  ngOnInit(): void {
    
    this.getLibros('',this.pageIndex,this.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.TotalRecords = e.length;
    this.pageSize = e.pageSize;
    this.pageIndexPaginator = e.pageIndex;
    let pagina = this.pageIndexPaginator + 1;
    this.getLibros(this.inputBusqueda, pagina, this.pageSize);
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
              this.listaBusqueda= this.dataSource.map(x=>x.nombre);
            }
          }
        });
  }

  BuscarLibro(valorbusqueda:string){
   this.inputBusqueda=valorbusqueda;
   this.pageSize = 10;
   this.pageIndexPaginator = 0;
   let paginaindex = this.pageIndexPaginator + 1;
   this.getLibros(this.inputBusqueda, paginaindex, this.pageSize);
  }

  OpenRegisterDialog() {
    const dialogRef = this.dialog.open(AddLibroComponent);

    dialogRef.afterClosed().subscribe((result) => {    
      console.log("resultado",result);
      if (result) {
        let pageIndex= this.pageIndexPaginator+1;
        this.getLibros('', pageIndex, this.pageSize);
      }
    });
  }

  actualizarLibro(idlibro:number){

    this.libroservice.getLibroById(idlibro).subscribe((resultado) => {
   
      if (!resultado) return;

      if(!resultado.data){
        alert("El libro no existe");
        return;
      }

      if (resultado.data) {
      
        const dialogRef = this.dialog.open(UpdateLibroComponent, {
          data: resultado.data,
        });
    
        dialogRef.afterClosed().subscribe((result) => {
         
          if (result) {
            let pageIndex= this.pageIndexPaginator+1;
            this.getLibros('', pageIndex, this.pageSize);
          }
        });
      }
     

    });

  }
  eliminarLibro(idlibro:number){
    this.libroservice.getLibroById(idlibro).subscribe((resultado) => {
      if (!resultado) {
        return;
      }
      if (!resultado.data) {
        alert('El libro no existe');
        return;
      }

      if (resultado.data) {

        const dialogRef = this.dialog.open(ModalConfirmationComponent, {
          data: resultado.data,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.deleteLibros(idlibro);
          }
        });
      }
    });
  }
  deleteLibros(idlibro: number) {
    this.libroservice.deleteLibros(idlibro).subscribe((resultado) => {
      if (!resultado) return;
      if (resultado) {
        if (resultado.succes) {
          let pageIndex= this.pageIndexPaginator+1;
          this.getLibros('', pageIndex, this.pageSize);
        }
      }
    });
  }

}

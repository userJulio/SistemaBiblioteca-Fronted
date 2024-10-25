import { Component, inject, OnInit } from '@angular/core';
import { BuscadorComponent } from '../shared/buscador/buscador.component';
import { Clientes } from '../clientes/interfaces/cliente.interface';
import { JsonPipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { Libros } from '../libros/interfaces/libros.interface';
import { ClienteService } from '../clientes/services/cliente.service';
import { ReporteService } from './services/reporte.service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-reporte-pedido',
  standalone: true,
  imports: [ MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    JsonPipe,
    BuscadorComponent,
    MatButtonModule,
    MatIconModule,],
  templateUrl: './reporte-pedido.component.html',
  styleUrl: './reporte-pedido.component.css'
})
export class ReportePedidoComponent implements OnInit {

  servicecliente=inject(ClienteService);
  servicereporte=inject(ReporteService);
  titleBusqueda:string="DNI";
  listaBusqueda:string[]=[];
  DniBusqueda:string="";
  displayedColumns: string[] = [
    'id',
    'nombre',
    'autor',
    'isbn',
    'estado'
  ];
  dataSource: Libros[] = [];
  cliente?:Clientes;
  flatError:number=0;

  ngOnInit(): void {
    
  }

  BuscarbyDni(valorBusqueda:string){
  this.DniBusqueda=valorBusqueda;
    this.getDniCliente(valorBusqueda);
  }

  getDniCliente(dni:string){
    this.servicecliente.getClientesByDni(dni).subscribe((cliente)=>{
      if(!cliente) return;

      if(cliente.data){
        this.listaBusqueda=cliente.data.map(x=>x.dni);
        this.cliente=cliente.data[0];
      }
    });
  }

  buscarLibrosAlquilados(){
    this.flatError=0;
  if(this.DniBusqueda=="") {
    this.dataSource=[];

    return};

    this.servicereporte.getLibrosAlquiladosByDni(this.DniBusqueda).subscribe((libros)=>{
        if(!libros) return;
        if(libros.data){
          this.dataSource= libros.data.filter((x,indice,array)=>this.getValoresUnicos(x.id,indice,array));
          this.flatError=1;
        }
    });
  }

  getValoresUnicos(id:number,indice:number,array:Libros[]){
    let ids= array.map(x=>x.id);
     return  ids.findIndex((element)=>element==id)==indice;
  }

}

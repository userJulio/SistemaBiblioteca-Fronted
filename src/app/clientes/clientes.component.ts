import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { ClienteService } from './services/cliente.service';
import { MatTableModule } from '@angular/material/table';
import { Clientes, ResponseClientes } from './interfaces/cliente.interface';
import { PageEvent, MatPaginatorModule } from '@angular/material/paginator';
import { JsonPipe } from '@angular/common';
import { BuscadorComponent } from '../shared/buscador/buscador.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { RegisterClientesComponent } from './register-clientes/register-clientes.component';
import { UpdateClientesComponent } from './update-clientes/update-clientes.component';
import { ModalConfirmationComponent } from '../shared/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    JsonPipe,
    BuscadorComponent,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css',
})
export class ClientesComponent implements OnInit {
  clienteservice = inject(ClienteService);
  clienteResponse?: ResponseClientes;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellidos',
    'dni',
    'edad',
    'acciones',
  ];
  dataSource: Clientes[] = [];

  TotalRecords: number = 0;
  pageSize: number = 10;
  pageIndex: number = 1;
  pageEvent?: PageEvent;
  pageIndexPaginator: number = 0;
  dialog = inject(MatDialog);
  ClienteActualizar?: Clientes;

  inputBusqueda: string = '';
  listaBusqueda:string[]=[];
  titleBusqueda:string="Por Nombre";

  ngOnInit(): void {
    this.getClientes('', this.pageIndex, this.pageSize);
  }

  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.TotalRecords = e.length;
    this.pageSize = e.pageSize;
    this.pageIndexPaginator = e.pageIndex;
    let paginaCliente = this.pageIndexPaginator + 1;
    this.getClientes(this.inputBusqueda, paginaCliente, this.pageSize);
  }

  getClientes(nombre: string, pageindex: number, pageSize: number) {
    this.clienteservice
      .getClientes(nombre, pageindex, pageSize)
      .subscribe((resultado) => {
        if (!resultado) return;
        if (resultado) {
          let totalregistro = resultado.headers.get('TotalRegistros');
          if (resultado.body) {
            let cliente = resultado.body;
            let clientesData = !cliente.data ? [] : cliente.data;
            this.dataSource = clientesData;
            let cantidadRegistros = !totalregistro ? 0 : Number(totalregistro);
            this.TotalRecords = cantidadRegistros;
            this.listaBusqueda=this.dataSource.map(x=>x.nombre);
          }
        }
      });
  }

  BuscarbyNombre(nombre: string) {
    this.inputBusqueda = nombre;
    this.pageSize = 10;
    this.pageIndexPaginator = 0;
    let paginaindex = this.pageIndexPaginator + 1;
    this.getClientes(this.inputBusqueda, paginaindex, this.pageSize);
  }

  OpenRegisterDialog() {
    const dialogRef = this.dialog.open(RegisterClientesComponent, {
      data: { name: 'Juan', edad: 18 },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.getClientes('', 1, this.pageSize);
      }
    });
  }

  actualizarCliente(idCliente: number) {
    this.clienteservice.getClienteById(idCliente).subscribe((resultado) => {
      if (!resultado) return;

      if (!resultado.data) {
        alert('El cliente no existe');
        return;
      }

      if (resultado.data) {
        this.ClienteActualizar = resultado.data;
        const dialogRef = this.dialog.open(UpdateClientesComponent, {
          data: this.ClienteActualizar,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.getClientes('', 1, this.pageSize);
          }
        });
      }
    });
  }
  eliminarCliente(idCliente: number) {
    this.clienteservice.getClienteById(idCliente).subscribe((resultado) => {
      if (!resultado) {
        return;
      }
      if (!resultado.data) {
        alert('El cliente no existe');
        return;
      }

      if (resultado.data) {
        this.ClienteActualizar = resultado.data;
        const dialogRef = this.dialog.open(ModalConfirmationComponent, {
          data: this.ClienteActualizar,
        });

        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.deleteCliente(idCliente);
          }
        });
      }
    });
  }

  deleteCliente(idcliente: number) {
    this.clienteservice.deleteClientes(idcliente).subscribe((resultado) => {
      if (!resultado) return;
      if (resultado) {
        if (resultado.succes) {
          this.getClientes('', 1, this.pageSize);
        }
      }
    });
  }
}

import { JsonPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MatDialogClose,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { BuscadorComponent } from '../shared/buscador/buscador.component';
import { ClienteService } from '../clientes/services/cliente.service';
import {
  ClientePost,
  Clientes,
} from '../clientes/interfaces/cliente.interface';
import { LibroService } from '../libros/services/libro.service';
import { Libros, LibrosRequest } from '../libros/interfaces/libros.interface';
import { MatDialog } from '@angular/material/dialog';
import { RegisterClientesComponent } from '../clientes/register-clientes/register-clientes.component';
import { RegistrarPedidoRequest } from './interfaces/registrar-pedido.interface';
import { RegistrarpedidoService } from './services/registrarpedido.service';

@Component({
  selector: 'app-registrar-pedido',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    JsonPipe,
    MatIconModule,
    MatTableModule,
    BuscadorComponent,
  ],
  templateUrl: './registrar-pedido.component.html',
  styleUrl: './registrar-pedido.component.css',
})
export class RegistrarPedidoComponent implements OnInit {
  displayedColumns: string[] = [
    'nombre',
    'autor',
    'isbn',
    'estado',
    'acciones',
  ];
  dataSource: LibrosRequest[] = [];
  libroagregado?: LibrosRequest;
  dialog = inject(MatDialog);
  servicioCliente = inject(ClienteService);
  servicioLibros = inject(LibroService);
  servicePedido = inject(RegistrarpedidoService);
  listClientes: Clientes[] = [];
  listaLibros: Libros[] = [];
  listaByDni: string[] = [];
  listaByIsbn: string[] = [];
  DniBusqeuda: string = '';
  IsbnBusqueda: string = '';
  titleBusqueda: string = 'DNI';
  titleBusquedaIsbn: string = 'ISBN';
  clientePost?: ClientePost;
  fechaP: string = '';
  horaP: string = '';
  LimpiarCLiente:ClientePost={
    nombre:'',
    apellidos:'',
    dni:'',
    edad:0
  };
  mensajeClienteNoExiste="";

  fb = inject(FormBuilder);
  formPedido: FormGroup = this.fb.group({
    fechaPedido: ['', [Validators.required]],
    nombre: [{ value: '', disabled: true }, [Validators.required]],
    apellidos: [{ value: '', disabled: true }, [Validators.required]],
    dni: [{ value: '', disabled: true }, [Validators.required]],
    edad: [{ value: '', disabled: true }, [Validators.required]],
  });

  ngOnInit(): void {
    this.formPedido.controls['fechaPedido'].setValue(this.obtenerFechaActual());
    this.cambiarFormatoFecha(this.obtenerFechaActual());
    this.formPedido.controls['fechaPedido'].valueChanges.subscribe((fecha) => {
      let fechastring = fecha as string;
      this.cambiarFormatoFecha(fechastring);
    });
  }

  obtenerFechaActual(): string {
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hour =
      date.getHours() < 10
        ? '0' + date.getHours().toString()
        : date.getHours().toString();
    let mins =
      date.getMinutes() < 10
        ? '0' + date.getMinutes().toString()
        : date.getMinutes().toString();

    if (month < 10) {
      return `${year}-0${month}-${day}T${hour}:${mins}`;
    } else {
      return `${year}-${month}-${day}T${hour}:${mins}`;
    }
  }

  cambiarFormatoFecha(fecha: string) {
    let fechaformat = fecha.split('T')[0].replaceAll('-', '/');
    let fechaOrdenada =
      fechaformat.split('/')[2] +
      '/' +
      fechaformat.split('/')[1] +
      '/' +
      fechaformat.split('/')[0];
    let horaformat = fecha.split('T')[1];
    this.fechaP = fechaOrdenada;
    this.horaP = horaformat;
  }

  getClientesByDni(dni: string) {
    this.servicioCliente.getClientesByDni(dni).subscribe((clientes) => {
      if (!clientes) return;
      if (clientes.data) {
        this.listClientes = clientes.data;
        this.listaByDni = this.listClientes.map((x) => x.dni);

        this.clientePost = clientes.data.map((x) => {
          let cliente: ClientePost;
          cliente = {
            nombre: x.nombre,
            apellidos: x.apellidos,
            edad: x.edad,
            dni: x.dni,
          };
          return cliente;
        })[0];
        console.log('cliente bsuqueda', this.clientePost);
      }
    });
  }

  getLibrosByIsbn(isbn: string) {
    this.servicioLibros.getLibrosByIsbn(isbn).subscribe((libros) => {
      if (!libros) return;
      if (libros.data) {
        this.listaLibros = libros.data.filter((x) => x.estado);
        this.listaByIsbn = this.listaLibros.map((x) => x.isbn);
        this.libroagregado = this.listaLibros.map((x) => {
          let libros: LibrosRequest;
          libros = {
            nombre: x.nombre,
            autor: x.autor,
            isbn: x.isbn,
            estado: x.estado,
          };
          return libros;
        })[0];
        console.log('Libro Agregado', this.libroagregado);
      }
    });
  }

  buscarByDni(dni: string) {
    this.DniBusqeuda = dni;
    this.getClientesByDni(this.DniBusqeuda);
  }

  buscarByIsbn(isbn: string) {
    this.IsbnBusqueda = isbn;
    this.getLibrosByIsbn(this.IsbnBusqueda);
  }

  agregarLibroPedido() {
    if (this.libroagregado) {
      if (
        this.libroagregado.isbn.toLowerCase() == this.IsbnBusqueda.toLowerCase()
      ) {
        let yaExisteLibro = this.dataSource.some(
          (x) => x.isbn === this.libroagregado?.isbn
        );
        if (!yaExisteLibro) {
          this.dataSource = [...this.dataSource, this.libroagregado];
        }
      }
    }
  }

  buscaryMostrarClientes() {
    
    for (const [key, value] of Object.entries(this.LimpiarCLiente)) {
      this.formPedido.controls[key].setValue(value);
    }
    this.mensajeClienteNoExiste="";
    if (this.clientePost) {
      if (
        this.clientePost.dni.toLowerCase() == this.DniBusqeuda.toLowerCase()
      ) {
        this.mostrarDatosCliente(this.clientePost);
      }
    }
    if(!this.clientePost){
      this.mensajeClienteNoExiste="El cliente no existe";
    }

  }

  mostrarDatosCliente(cliente: ClientePost) {
    if (cliente) {
      for (const [key, value] of Object.entries(cliente)) {
        this.formPedido.controls[key].setValue(value);
      }
    }
  }
  eliminarLibro(isbn: string) {
    this.dataSource = this.dataSource.filter((x) => x.isbn !== isbn);
  }

  crerNuevoCliente() {
    const dialogRef = this.dialog.open(RegisterClientesComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
         this.mensajeClienteNoExiste="";
        if (result.data) {        
          this.getClienteById(result.data);
        }
      }
    });
  }

  getClienteById(idcliente: number) {
    this.servicioCliente.getClienteById(idcliente).subscribe((clientenuevo) => {
      if (!clientenuevo) return;
      if (clientenuevo.data) {
        this.clientePost = {
          nombre: clientenuevo.data.nombre,
          apellidos: clientenuevo.data.apellidos,
          edad: clientenuevo.data.edad,
          dni: clientenuevo.data.dni,
        };
        console.log('cliente bsuqueda', this.clientePost);
        this.mostrarDatosCliente(this.clientePost);
      }
    });
  }

  guardarPedido() {
    if (this.formPedido.invalid || this.dataSource.length <= 0) {
      this.formPedido.markAllAsTouched();
      return;
    }

    const clientepost: ClientePost = {
      nombre: this.formPedido.controls['nombre'].value,
      apellidos: this.formPedido.controls['apellidos'].value,
      dni: this.formPedido.controls['dni'].value,
      edad: this.formPedido.controls['edad'].value,
    };

    const objPedido: RegistrarPedidoRequest = {
      fechaPedido: this.fechaP,
      horaPedido: this.horaP,
      cliente: clientepost,
      libros: this.dataSource,
      estado: true,
    };
    console.log('pedido', objPedido);
    this.servicePedido.guardarPedido(objPedido).subscribe((pedido) => {
      if (!pedido) return;
      if (pedido.data) {
        if (pedido.data > 0) {
          alert('Se registro correctamente el pedido');
        }
      }
    });
  }
}

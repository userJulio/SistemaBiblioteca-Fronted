import { Component, inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { ClienteService } from '../services/cliente.service';
import { ClientePost, Clientes } from '../interfaces/cliente.interface';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-update-clientes',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    ReactiveFormsModule,
  ],
  templateUrl: './update-clientes.component.html',
  styleUrl: './update-clientes.component.css',
})
export class UpdateClientesComponent implements OnInit {
  dialogRef = inject(MatDialogRef<UpdateClientesComponent>);
  data = inject<Clientes>(MAT_DIALOG_DATA);
  clienteserivcio = inject(ClienteService);
  fb = inject(FormBuilder);
  mensajeError = '';
 mensajeErrorUpdate="";

  formregistro: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    apellidos: ['', [Validators.required]],
    dni: ['', [Validators.required, Validators.maxLength(10)]],
    edad: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
  });

  constructor() {
    console.log('data actualizar', this.data);
  }
  ngOnInit(): void {
    if (!this.data) {
      this.mensajeError = 'El cliente no existe';
    }
    if (this.data) {
      this.obtenerDatosCliente();
    }
  }

  validarCampo(campo: string): boolean | null {
    return (
      this.formregistro.controls[campo].errors &&
      this.formregistro.controls[campo].touched
    );
  }

  mostrarMensajeError(campo: string): string | null {
    if (this.formregistro.controls[campo].hasError('required')) {
      return `El campo ${campo} es requerido`;
    }
    if (this.formregistro.controls[campo].hasError('maxlength')) {
      return 'El campo debe ser como máximo de 10 caracteres';
    }
    if (this.formregistro.controls[campo].hasError('min')) {
      return 'El campo debe ser como mínimo 18';
    }
    if (this.formregistro.controls[campo].hasError('max')) {
      return 'El campo debe ser como máximo 100';
    }

    return null;
  }

  obtenerDatosCliente() {
    this.formregistro.reset(this.data);
    console.log('formulario', this.formregistro.value);
  }
  get ClienteActual(): ClientePost {
    const cliente = this.formregistro.value as ClientePost;
    return cliente;
  }
  validarBotonGuardar(): boolean {
    if (this.formregistro.invalid) {
      return true;
    }
    return false;
  }

  get ObtenerMensajeError():string{
    return this.clienteserivcio.errorMessage;
  }

  onGuardar() {
    if (!this.formregistro.valid) {
      this.formregistro.markAllAsTouched();
      return;
    }
    let id = this.data.id as number;
    this.clienteserivcio
      .updateCliente(id, this.ClienteActual)
      .subscribe((clientCreado) => {
        if (!clientCreado) {
          this.mensajeErrorUpdate=this.ObtenerMensajeError;
          return;
        }
        if (clientCreado) {

          if (clientCreado.succes) {
            this.dialogRef.close(true);
          } else {
            this.dialogRef.close(false);
          }
        }
      });
  }
  onclose() {
    this.dialogRef.close(false);
  }
}

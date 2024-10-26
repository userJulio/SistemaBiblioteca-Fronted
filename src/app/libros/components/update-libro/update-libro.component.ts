import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Libros, LibrosRequest } from '../../interfaces/libros.interface';
import { LibroService } from '../../services/libro.service';
import { MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-update-libro',
  standalone: true,
  imports: [ MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,
    MatSelectModule,
    ReactiveFormsModule,],
  templateUrl: './update-libro.component.html',
  styleUrl: './update-libro.component.css'
})
export class UpdateLibroComponent implements OnInit {
  dialogRef = inject(MatDialogRef<UpdateLibroComponent>);
  data = inject<Libros>(MAT_DIALOG_DATA);
  libroservicio = inject(LibroService);
  fb = inject(FormBuilder);
  mensajeError = '';
  mensajeUpdateError="";

  formregistro: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    autor: ['', [Validators.required]],
    isbn: ['', [Validators.required, Validators.maxLength(50)]],
    estado: ['', [Validators.required]],
  });

  constructor() {
    console.log('data actualizar', this.data);
  }
  ngOnInit(): void {
    if (!this.data) {
      this.mensajeError = 'El libro no existe';
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
      return 'El campo debe ser como máximo de 50 caracteres';
    }

    return null;
  }
  get obtenerMensajeError():string {
    return this.libroservicio.mensajeError;
  }

  obtenerDatosCliente() {
    this.formregistro.reset(this.data);
    console.log('formulario', this.formregistro.value);
  }
  get libroActual(): LibrosRequest {
    const libro = this.formregistro.value as LibrosRequest;
    return libro;
  }
  validarBotonGuardar(): boolean {
    if (this.formregistro.invalid) {
      return true;
    }
    return false;
  }
  onGuardar() {
    if (!this.formregistro.valid) {
      this.formregistro.markAllAsTouched();
      return;
    }
    let id = this.data.id as number;
    this.libroservicio
      .updateLibros(id, this.libroActual)
      .subscribe((clientCreado) => {
        if (!clientCreado) {
          this.mensajeUpdateError=this.obtenerMensajeError;
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

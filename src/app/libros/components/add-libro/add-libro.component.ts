import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { LibrosRequest } from '../../interfaces/libros.interface';
import { LibroService } from '../../services/libro.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-libro',
  standalone: true,
  imports: [ MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatCardModule,
    ReactiveFormsModule,
    MatSelectModule,
    JsonPipe],
  templateUrl: './add-libro.component.html',
  styleUrl: './add-libro.component.css'
})
export class AddLibroComponent {
  dialogRef = inject(MatDialogRef<AddLibroComponent>);
  // data = inject<DialogData>(MAT_DIALOG_DATA);
 fb=inject(FormBuilder);
 serviciolibro= inject(LibroService);
 mensajeErrorAdd:string="";


 formRegistro:FormGroup=this.fb.group({
  nombre:['',[Validators.required]],
  autor:['',[Validators.required]],
  isbn: ['',[Validators.required,Validators.maxLength(50)]],
  estado: ['',[Validators.required]]
 });

 validarBotonGuardar():boolean{
  if(this.formRegistro.invalid){
    return true;
  }
  return false;
}

get LibroActual(): LibrosRequest{
   const libro= this.formRegistro.value as LibrosRequest;
   return libro;
}
validarCampo(campo:string):boolean | null{
  return this.formRegistro.controls[campo].errors && this.formRegistro.controls[campo].touched;
}

mostrarMensajeError(campo: string): string | null{

 if(this.formRegistro.controls[campo].hasError('required')){
   return  `El campo ${campo} es requerido`; 
 }

 if(this.formRegistro.controls[campo].hasError('maxlength')){
  return `El campo ${campo} debe ser como máximo de 50 caracteres`;
 }

  return null;
}
get obtenerMensajeError():string {
  return this.serviciolibro.mensajeError;
}

onGuardar(){
  if(!this.formRegistro.valid) {
    this.formRegistro.markAllAsTouched();
    return;
  }
 
   this.serviciolibro.AddLibros(this.LibroActual).subscribe((librocreado)=>{
   
    if(!librocreado){
      this.mensajeErrorAdd=this.obtenerMensajeError;
      return;
    }
    if(librocreado){
      this.dialogRef.close(true);
    }

   });
    


}
onclose(){
  this.dialogRef.close(false);
}


}

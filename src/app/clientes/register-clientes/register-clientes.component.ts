import { Component, inject } from '@angular/core';
import { FormBuilder,ReactiveFormsModule,  FormGroup, FormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { ClientePost } from '../interfaces/cliente.interface';
import { ClienteService } from '../services/cliente.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-register-clientes',
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
    MatCardModule,
    ReactiveFormsModule,
    JsonPipe
  ],
  templateUrl: './register-clientes.component.html',
  styleUrl: './register-clientes.component.css'
})
export class RegisterClientesComponent {

     dialogRef = inject(MatDialogRef<RegisterClientesComponent>);
    // data = inject<DialogData>(MAT_DIALOG_DATA);
   fb=inject(FormBuilder);
   servicioCliente= inject(ClienteService);
   mensajeErrorAdd:string="";

   formRegistro:FormGroup=this.fb.group({
    nombre:['',[Validators.required]],
    apellidos:['',[Validators.required]],
    dni: ['',[Validators.required,Validators.maxLength(10)]],
    edad: ['',[Validators.required,Validators.max(100),Validators.min(18)]]
   });

validarBotonGuardar():boolean{
  if(this.formRegistro.invalid){
    return true;
  }
  return false;
}

get ClienteActual(): ClientePost{
   const cliente= this.formRegistro.value as ClientePost;
   return cliente;
}
validarCampo(campo:string):boolean | null{
  return this.formRegistro.controls[campo].errors && this.formRegistro.controls[campo].touched;
}

mostrarMensajeError(campo: string): string | null{

 if(this.formRegistro.controls[campo].hasError('required')){
   return  `El campo ${campo} es requerido`; 
 }
 if(this.formRegistro.controls[campo].hasError('maxlength')){
  return "El campo debe ser como máximo de 10 caracteres";
 }
 if(this.formRegistro.controls[campo].hasError('min')){
  return "El campo debe ser como mínimo 18";
 }
 if(this.formRegistro.controls[campo].hasError('max')){
  return "El campo debe ser como máximo 100";
 }

  return null;
}
get ObtenerMensajeError():string{
  return this.servicioCliente.errorMessage;
}

onGuardar(){
  if(!this.formRegistro.valid) {
    this.formRegistro.markAllAsTouched();
    return;
  }
 
   this.servicioCliente.AddCliente(this.ClienteActual).subscribe((clientCreado)=>{
    
    if(!clientCreado){
      this.mensajeErrorAdd= this.ObtenerMensajeError;
      return;
    }
    if(clientCreado){
      this.dialogRef.close(clientCreado);
    }
    
   });
    


}
onclose(){
  this.dialogRef.close(false);
}




}

import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ClienteService } from '../../clientes/services/cliente.service';
import { MatButtonModule } from '@angular/material/button';
import { Clientes } from '../../clientes/interfaces/cliente.interface';

@Component({
  selector: 'app-modal-confirmation',
  standalone: true,
  imports: [ MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogClose,],
  templateUrl: './modal-confirmation.component.html',
  styleUrl: './modal-confirmation.component.css'
})
export class ModalConfirmationComponent {

  dialogRef = inject(MatDialogRef<ModalConfirmationComponent>);
  data = inject<Clientes>(MAT_DIALOG_DATA);
  
  onSave(){
    this.dialogRef.close(true);
  }

  onCancel(){
    this.dialogRef.close(false);
  }


}

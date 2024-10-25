import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment.development';
import { catchError, Observable, of } from 'rxjs';
import { RegistrarPedidoRequest, ResponseRegistrarPedidoPost } from '../interfaces/registrar-pedido.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistrarpedidoService {

  http= inject(HttpClient);
  url= enviroment.baseUrl;

  guardarPedido(pedido: RegistrarPedidoRequest):Observable<ResponseRegistrarPedidoPost | null>{
    
    return this.http.post<ResponseRegistrarPedidoPost>(`${this.url}/api/order/RegistrarPedido`,pedido)
          .pipe(
            catchError(err=> of(null))
          );
  }
}

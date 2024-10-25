import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { reportePedidoResponse } from '../interfaces/reportepedido.interface';
import { enviroment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  http=inject(HttpClient);
  url=enviroment.baseUrl;
  constructor() { }

  getLibrosAlquiladosByDni(dni:string):Observable<reportePedidoResponse | null>{

    const parametros= new HttpParams()
      .set('Dni',dni);
    return this.http.get<reportePedidoResponse>(`${this.url}/api/order/ReporteLibrosAlquiladorByDni`,{params:parametros})
            .pipe(
              catchError(err=> of(null))
            );

  }

}

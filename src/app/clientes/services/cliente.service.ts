import { HttpClient, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment.development';
import { catchError, map, Observable, observeOn, of, tap } from 'rxjs';
import {  ClientePost, Clientes, RequestCliente, ResponseClienteById, ResponseClientes } from '../interfaces/cliente.interface';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  http= inject(HttpClient);
  url= enviroment.baseUrl;
  errorMessage:string="";

  constructor() { }


  getClientes(nombre: string,pageindex:number,pageSize:number): Observable<HttpResponse<ResponseClientes> | null>{

    const parametros= new HttpParams()
          .set('nombre',nombre)
          .set('Page',pageindex)
          .set('RecordsPerPage',pageSize);
  

          
    return this.http.get<ResponseClientes>(`${this.url}/api/customer`,{params: parametros, observe:'response'})
        .pipe(
            catchError( error=> of(null))
        );
  }

  AddCliente(cliente: ClientePost):Observable<RequestCliente | null>{

  return this.http.post<RequestCliente>(`${this.url}/api/customer/GuardarCliente`,cliente)
          .pipe(
            catchError( err=> {
               this.errorMessage=err.error.errorMessage;
              return of(null);
              }
            )
          );

  }

  updateCliente(idcliente: number,cliente:ClientePost):Observable<ResponseClientes | null>{
 

    return this.http.put<ResponseClientes>(`${this.url}/api/customer/updateCustomer?idCliente=${idcliente}`,cliente)
                .pipe(
                  catchError( err=> {
                    this.errorMessage=err.error.errorMessage;
                    return of(null);
                  })
                  );
  }

  deleteClientes(idcliente:number):Observable<ResponseClientes | null>{

    return this.http.delete<ResponseClientes>(`${this.url}/api/customer/deleteCustomer?idCliente=${idcliente}`)
              .pipe(
                catchError(err=> of(null))
              );
  }

   getClienteById(idCliente:number): Observable<ResponseClienteById | null>
   {
      const parametros=new HttpParams()
          .set('idcustomer',idCliente);

      return this.http.get<ResponseClienteById>(`${this.url}/api/customer/GetCustomerById`,{params: parametros})
                .pipe(
                  catchError(err=> of(null))
                );
   }

   getClientesByDni(Dni:string):Observable<ResponseClientes | null>{
    const parametros=new HttpParams()
    .set('Dni',Dni);
    return this.http.get<ResponseClientes>(`${this.url}/api/customer/GetClienteByDni`,{params:parametros})
              .pipe(
                catchError(err=> of(null))
              );
              
   }

}

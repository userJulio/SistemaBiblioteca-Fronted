import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { enviroment } from '../../../environments/environment.development';
import { catchError, Observable, of } from 'rxjs';
import { Libros, LibrosRequest, ResponseLibroById, ResponseLibros, ResponseLibrosPost } from '../interfaces/libros.interface';

@Injectable({
  providedIn: 'root'
})
export class LibroService {

  http= inject(HttpClient);
  url= enviroment.baseUrl;

  getLibros(nombre:string, pageIndex:number,pageSize:number):Observable<HttpResponse<ResponseLibros> | null>{

    const parametros= new HttpParams()
    .set('nombre',nombre)
    .set('Page',pageIndex)
    .set('RecordsPerPage',pageSize);

    return this.http.get<ResponseLibros>(`${this.url}/api/book`,{params:parametros,observe:'response'})
        .pipe(
          catchError(err=> of(null))
        );

  }

  AddLibros(libro:LibrosRequest):Observable<ResponseLibrosPost | null>{

    return this.http.post<ResponseLibrosPost>(`${this.url}/api/book`,libro)
                .pipe(
                  catchError(err=> of(null))
                );

  }

  updateLibros(idLibro:number, libro:LibrosRequest):Observable<ResponseLibros | null>{

     return this.http.put<ResponseLibros>(`${this.url}/api/book/${idLibro}`,libro)
                .pipe(
                  catchError(err=> of(null))
                );
  }

  deleteLibros(idLibro:number):Observable<ResponseLibros | null>{

    return this.http.delete<ResponseLibros>(`${this.url}/api/book/${idLibro}`)
              .pipe(
                catchError(err=> of(null))
              );
  }
   
  getLibroById(idlibro:number):Observable<ResponseLibroById | null>{

    const parametro= new HttpParams()
        .set("idlibro",idlibro);
    return this.http.get<ResponseLibroById>(`${this.url}/api/book/GetBookById`,{params:parametro})
    .pipe(
      catchError(err=> of(null))
    );
  }

  getLibrosByIsbn(isbn:string):Observable<ResponseLibros | null>{

    const parametro= new HttpParams()
    .set("isbn",isbn);

    return this.http.get<ResponseLibros>(`${this.url}/api/book/GeLibroeByIsbn`,{params:parametro})
                  .pipe(
                    catchError(err=> of(null))
                  );

  }


}

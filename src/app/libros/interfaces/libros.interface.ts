
export interface ResponseLibros{
    data?: Libros[] | null;
    succes:boolean;
    errorMessage:string | null;
}

export interface Libros{
    id:number;
    nombre:string;
    autor:string;
    isbn:string;
    estado:boolean;
}

export interface ResponseLibrosPost{
   data: number;
   succes:boolean;
   errorMessage:string | null;
}

export interface ResponseLibroById{
    data?: Libros | null;
    errorMessage: string | null;
    succes: boolean;
}

export interface LibrosRequest{
    nombre:string;
    autor:string;
    isbn:string;
    estado:boolean;
}
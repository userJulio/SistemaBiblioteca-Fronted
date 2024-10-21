

export interface ResponseClientes{
   data?: Clientes[] | null;
   errorMessage: string | null;
   succes: boolean;
}


export interface Clientes{
    id: Number;
    nombre: string;
    apellidos: string;
    dni: string;
    edad: number;
}

export interface ClientePost{
    nombre:string;
    apellidos:string;
    dni:string;
    edad:number;
}

export interface RequestCliente{
    data: number | null;
    errorMessage: string | null;
    succes: boolean;
}
export interface ResponseClienteById{
    data?: Clientes| null;
    errorMessage: string | null;
    succes: boolean;
}


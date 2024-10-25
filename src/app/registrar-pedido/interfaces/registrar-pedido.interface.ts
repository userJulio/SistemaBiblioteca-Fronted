import { ClientePost } from "../../clientes/interfaces/cliente.interface";
import { LibrosRequest } from "../../libros/interfaces/libros.interface";

export interface RegistrarPedidoRequest{
    fechaPedido:string;
    horaPedido:string;
    cliente:ClientePost;
    libros:LibrosRequest[];
    estado:boolean;
}

export interface ResponseRegistrarPedidoPost{
    data: number | null;
    succes: boolean;
    errorMessage:string | null;
}
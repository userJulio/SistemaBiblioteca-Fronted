import { Libros } from "../../libros/interfaces/libros.interface";

export interface reportePedidoResponse{

    data: Libros[] | null;
    succes:boolean;
    errorMessage:string | null;
}
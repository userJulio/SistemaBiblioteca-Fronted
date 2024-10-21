import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:"libros",
        loadComponent: ()=>import('./libros/libros.component').then(c=>c.LibrosComponent)
    },
    {
        path:"clientes",
        loadComponent: ()=>import('./clientes/clientes.component').then(c=>c.ClientesComponent)
    },
    {
        path:"registrar-pedido",
        loadComponent:()=>import('./registrar-pedido/registrar-pedido.component').then(c=>c.RegistrarPedidoComponent)
    },
    {
        path:"reportes",
        loadComponent:()=>import('./reporte-pedido/reporte-pedido.component').then(c=>c.ReportePedidoComponent)
    },
    {
        path:'',
        redirectTo: 'libros',
        pathMatch:'full'
    },
    {
        path:'**',
        redirectTo:'libros'
    }

];

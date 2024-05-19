import { Provider } from "@angular/core";
import { Category } from "./icategory";

export interface IResProduct {
    total: number;
    data: Product[];
    producto:Product;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Product {
    id?: number;
    codigo_barras?: string;
    nombre: string;
    descripcion?: string;
    imagen?:string | null;
    pvp: number;
    costo: number;
    stock: number;
    categoria_id: number;
    proveedor_id: number;

    proveedor?:Provider;
    categoria?:Category;
    
    fecha_elaboracion?: Date;
    fecha_vencimiento?: Date;
    fecha_adquisicion?: Date;
}

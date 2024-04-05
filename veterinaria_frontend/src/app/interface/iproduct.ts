export interface IResProduct {
    total: number;
    data: Product[];
    status: string;
    message: string;
    error: string;
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
    fecha_elaboracion?: Date;
    fecha_vencimiento?: Date;
    fecha_adquisicion?: Date;
}

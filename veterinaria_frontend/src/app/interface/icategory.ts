export interface IResCategory {
    total?: number;
    data: Category[];
    status: string;
    message: string;
    error: string;
}

export interface Category {
    id?: number;
    nombre: string;
    descripcion:string;
}

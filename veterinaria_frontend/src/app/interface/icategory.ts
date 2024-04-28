export interface IResCategory {
    total?: number;
    data: Category[];
    categoria:Category;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Category {
    id?: number;
    nombre: string;
    descripcion:string;
}

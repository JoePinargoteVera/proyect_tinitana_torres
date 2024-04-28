
export interface IResUser {
    total?: number;
    data: User[];
    user: User;
    token: string;
    status: string;
    error:string;
    message: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface User {
    id?: number;
    name: string;
    nombres?:string;
    apellidos?:string;
    cedula?:string
    password: string;
    email: string;
    rol: string;
    telefono?: string;
    direccion?: string;
    imagen?: string | null;

}

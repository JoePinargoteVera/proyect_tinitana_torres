export interface IResClient {
    total: number;
    data: Client[];
    Cliente:Client;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Client {
    id?: number;
    cedula: string;
    nombres: string;
    apellidos: string;
    direccion?: string;
    telefono_uno?: string;
    telefono_dos?: string;
    email: string;
    nacionalidad?: string;
    estado: boolean;
    fecha_nacimiento?: Date;
    genero?: string;
    imagen?:string;

}

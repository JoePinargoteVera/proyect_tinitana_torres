export interface IResClient {
    total: number;
    data: Client[];
    status: string;
    message: string;
    error: string;
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

}

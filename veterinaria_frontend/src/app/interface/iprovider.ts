export interface IResProvider {
    total?: number;
    data: Provider[];
    status: string;
    message: string;
    error: string;
}

export interface Provider {
    id?: number;
    ruc?: string;
    nombre: string;
    direccion?: string;
    telefono_uno?: string;
    telefono_dos?: string;
    email: string;
    razon_social: string;
    fecha_inicio_negocios?: Date;
    imagen?:string | null;
}

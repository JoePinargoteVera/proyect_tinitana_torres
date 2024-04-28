export interface IResProvider {
    total?: number;
    data: Provider[];
    proveedor:Provider;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
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

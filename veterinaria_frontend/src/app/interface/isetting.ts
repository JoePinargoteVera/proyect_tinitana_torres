export interface IResSetting {
    total: number;
    data: Setting[];
    setting:Setting;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Setting {
    id: number;
    iva: number;
    stock_minimo: number;
    ruc: string;
    nombre_empresa?: string;
    telefono_uno?: string;
    telefono_dos?: string;
    email: string;
    imagen: string
    direccion?:string;

}

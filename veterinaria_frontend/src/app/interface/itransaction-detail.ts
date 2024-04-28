export interface IResTransacDetail {
    total: number;
    data: TransacDetail[];
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface TransacDetail {
    id?: number;
    cantidad: number;
    total: number;
    transaccion_id: number;
    producto_id: number;
}

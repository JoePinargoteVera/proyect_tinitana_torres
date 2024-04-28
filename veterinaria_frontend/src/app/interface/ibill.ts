export interface IResBill {
    total: number;
    data: Bill[];
    factura:Bill;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Bill {
    id: number;
    numero?: string;
    subtotal: number;
    descuento?: number;
    iva?: number;
    total: number;
    estado: boolean;
    transaccion_id: number;
    user_id: number;
    fecha_emision?: Date;
}
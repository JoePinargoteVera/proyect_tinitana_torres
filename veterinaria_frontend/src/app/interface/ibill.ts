export interface IResBill {
    total: number;
    data: Bill[];
    status: string;
    message: string;
    error: string;
}

export interface Bill {
    id?: number;
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
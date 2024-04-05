export interface IResTransacDetail {
    total: number;
    data: TransacDetail[];
    status: string;
    message: string;
    error: string;
}

export interface TransacDetail {
    id?: number;
    cantidad: number;
    total: number;
    transaccion_id: number;
    producto_id: number;
}

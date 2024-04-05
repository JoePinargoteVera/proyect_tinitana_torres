import { Time } from "@angular/common";

export interface IResTransaction {
    total: number;
    data: Transaction[];
    status: string;
    message: string;
    error: string;
}

export interface Transaction {
    id: number;
    observacion: string;
    cliente_id: number;
    fecha_elaboracion: Date;
    fecha: Date;
    hora: Time;
}

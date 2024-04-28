import { Time } from "@angular/common";

export interface IResTransaction {
    total: number;
    data: Transaction[];
    transaccion:Transaction;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Transaction {
    id: number;
    observacion: string;
    cliente_id: number;
    fecha_emision: Date;
    fecha: Date;
    hora: Time;
}

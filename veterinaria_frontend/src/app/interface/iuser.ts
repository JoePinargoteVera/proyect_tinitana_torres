import { Binary } from "@angular/compiler";

export interface IResUser {
    total?: number;
    data: User[];
    user: User;
    token: string;
    status: string;
    message: string;
}

export interface User {
    id?: number;
    name: string;
    password: string;
    email: string;
    rol: string;
    telefono?: string;
    direccion?: string;
    imagen?: string | null;

}

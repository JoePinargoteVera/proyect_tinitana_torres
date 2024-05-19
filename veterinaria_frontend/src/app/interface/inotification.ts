export interface IResNotification {
    total?: number;
    data: Notification[];
    notificacion:Notification;
    status: string;
    message: string;
    error: string;
    validationError: {
        [key: string]: string[]; // Cada propiedad de error puede tener un array de mensajes de error
      };
}

export interface Notification {
    id?: number;
    mensaje: string;
    read_at:Date;
}
